import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Modal from "../../components/Modal/Modal";
import RegistrationForm from "../Registration/Registration";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ToasterMessage from "../../components/message/Toaster";
import Forgetpasswsord from "./ForgotPassword";
import { jwtDecode } from "jwt-decode";
import { setAuth } from "../../redux/reducer/authSlice";
import { useDispatch } from "react-redux";
import LoginLoader from "../../components/Loader/LoginLoader";




interface LoginFormData {
  email: string;
  password: string;
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



const Login: React.FC = () => {

  const baseUrl = import.meta.env.VITE_BASE_URL
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState("password");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [registertoast, setregisterToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const closeregisterToast = () => {
    setregisterToast(null);
  };


  // Register Button
  const handleRegisterButton = () => {
    setIsModalOpen(true)
    fetchCaptcha()
  }

  // Captcha Code in Registration
  const [captchaImage, setCaptchaImage] = useState('')
  const [captchaTrue, setCaptchaTrue] = useState(false)
  const [captchaValue, setCaptchaValue] = useState('');
  const [isReloading, setIsReloading] = useState(false);

  const fetchCaptcha = async () => {
    try {
      setIsReloading(true);
      setCaptchaTrue(false);
      setCaptchaValue('');

      // Add the 'purpose' query parameter to the URL
      const response = await axios.get(`${baseUrl}/captchas`, {
        params: { purpose: 'registration' }, // Pass the purpose as a query parameter
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


  // Form 1: Registration Form
  const {
    handleSubmit: handleRegisterSubmit,
    register: registerFields,
    formState: { errors: registerErrors },
    reset: resetRegister,
  } = useForm<RegistrationFormInputs>();


  const registerdata = async (registerdata: RegistrationFormInputs) => {
    try {
      setLoading(true); // Start loader when function is called

      if (registerdata.password !== registerdata.confirm_password) {
        setregisterToast({
          message: 'Passwords do not match. Please try again.',
          type: 'error',
        });
        setLoading(false); // Ensure loader is stopped here
        return; // Prevent submission if passwords don't match
      }

      const response = await axios.post(`${baseUrl}/register`, registerdata);

      if (response.status === 200) {
        setregisterToast({
          message: 'Registration successful. Please Login.',
          type: 'success',
        });
        setIsModalOpen(false);
        localStorage.removeItem('captcha_token')
        localStorage.removeItem('captcha_token')
      } else {
        setregisterToast({
          message: response.data.message || 'Registration failed. Please try again.',
          type: 'error',
        });
      }
      setCaptchaTrue(false)

      resetRegister(); // Reset form
    } catch (error: any) {
      if (error.response?.data?.message) {
        setregisterToast({
          message: error.response.data.message,
          type: 'error',
        });
      } else {
        setregisterToast({
          message: 'An error occurred. Please try again later.',
          type: 'error',
        });
      }
    } finally {
      setLoading(false); // Stop loader in all cases (success, failure, or early exit)
    }
  };


  // Handle input change directly
  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaptchaValue(e.target.value);
  };


  //  Captcha API submission
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
        purpose : "registration"
      };

      // Make the POST request
      const response = await axios.post(`${baseUrl}/captchas/verify`, requestData);

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
      const errorResponse = error.response?.data; // Adjust based on your API client (e.g., Axios)
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


  const handleRegistrationSubmit: SubmitHandler<RegistrationFormInputs> = async (data) => {
    await registerdata(data)
  };


  const handleRegisterKeyfunction = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (captchaTrue && e.key === 'Enter') {
      e.preventDefault();
      handleRegisterSubmit(handleRegistrationSubmit)();
    }
  };


  // Form 2: Login Form
  const [logintoast, setloginToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const closeloginToast = () => {
    setloginToast(null);
  };


  const {
    handleSubmit: handleLoginSubmit,
    register: loginFields,
    formState: { errors: loginErrors }
  } = useForm<LoginFormData>();


  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const datas = async (loginData: LoginFormData) => {

    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/login`, loginData);

      if (response.status === 200) {
        const { token } = response.data.data;
        const decoded: any = jwtDecode(token); // Decode the JWT token

        dispatch(setAuth({ token })); // Dispatch the action to Redux

        // Store the token in localStorage
        localStorage.setItem('token', token);

        // Redirect based on the user type and status
        if (decoded.type === "admin" && ["active"].includes(decoded.status)) {
          navigate('/dashboard');
        } else if (["vendor", "customer"].includes(decoded.type) &&
          ["pending_approval", "unverified", "revision", "pending_change_approval", "active"].includes(decoded.status)) {
          navigate('/');
        } else if (["vendor", "customer"].includes(decoded.type) && decoded.status === "blocked") {
          navigate('/user-blocked');
        } else {
          setloginToast({ message: 'Invalid user type or status', type: 'error' });
        }
        setLoading(false)
      } else {
        setloginToast({ message: response.data.message || 'Login failed. Please try again.', type: 'error' });
        setLoading(false)
      }

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again later.';
      setloginToast({ message: errorMessage, type: 'error' });
      setLoading(false)
    }
  };


  const onLoginSubmit: SubmitHandler<LoginFormData> = async (data) => {
    await datas(data);
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLoginSubmit(onLoginSubmit)(); 
    }
  };



  // forget password
  const [ispasswordtVisible, setpasswordVisible] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);


  const handleSuccessMessage = (messageObj: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null) => {
    setpasswordVisible(messageObj); // Update the state with the message object
  };

  const closeresetToast = () => {
    setpasswordVisible(null)
  }


  // Form 3: Change password
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };


  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <LoginLoader />
        </div>
      )}

      <div className="min-h-screen">


        <div className="grid grid-cols-1 md:grid-cols-12">

          <div className="col-span-6 min-h-screen bg-login-page bg-cover bg-center bg-no-repeat hidden md:flex justify-center">

            <div className="mt-32 px-1">

              <p className="mx-14 text-xl  lg:text-4xl  text-blue-950">
                The secret of selling is to sell
                something you believe in. ...
              </p>
            </div>
          </div>

          <div className="bg-[#251D3F] col-span-12 md:col-span-6 min-h-screen flex justify-center items-center">
            <div className="w-full px-6 md:px-10">
              <div className="flex flex-col justify-center">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">

                  <div>
                    {ispasswordtVisible && (
                      <ToasterMessage
                        message={ispasswordtVisible.message}
                        type={ispasswordtVisible.type}
                        closeToast={closeresetToast}
                      />
                    )}

                    {registertoast?.message === 'Registration successful. Please Login.' && <ToasterMessage message={registertoast.message} type={registertoast.type} closeToast={closeregisterToast} />}

                    <h1 className="font-semibold text-2xl text-white mb-5 text-center md:text-left">
                      Login
                    </h1>
                  </div>
                  {logintoast && <ToasterMessage message={logintoast.message} type={logintoast.type} closeToast={closeloginToast} />}                  <div className="w-full  mb-4 md:mb-0">
                    <label className="font-semibold text-sm text-white/85">
                      Your Email
                    </label>
                    <div className="p-2 mt-2 rounded-lg border bg-[#251D3F]  border-gray-300">
                      <input
                        className="outline-none ps-2 text-sm w-full bg-[#251D3F] text-white"
                        type="email"
                        placeholder="Enter your email" onKeyDown={handleKeyDown}
                        {...loginFields("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Invalid email format"
                          }
                        })}
                      />
                    </div>{loginErrors.email && <span className="text-red-500 text-sm">{loginErrors.email.message}</span>}
                  </div>

                  <div className="w-full mt-2">
                    <label className="font-semibold text-sm text-white/85">
                      Password
                    </label>
                    <div className="p-2 mt-2 rounded-lg border bg-[#251D3F] border-gray-300 flex">
                      <input
                        className="outline-none ps-2 text-sm w-full bg-[#251D3F] text-white"
                        type={passwordType}
                        placeholder="Enter your Password" onKeyDown={handleKeyDown}

                        {...loginFields("password", { required: "Password is required" })}
                      />
                      {passwordType === "password" ? (
                        <FiEyeOff className="text-white"
                          onClick={() => setPasswordType("text")}
                          size={18}
                        />
                      ) : (
                        <FiEye className="text-white"
                          onClick={() => setPasswordType("password")}
                          size={18}
                        />
                      )}


                    </div>  {loginErrors.password && <span className="text-red-500 text-sm">{loginErrors.password.message}</span>}
                  </div>

                  <div className="flex justify-center items-center gap-1">
                    <div

                      className="mt-5 w-full flex justify-center md:justify-start"
                    >
                      <button onClick={handleLoginSubmit(onLoginSubmit)} className="bg-gradient-to-r bg-[#7A5BF5] text-white p-3 rounded-lg w-full md:w-[50%] font-semibold text-sm">
                        Sign in
                      </button>

                    </div>

                    <button
                      onClick={handleRegisterButton}
                      className="mt-5 bg-gradient-to-r bg-[#7A5BF5] text-white p-3 rounded-lg w-full md:w-[50%] font-semibold text-sm"
                    >Register
                    </button>




                    {/* Registration form popup */}
                    <Modal
                      isOpen={isModalOpen}>
                      <RegistrationForm
                        registertoast={registertoast}
                        closeregisterToast={closeregisterToast}
                        handleSubmit={handleRegisterSubmit(handleRegistrationSubmit)}
                        errors={registerErrors}
                        register={registerFields}
                        closeForgotPasswordModal={() => setIsModalOpen(false)}
                        handleRegisterKeyDown={handleRegisterKeyfunction}
                        fetchCaptcha={fetchCaptcha}
                        captchaImage={captchaImage}
                        submitCaptcha={submitCaptcha}
                        captchaTrue={captchaTrue}
                        handleCaptchaChange={handleCaptchaChange}
                        captchaValue={captchaValue}
                        isReloading={isReloading}
                      />
                    </Modal>

                  </div>
                  <br />
                  <p
                    onClick={handleOpenPopup}
                    className="text-blue-500 cursor-pointer hover:text-blue-900 inline-block"
                  >
                    Forgot password?
                  </p>
                  {isPopupOpen && <Forgetpasswsord successmessage={handleSuccessMessage} onClose={handleClosePopup} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;