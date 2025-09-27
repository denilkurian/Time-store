import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button as MUIButton, Box, CircularProgress } from '@mui/material';
import useCustomToast from '../../hooks/useCustomToast';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ToasterMessage from '../message/Toaster';

interface EnquiryFormInputs {
  name: string;
  email: string;
  phone: string;
  message: string;
  captcha: string
}

interface EnquiryFormProps {
  setIsModalOpen: (isOpen: boolean) => void;
  enquirable: {
    id: number;
    type: string;
  };
}

const EnquiryForm: React.FC<EnquiryFormProps> = ({ setIsModalOpen, enquirable }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<EnquiryFormInputs>();
  const baseUrl = import.meta.env.VITE_BASE_URL
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { showToast } = useCustomToast();
  const [registertoast, setregisterToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [captchaImage, setCaptchaImage] = useState<string>();
  const [captchaTrue, setCaptchaTrue] = useState<boolean>();
  const [captchaValue, setCaptchaValue] = useState<string>();
  const [isReloading, setIsReloading] = useState(false);
  const closeregisterToast = () => {
    setregisterToast(null);
  };

  const onSubmit: SubmitHandler<EnquiryFormInputs> = async (formData) => {
    setIsSubmitting(true);
    // Append additional information
    // const payload = {
    //   ...formData,
    //   enquirable_id: enquirable.id,
    //   enquirable_type: `App\\Models\\${enquirable.type}`,
    // };
    const queryParams = new URLSearchParams();
    queryParams.append("data[attributes][name]", formData.name);
    queryParams.append("data[attributes][email]", formData.email);
    queryParams.append("data[attributes][phone]", formData.phone);
    queryParams.append("data[attributes][enquirable_type]", `App\\Models\\${enquirable.type}`);
    queryParams.append("data[attributes][enquirable_id]", enquirable.id.toString());
    queryParams.append("data[attributes][message]", formData.message);

    try {
      const response = await axios.post(`${baseUrl}/enquiries?${queryParams.toString()}`, {

      });

      if (response.data.status === 'success') {
        setSubmitSuccess(true);
        showToast({ message: 'Enquiry Submitted!', type: 'success' });
      } else {
        showToast({ message: response.data.message || 'There was a problem. Please try again.', type: 'error' });
      }
    } catch (error: any) {
      showToast({ message: `${error.response && error.response.data?.message}`, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchCaptcha = async () => {
    try {
      setIsReloading(true);
      setCaptchaTrue(false);
      setCaptchaValue('');

      const response = await axios.get(`${baseUrl}/captchas`, {
        params: { purpose: 'enquiry' }, // Pass the purpose as a query parameter
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
        purpose: "enquiry"
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
    fetchCaptcha()
  }, [])

  return (
    <div className="bg-lightmode dark:bg-gray-800 p-4 rounded-lg">
      {isSubmitting && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <CircularProgress size="50px" />
          <p className="text-slate-600 dark:text-slate-300">We are submitting your form. Please wait.</p>
        </div>
      )}

      {submitSuccess && (
        <div className="text-center">
          <p className="my-5 text-slate-600 dark:text-slate-300">Enquiry Submitted!</p>
          <Box display="flex" justifyContent="center">
            <MUIButton
              onClick={() => setIsModalOpen(false)}
              variant="contained"
              color="primary"
            >
              Close
            </MUIButton>
          </Box>
        </div>
      )}

      {!isSubmitting && !submitSuccess && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {registertoast && <ToasterMessage message={registertoast.message} type={registertoast.type} closeToast={closeregisterToast} />}
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold dark:text-gray-200">Name</label>
            <input
              type="text"
              id="name"
              className="w-full p-2 rounded-lg dark:bg-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
          </div>

          {/* Email and Phone */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="email" className="block text-sm font-semibold dark:text-gray-200">Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: 'Invalid email format',
                  },
                })}
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>

            <div className="flex-1">
              <label htmlFor="phone" className="block text-sm font-semibold dark:text-gray-200">Mobile Number</label>
              <input
                type="text"
                id="phone"
                className="w-full p-2 rounded-lg dark:bg-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700"
                {...register('phone', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Enter a valid 10-digit mobile number',
                  },
                })}
              />
              {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold dark:text-gray-200">Message</label>
            <textarea
              id="message"
              rows={4}
              className="w-full p-2 rounded-lg dark:bg-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700"
              placeholder="I am interested to know more. Please contact me."
              {...register('message', { required: 'Message is required' })}
            />
            {errors.message && <span className="text-red-500 text-sm">{errors.message.message}</span>}
          </div>

          <div className='flex items-center justify-center gap-2'>

            <div className=''>
              <img className='rounded-lg w-[260px]' src={captchaImage} />
            </div>




            <div className="flex items-center gap-2 ">
              {/* Input Field */}
              <div className="flex items-center py-2 h-[45px] rounded-lg border bg-white dark:bg-gray-800 dark:text-white border-gray-300">
                <input
                  id="password"
                  type="text"
                  value={captchaValue}
                  placeholder="Enter Captcha"
                  onKeyDown={handleCaptchaKeyDown}
                  {...register("captcha", {
                    required: "Captcha is required",
                    onChange: (e) => {
                      handleCaptchaChange(e);
                    },
                  })}
                  className="outline-none pl-2 text-sm w-full dark:bg-gray-800 dark:text-white"
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
              <button onClick={(event) => {
                event.preventDefault();
                fetchCaptcha();
              }}>
                <img
                  title='Reload Captcha'
                  className='text-xs w-9'
                  src='https://static-00.iconduck.com/assets.00/gui-refresh-icon-2048x2048-xgbnerm5.png'
                  style={{
                    animation: isReloading ? "spin 2s linear infinite" : undefined,
                  }}
                />
              </button>
            </div>

          </div>{errors.captcha && <span className="text-red-500 text-sm">{errors.captcha.message}</span>}

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-500 dark:text-white rounded"
            >
              Cancel
            </button>
            {captchaTrue ? <button
              type="submit"
              className={`px-4 py-2 rounded ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#7A5BF5]'} text-white`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Loading...' : 'Submit'}
            </button> :
              <button
                type="submit"
                className={`px-4 py-2 rounded ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#7A5BF5]'} text-white`}
                disabled={true}
              >
                {isSubmitting ? 'Loading...' : 'Submit'}
              </button>
            }
          </div>
        </form>
      )}
    </div>
  );
};

export default EnquiryForm;
