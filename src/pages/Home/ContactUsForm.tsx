import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, CircularProgress } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '../../components/Button/Button';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import axios, { AxiosResponse } from 'axios';
import useCustomToast from '../../hooks/useCustomToast';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ToasterMessage from '../../components/message/Toaster';

const baseUrl = import.meta.env.VITE_BASE_URL;
interface Contact {
    data: {
        attributes: {
            email: string;
            id: number;
            message: string | null;
            name: string;
            phone: string;
        };
        id: number;
        links: {
            self: string;
        };
        type: string;
    };
    message: string;
    status: number;
}
interface ContactFormInputs {
    name: string;
    email: string;
    phone: string;
    message: string;
}

const ContactUsForm: React.FC = () => {
    const { showToast } = useCustomToast();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { darkMode } = useSelector((state: RootState) => state.theme);
    const [loading, setLoading] = useState<boolean>(false);
    const [registertoast, setregisterToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
    const [captchaImage, setCaptchaImage] = useState<string>();
    const [captchaTrue, setCaptchaTrue] = useState<boolean>();
    const [captchaValue, setCaptchaValue] = useState<string>();
    const [isReloading, setIsReloading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<ContactFormInputs>();
    const closeregisterToast = () => {
        setregisterToast(null);
    };

    const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
        setLoading(true)
        try {
            console.log(data)
            const response: AxiosResponse<Contact> = await axios.post(`${baseUrl}/contact`, data);
            if (response.status === 200) {
                showToast({ message: "Sent successfully", duration: 3000, type: 'success' });
                handleClose();
            }
        } catch (error: any) {
            if (error.status === 422) {
                showToast({ message: error.response.data.message, duration: 3000, type: 'info' })
            }
            showToast({ message: error.response.data.message, duration: 3000, type: 'error' })
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.stopPropagation();
        }
    };

    const modalStyles = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: darkMode ? '#333' : 'background.paper',
        color: darkMode ? '#fff' : '#000',
        boxShadow: 24,
        p: 3,
        borderRadius: 2,
    };
    // skjdkjhsdjk
    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
            height: '50px',
            '& fieldset': {
                borderColor: darkMode ? '#555' : '#ccc',
            },
            '&:hover fieldset': {
                borderColor: darkMode ? '#888' : '#888',
            },
            '&.Mui-focused fieldset': {
                borderColor: darkMode ? '#00bcd4' : '#1976d2',
            },
            '& input': {
                color: darkMode ? '#fff' : '#000',
            },
        },
        '& .MuiInputLabel-root': {
            color: darkMode ? '#aaa' : '#555',
        },
    };

    const closeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        handleClose();
    };


    const fetchCaptcha = async () => {
        try {
            setIsReloading(true);
            setCaptchaTrue(false);
            setCaptchaValue('');

            const response = await axios.get(`${baseUrl}/captchas`, {
                params: { purpose: 'contact_us' }, // Pass the purpose as a query parameter
            });

            const captcha_token = response.data.data.token;
            const captcha_id = response.data.data.id;

            localStorage.setItem('captcha_token', captcha_token);
            localStorage.setItem('captcha_id', captcha_id);
            setCaptchaImage(response.data.data.captcha_image);
            return response.data;
        } catch (error) {
            console.error('Error fetching captcha:', error);
            throw error;
        } finally {
            setIsReloading(false);
        }
    };

    const submitCaptcha = async () => {
        try {
            // Retrieve data from localStorage
            const captcha_id = localStorage.getItem("captcha_id");
            const captcha_token = localStorage.getItem("captcha_token");
            const user_input = captchaValue

            if (!captcha_id || !captcha_token || !user_input) {
                setregisterToast({
                    message: 'Missing captcha details. Please try again.',
                    type: 'error',
                });
                return;
            }

            // Prepare data for the POST request
            const requestData = {
                captcha_id: Number(captcha_id), // Convert to number since localStorage stores strings
                user_input,
                token: captcha_token,
                purpose: "contact_us"
            };

            // Make the POST request
            const response = await axios.post(`${baseUrl}/captchas/verify`, requestData);
            console.log(response)

            if (response.status === 200) {
                setregisterToast({
                    message: 'Captcha verified. Please submit.',
                    type: 'success',
                });
                setCaptchaTrue(true)
            } else {
                setregisterToast({
                    message: 'Failed to verify captcha. Please try again.',
                    type: 'error',
                });
            }
        } catch (error: any) {
            console.log('sss')
            const errorResponse = error.response?.data;
            const errorMessage =
                errorResponse?.message ||
                errorResponse?.errors?.captcha_id?.[0] ||
                'An error occurred while verifying the captcha.';

            setregisterToast({
                message: errorMessage,
                type: 'error',
            });
        }

    }

    const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCaptchaValue(e.target.value);
    };

    const handleCaptchaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!captchaTrue) {
                console.log('Submitting Captcha...');
                submitCaptcha();
            }
        }
    };

    useEffect(() => {
        if (open) {
            fetchCaptcha();  // Triggering fetch when modal opens
        }
    }, [open]);  // Run this effect when the modal opens
    

    return (
        <>
            <button
                className='bg-[#7A5BF5] hover:bg-[#6d49d6] text-white w-[118px] h-[34px] text-sm rounded-lg transition-all'
                onClick={handleOpen}
            >
                Contact Us
            </button>

            <Modal open={open} onClose={handleClose}>

                <Box sx={{
                    ...modalStyles,
                    backgroundColor: darkMode
                        ? 'rgb(31 41 55 / var(--tw-bg-opacity, 1))' // Dark mode background (adjusted for better contrast)
                        : 'rgb(246 239 255 / var(--tw-bg-opacity, 1))', // Light mode background
                    borderRadius: '8px', // Rounded corners
                    padding: '16px', // Inner spacing
                    border: '2px solid', // Explicit border style
                    borderColor: darkMode ? '#555' : '#ccc', // Dynamic border color
                    zIndex: 1300, // Ensures the modal appears above other content

                }}
                >

                    <Typography variant="h5" component="h2" align="center" mb={2}>
                        Contact Us
                    </Typography>
                    {registertoast && <ToasterMessage message={registertoast.message} type={registertoast.type} closeToast={closeregisterToast} />}
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            label="Name"
                            fullWidth
                            margin="normal"
                            {...register('name', { required: 'Name is required' })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            sx={textFieldStyles}
                        />

                        <TextField
                            label="Email"
                            fullWidth
                            margin="normal"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Enter a valid email address',
                                },
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            sx={textFieldStyles}
                        />

                        <TextField
                            label="Phone"
                            fullWidth
                            margin="normal"
                            {...register('phone', {
                                required: 'Phone is required',
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Phone number must contain only digits',
                                },
                                validate: (value) =>
                                    value.length === 10 || 'Phone number must be exactly 10 digits',
                            })}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                            sx={textFieldStyles}
                        />

                        <TextField
                            label="Message"
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            {...register('message')}
                            helperText={errors.message?.message}
                            onKeyDown={handleKeyDown}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '150px',
                                    overflow: 'auto',
                                    '& textarea': {
                                        resize: 'none',
                                        color: darkMode ? '#fff' : '#000',
                                    },
                                    '& fieldset': {
                                        borderColor: darkMode ? '#555' : '#ccc',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: darkMode ? '#888' : '#888',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: darkMode ? '#00bcd4' : '#1976d2',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: darkMode ? '#aaa' : '#555',
                                },
                            }}
                        />





                        <div className="flex items-center gap-1 py-4">
                            {/* Captcha Image */}
                            <img
                                className="rounded-lg w-[170px] object-cover"
                                src={captchaImage}
                                alt="Captcha"
                            />

                            {/* Input Field */}
                            <div className="flex items-center rounded-lg border dark:bg-gray-800 dark:text-white border-gray-300 w-[250px]">
                                <input
                                    id="captcha"
                                    type="text"
                                    value={captchaValue}
                                    placeholder="Enter Captcha"
                                    onKeyDown={handleCaptchaKeyDown}
                                    onChange={(e) => handleCaptchaChange(e)}
                                    className="outline-none px-2 py-1 rounded-md w-full text-sm dark:bg-gray-800 dark:text-white border-none h-[40px]"
                                />
                            </div>


                            {/* Submit Button */}
                            {!captchaTrue && (
                                <button
                                    type="button"
                                    title="Submit Captcha"
                                    onClick={submitCaptcha}
                                    className="flex items-center justify-center px-4 py-2 bg-[#7A5BF5] text-white rounded-lg h-[40px] w-[40px]"
                                >
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            )}

                            {/* Reload Button */}
                            <button
                                onClick={(event) => {
                                    event.preventDefault();
                                    fetchCaptcha();
                                }}
                                title="Reload Captcha"
                                className="flex items-center justify-center w-[60px] h-[40px] p-2"
                            >
                                <img
                                    className={`w-5 h-5 ${isReloading ? "animate-spin" : ""
                                        }`}
                                    src="https://static-00.iconduck.com/assets.00/gui-refresh-icon-2048x2048-xgbnerm5.png"
                                    alt="Reload"
                                />
                            </button>
                        </div>



                        <Box mt={2} display="flex" justifyContent="space-between">
                            <Button type="normal"  Buttonclass='rounded-lg bg-gray-400' onClick={closeHandler}>
                                Cancel
                            </Button>
                            {captchaTrue ?
                                <Button type="primary" Buttonclass='rounded-lg' >
                                    {loading ? (
                                        <>
                                            <CircularProgress color="inherit" size={20} thickness={8} />
                                        </>
                                    ) : (
                                        <span>Submit</span>
                                    )}
                                </Button> : <Button type="primary" disabled={true} Buttonclass='rounded-lg bg-gray-400 cursor-not-allowed' ><span>Submit</span></Button>}

                            {/* Submit Button */}


                        </Box>
                    </form>
                </Box >
            </Modal >
        </>
    );
};

export default ContactUsForm;