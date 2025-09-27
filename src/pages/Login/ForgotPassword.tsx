import React, { useState } from "react";
import axios from "axios";
import ToasterMessage from "../../components/message/Toaster";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { CircularProgress } from "@mui/material";


interface ForgotPasswordProps {
    onClose: () => void,
    successmessage: (messageObj: { message: string; type: 'success' | 'error' | 'info' } | null) => void;
}


interface ForgotPasswordFormData {
    email: string;
    otp: string;
    password: string
}


const ForgetPassword: React.FC<ForgotPasswordProps> = ({ onClose, successmessage }) => {

    const [step, setStep] = useState<"email" | "otp" | "password">("email");
    const [isForgotPasswordToastVisible, setForgotPasswordToastVisible] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
    const [isotpToastVisible, setotpToastVisible] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
    // const [ispasswordtVisible, setpasswordVisible] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
    const [newpasswordType, setnewPasswordType] = useState("password");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const closeloginToast = () => {
        setForgotPasswordToastVisible(null);
        setotpToastVisible(null)
        // setpasswordVisible(null)
    };

    // Using default useForm hook
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ForgotPasswordFormData>();


    useEffect(() => {
        if (step === "email") {
            setForgotPasswordToastVisible(null);
        }
    }, [step]);

    // Email submit
    const handleEmailSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
        try {
            setIsSubmitting(true);
            const baseUrl = import.meta.env.VITE_BASE_URL;
            const response = await axios.post(`${baseUrl}/forgot-password`, { email: data.email });

            const cache_email = data.email;

            if (response.status === 200) {
                // Extract the appropriate string message
                const successMessage = response.data.message?.message || 'OTP sent successfully.';

                setForgotPasswordToastVisible({ message: successMessage, type: 'success' });

                localStorage.setItem("cache_email", cache_email);
                // Transition to OTP step after displaying the success message
                setStep("otp");
            } else {
                setForgotPasswordToastVisible({ message: response.data.message, type: 'error' });
            }
        } catch (error: any) {
            if (error.response && error.response.data?.message) {
                setForgotPasswordToastVisible({ message: error.response.data.message, type: 'error' });
            } else {
                setForgotPasswordToastVisible({ message: "An unexpected error occurred. Please try again later.", type: 'error' });
            }
        }
        finally {
            setIsSubmitting(false); // Hide the loader
        }
    };




    // Otp submit
    const handleOtpSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
        const cache_email = localStorage.getItem('cache_email');
        try {
            setIsSubmitting(true);
            const baseUrl = import.meta.env.VITE_BASE_URL;
            const response = await axios.post(`${baseUrl}/enter-otp`, { email: cache_email, otp: data.otp });

            if (response.status === 200) {
                const successMessage = response.data.message?.message || 'OTP Submitted Successfully, Enter new Password.';
                const cache_token = response.data.message.token;
                localStorage.setItem("cache_token", cache_token);
                setotpToastVisible({ message: successMessage, type: 'success' });
                setStep("password");  // Proceed to password step
            } else {
                setotpToastVisible({ message: response.data.message, type: 'error' });
            }
        } catch (error: any) {
            if (error.response && error.response.data?.message) {
                setotpToastVisible({ message: error.response.data.message, type: 'error' });
            } else {
                setotpToastVisible({ message: "An unexpected error occurred. Please try again later.", type: 'error' });
            }
        }
        finally {
            setIsSubmitting(false); // Hide the loader
        }
    };


    // Password submit
    const handlePasswordSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
        try {
            setIsSubmitting(true);
            const baseUrl = import.meta.env.VITE_BASE_URL;
            const cache_email = localStorage.getItem('cache_email');
            const cache_token = localStorage.getItem('cache_token');

            const response = await axios.post(`${baseUrl}/reset-password`, {
                email: cache_email,
                token: cache_token,
                new_password: data.password,
            });

            if (response.status === 200) {
                // setpasswordVisible({ message: response.data.message || 'Password reset successfully.', type: 'success' });
                const messageObj: { message: string; type: 'success' | 'error' | 'info' } = {
                    message: response.data.message || 'Password reset successfully.',
                    type: 'success',
                };
                successmessage(messageObj)

                reset();
                localStorage.removeItem('cache_email');
                localStorage.removeItem('cache_token');
                onClose();


            } else {
                // setpasswordVisible({ message: response.data.message, type: 'error' });
                localStorage.removeItem('cache_email');
                localStorage.removeItem('cache_token');
            }
        } catch (error: any) {
            // setpasswordVisible({ message: "An unexpected error occurred. Please try again later.", type: 'error' });

            // Clear cache in case of an error
            localStorage.removeItem('cache_email');
            localStorage.removeItem('cache_token');
        }
        finally {
            setIsSubmitting(false); // Hide the loader
            reset()
        }
    };


    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Call the appropriate function based on the current step
            if (step === 'email') {
                handleSubmit(handleEmailSubmit)();
            } else if (step === 'otp') {
                handleSubmit(handleOtpSubmit)(); // Validate OTP
            } else if (step === 'password') {
                handleSubmit(handlePasswordSubmit)();
            }
        }
    };


    useEffect(() => {
    }, [step]);


    return (
        <>

            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">


                <div className="bg-[#251D3F] rounded-lg shadow-lg w-3/4 lg:w-1/3 relative">

                    <div className="bg-[#7A5BF5] text-white p-5">
                        <h2 className="text-center text-white text-2xl font-semibold">Forgot Password</h2>
                    </div>
                    <button title="Close"
                        className="absolute top-2 right-2 text-white text-xl p-2 rounded-full w-10 h-10 flex items-center justify-center"
                        onClick={onClose}
                    >
                        X
                    </button>

                    <div>


                        {step === "email" && (

                            <div className="p-6">
                                <form onSubmit={handleSubmit(handleEmailSubmit)}>
                                    {isForgotPasswordToastVisible && (
                                        <ToasterMessage
                                            message={isForgotPasswordToastVisible.message}
                                            type={isForgotPasswordToastVisible.type}
                                            closeToast={closeloginToast}
                                        />
                                    )}
                                    <h3 className="text-white">Email</h3>
                                    <div className="p-2 rounded-lg border bg-[#251D3F]  border-gray-300 mb-4">
                                        <input
                                            type="email"
                                            placeholder="Enter Your Email"
                                            className="outline-none ps-2 text-sm w-full bg-[#251D3F] text-white"
                                            onKeyDown={handleKeyDown}
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "Invalid email format",
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`mt-3 py-2 px-4 rounded-lg w-full ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r bg-[#7A5BF5] text-white"
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <CircularProgress color="inherit" size={20} thickness={8} />

                                        ) : (
                                            "Next"
                                        )}
                                    </button>

                                </form>
                            </div>


                        )}

                        {step === "otp" && (

                            <>
                                <div className="p-6">
                                    <form onSubmit={handleSubmit(handleOtpSubmit)}>
                                        {isForgotPasswordToastVisible?.type === 'success' && <ToasterMessage message={isForgotPasswordToastVisible.message} type={isForgotPasswordToastVisible.type} closeToast={closeloginToast} />}


                                        {isotpToastVisible && <ToasterMessage message={isotpToastVisible.message} type={isotpToastVisible.type} closeToast={closeloginToast} />}

                                        <h3 className="text-white">Enter OTP</h3>
                                        <div className="p-2 mt-2 rounded-lg border bg-[#251D3F] text-white border-gray-300">
                                            <input
                                                type="text"
                                                placeholder="OTP"
                                                className="outline-none ps-2 text-sm w-full bg-[#251D3F] text-white"
                                                onKeyDown={handleKeyDown}
                                                {...register("otp", {
                                                    required: "Otp is required",
                                                    minLength: {
                                                        value: 4,
                                                        message: "Otp must be 4 characters",
                                                    },
                                                })}
                                            />
                                        </div>
                                        {errors.otp && <p className="text-red-500 text-sm mb-2">{errors.otp.message}</p>}


                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`mt-3 py-2 px-4 rounded-lg w-full ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r bg-[#7A5BF5] text-white"
                                                }`}
                                        >
                                            {isSubmitting ? (
                                                <CircularProgress color="inherit" size={20} thickness={8} />

                                            ) : (
                                                "Verify"
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}

                        {step === "password" && (
                            <div className="p-6">
                                <form onSubmit={handleSubmit(handlePasswordSubmit)}>
                                    {isotpToastVisible?.type === 'success' && <ToasterMessage message={isotpToastVisible.message} type={isotpToastVisible.type} closeToast={closeloginToast} />}

                                    {/* {ispasswordtVisible && <ToasterMessage message={ispasswordtVisible.message} type={ispasswordtVisible.type} closeToast={closeloginToast} />} */}

                                    <h3 className="text-white">Enter Password</h3>
                                    <div className="p-2 mt-2 rounded-lg border bg-[#251D3F] text-white border-gray-300 flex items-center">
                                        <input
                                            type={newpasswordType}
                                            placeholder="Password"
                                            className="outline-none ps-2 text-sm w-full bg-[#251D3F] text-white" onKeyDown={handleKeyDown}
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 8,
                                                    message: "Password must be at least 8 characters",
                                                },
                                            })}
                                        />
                                        <>
                                            {newpasswordType === "password" ? (
                                                <FiEyeOff
                                                    onClick={() => setnewPasswordType("text")}
                                                    size={18}
                                                />
                                            ) : (
                                                <FiEye
                                                    onClick={() => setnewPasswordType("password")}
                                                    size={18}
                                                />
                                            )}</>

                                    </div>
                                    {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`mt-3 py-2 px-4 rounded-lg w-full ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r bg-[#7A5BF5] text-white"
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <CircularProgress color="inherit" size={20} thickness={8} />

                                        ) : (
                                            "Submit"
                                        )}
                                    </button>

                                </form>  </div>
                        )}

                    </div>

                </div>
            </div>
        </>
    );
};

export default ForgetPassword;