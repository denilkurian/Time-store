import React, { useState } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import ToasterMessage from '../../components/message/Toaster';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';


interface RegistrationFormProps {
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    errors: FieldErrors<RegistrationFormInputs>;
    register: UseFormRegister<RegistrationFormInputs>;
    handleRegisterKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
    registertoast: {
        message: string;
        type: "error" | "success" | "info";
    } | null;
    closeregisterToast: () => void
    closeForgotPasswordModal: () => void;
    fetchCaptcha: () => Promise<any>;
    captchaImage: string;
    submitCaptcha: (e?: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    captchaTrue: boolean;
    handleCaptchaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    captchaValue: string;
    isReloading: boolean;
}


interface RegistrationFormInputs {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
    captcha: string;
}


const RegistrationForm: React.FC<RegistrationFormProps> = ({
    handleSubmit,
    errors,
    register,
    handleRegisterKeyDown,
    registertoast,
    closeregisterToast,
    closeForgotPasswordModal,
    fetchCaptcha,
    captchaImage,
    submitCaptcha,
    captchaTrue,
    handleCaptchaChange,
    captchaValue,
    isReloading

}) => {
    const [passwordType, setPasswordType] = useState("password");
    const [newpasswordType, setNewPasswordType] = useState("password");

    const handleCaptchaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // console.log(`Key Pressed: ${e.key}, Captcha True: ${captchaTrue}`);
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!captchaTrue) {
                console.log('Submitting Captcha...');
                submitCaptcha();
            }
        }
    };



    return (
        <>

            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 ">

                <div className="bg-white rounded-lg shadow-lg w-3/4 lg:w-1/3 relative">

                    <div className="bg-gradient-to-r  bg-[#7A5BF5] text-white p-5">
                        <h2 className="text-center text-white text-2xl font-semibold">Register</h2>
                    </div>
                    <button title='close'
                        className="absolute top-2 right-2 text-white text-xl p-2 rounded-full w-10 h-10 flex items-center justify-center"
                        onClick={closeForgotPasswordModal}
                    >X</button>





                    <div className="p-6 bg-[#251D3F]">
                        {registertoast && <ToasterMessage message={registertoast.message} type={registertoast.type} closeToast={closeregisterToast} />}
                        <form onSubmit={handleSubmit}>
                            <div className="md:flex md:gap-x-4 mb-4 justify-between">
                                <div className="md:w-1/2  mb-4 md:mb-0">
                                    <label className="font-semibold text-sm text-white/85">
                                        First Name
                                    </label>
                                    <div className="p-2 mt-2 rounded-lg border bg-[#251D3F] border-gray-300 ">
                                        <input
                                            id="firstName"
                                            type="text"
                                            placeholder="Enter your first name"
                                            className="outline-none ps-2 text-sm w-full bg-[#251D3F] text-white" onKeyDown={handleRegisterKeyDown}
                                            {...register("first_name", {
                                                required: "First name is required",
                                                maxLength: {
                                                    value: 22,
                                                    message: "First name cannot exceed 22 characters"
                                                }
                                            })}
                                        />

                                    </div>
                                    {errors.first_name && <span className="text-red-500 text-sm">{errors.first_name.message}</span>}
                                </div>
                                <br />

                                {/* Last Name */}
                                <div className="md:w-1/2  mb-4 md:mb-0">
                                    <label className="font-semibold text-sm text-white/85">
                                        Last Name
                                    </label>
                                    <div className="p-2 mt-2 rounded-lg border bg-[#251D3F] text-white border-gray-300">
                                        <input
                                            id="lastName"
                                            type="text"
                                            placeholder="Enter your last name"
                                            className="outline-none ps-2 text-sm w-full bg-[#251D3F] text-white" onKeyDown={handleRegisterKeyDown}
                                            {...register("last_name", {
                                                required: "Last name is required",
                                                maxLength: {
                                                    value: 22,
                                                    message: "Last name cannot exceed 22 characters"
                                                }

                                            },
                                            )}
                                        />
                                    </div>           {errors.last_name && <span className="text-red-500 text-sm">{errors.last_name.message}</span>}
                                </div>    </div>
                            <br />

                            {/* Email */}
                            <div className="md:flex md:gap-x-4 mb-4 justify-between">
                                <div className="md:w-1/2  mb-4 md:mb-0">
                                    <label className="font-semibold text-sm text-white/85">
                                        Email
                                    </label>
                                    <div className="p-2 mt-2 rounded-lg border bg-[#251D3F] text-white border-gray-300">
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="outline-none ps-2 text-sm w-full bg-[#251D3F] text-white" onKeyDown={handleRegisterKeyDown}
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                    message: "Invalid email format"
                                                }
                                            })}
                                        />
                                    </div>{errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                                </div>
                                <br />

                                {/* Mobile */}
                                <div className="md:w-1/2  mb-4 md:mb-0">
                                    <label className="font-semibold text-sm text-white/85">
                                        Mobile
                                    </label>
                                    <div className="p-2 mt-2 rounded-lg border bg-[#251D3F] text-white border-gray-300">
                                        <input
                                            id="mobile"
                                            type="text"
                                            placeholder="Enter your mobile number"
                                            className="outline-none ps-2 text-sm w-full bg-[#251D3F] text-white" onKeyDown={handleRegisterKeyDown}
                                            {...register("phone", {
                                                required: "Mobile number is required",
                                                pattern: {
                                                    value: /^[6-9]\d{9}$/,
                                                    message: "Enter a valid 10-digit mobile number starting with 6-9",
                                                },
                                            })}
                                        />
                                    </div>{errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                                </div></div>
                            <br />

                            {/* Password */}
                            <div className="md:flex md:gap-x-4 mb-4 justify-between">
                                <div className="md:w-1/2  mb-4 md:mb-0">
                                    <label className="font-semibold text-sm text-white/85">
                                        Password
                                    </label>
                                    <div className="flex p-2 mt-2 rounded-lg border bg-[#251D3F] text-white border-gray-300">
                                        <input
                                            id="password"
                                            type={passwordType}
                                            placeholder="Enter your password"
                                            className="outline-none ps-2 text-sm w-full bg-[#251D3F] text-white" onKeyDown={handleRegisterKeyDown}
                                            {...register("password", { required: "Password is required" })}
                                        />
                                        {passwordType === "password" ? (
                                            <FiEyeOff
                                                onClick={() => setPasswordType("text")}
                                                size={18}
                                            />
                                        ) : (
                                            <FiEye
                                                onClick={() => setPasswordType("password")}
                                                size={18}
                                            />
                                        )}
                                    </div>  {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}</div>
                                <br />

                                {/* Confirm Password */}
                                <div className="md:w-1/2  mb-4 md:mb-0">
                                    <label className="font-semibold text-sm text-white/85">Confirm Password</label>
                                    <div className="flex p-2 mt-2 rounded-lg border bg-[#251D3F] text-white border-gray-300">
                                        <input
                                            id="confirmPassword"
                                            type={newpasswordType}
                                            placeholder="Re-enter your password"
                                            className="outline-none ps-2 text-sm w-full bg-[#251D3F] text-white"
                                            {...register("confirm_password", {
                                                required: "Confirm password is required",

                                            })}
                                        />
                                        {newpasswordType === "password" ? (
                                            <FiEyeOff
                                                onClick={() => setNewPasswordType("text")}
                                                size={18}
                                            />
                                        ) : (
                                            <FiEye
                                                onClick={() => setNewPasswordType("password")}
                                                size={18}
                                            />
                                        )}
                                    </div>
                                    {errors.confirm_password && (
                                        <span className="text-red-500 text-sm">
                                            {errors.confirm_password.message}
                                        </span>
                                    )}
                                </div> </div>


                            <br />

                            <div className='md:flex items-center gap-6'>

                                <img className='rounded-lg' src={captchaImage} />


                                <button onClick={(event) => {
                                    event.preventDefault();
                                    fetchCaptcha();
                                }}>
                                    <img
                                        title='Reload Captcha'
                                        className='text-xs w-7'
                                        src='https://static-00.iconduck.com/assets.00/gui-refresh-icon-2048x2048-xgbnerm5.png'
                                        style={{
                                            animation: isReloading ? "spin 2s linear infinite" : undefined,
                                        }}
                                    />

                                </button>
                                <div className="flex items-center gap-2">
                                    {/* Input Field */}
                                    <div className="flex items-center p-2 rounded-lg border bg-[#251D3F] text-white border-gray-300">
                                        <input
                                            id="password"
                                            type="text"
                                            value={captchaValue}
                                            placeholder="Enter Captcha"
                                            onChange={handleCaptchaChange}
                                            className="outline-none pl-2 text-sm w-full bg-[#251D3F] text-white"
                                            onKeyDown={handleCaptchaKeyDown}
                                        // {...register("captcha", { required: "Captcha is required" })}
                                        />
                                    </div>

                                    {/* Button */}
                                    {!captchaTrue && <button
                                        type="button"
                                        title="Submit Captcha"
                                        onClick={submitCaptcha}
                                        className="flex items-center justify-center px-3 py-3 bg-[#7A5BF5] text-white rounded-lg"
                                    >
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </button>}

                                </div>

                            </div>{errors.captcha && <span className="text-red-500 text-sm">{errors.captcha.message}</span>}



                            {/* Submit Button */}

                            {captchaTrue ? <button
                                type="submit"
                                className="mt-5 bg-gradient-to-r bg-[#7A5BF5] text-white p-3 rounded-lg w-full"
                            >
                                Submit
                            </button> : <button
                                disabled={true}
                                className="mt-5 bg-gradient-to-r bg-[#b9b9bc] text-white p-3 rounded-lg w-full cursor-not-allowed"
                            >
                                Submit
                            </button>}
                        </form>
                    </div>
                </div></div >
        </>
    )
};

export default RegistrationForm;