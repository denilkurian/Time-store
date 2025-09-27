import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";
import ToasterMessage from "../../components/message/Toaster";
import { useForm,SubmitHandler } from "react-hook-form";
import { RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";

type ToastMessage = {
  message: string;
  type: "error" | "success" | "info";
};

type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
};


export const UserAccount: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.userId)
  const [firstName, setFirstName] = useState('')
  const [passwordType, setPasswordType] = useState("password");
  const [newpasswordType, setnewPasswordType] = useState("password");


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>();

  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

  const handleSavePassword: SubmitHandler<PasswordFormData> = async (data) => {
    try {
      const response = await axiosInstance.post("update-password", {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });

      if (response.status === 200) {
        setToastMessage({ message: "Password updated successfully!", type: "success" });
        reset(); // Reset the form
      } else {
        setToastMessage({ message: response.data.message || "Password update failed.", type: "error" });
      }
    } catch (error: any) {
      setToastMessage({ message: "An error occurred. Please try again later.", type: "error" });
    }
  };


  const handlecloseToast = () => {
    setToastMessage(null)
  }


  useEffect(() => {
    const getFirstName = async () => {
      try {
        const response = await axiosInstance.get(`users/${userId}`);
        if (response.status === 200) {
          const data = response.data.data.attributes.first_name;
          console.log(data);
          setFirstName(data);
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
        return null;
      }
    };

    if (userId) getFirstName();
  }, [userId]);




  return (
    <>
      <h2 className="text-2xl dark:text-white font-semibold text-center m-8">Account Management</h2>
      <div className="py-2 dark:text-white  text-xl font-medium flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
        <p>
          Welcome <span className="font-semibold">{firstName}</span>
        </p>
        {/* <p>
          Type: <span className="font-semibold">{userType || 'User'}</span>
        </p> */}
      </div>
      <p className="dark:text-white py-1 text-center">Reset your password</p>
      <br />
      <div className="inset-0 flex items-center justify-center bg-opacity-50">
        <div className="bg-white dark:bg-slate-700 p-8 rounded-lg shadow-lg w-3/4 lg:w-1/3 relative">
          {toastMessage && (
            <ToasterMessage
              message={toastMessage.message}
              type={toastMessage.type}
              closeToast={handlecloseToast}
            />
          )}
  
          <form onSubmit={handleSubmit(handleSavePassword)}>
            {/* Current Password */}
            <label className="font-semibold text-sm dark:text-white text-black/85">
              Current Password
            </label>
            <div className="p-2 mt-2 rounded-full border bg-white border-gray-300 flex items-center">
              <input
                type={passwordType}
                placeholder="Enter Old Password"
                className="outline-none ps-2 text-sm w-full"
                {...register("currentPassword", {
                  required: "Current password is required",
                })}
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
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
            )}

            {/* New Password */}
            <label className="font-semibold text-sm dark:text-white text-black/85">
              New Password
            </label>
            <div className="p-2 mt-2 rounded-full border bg-white border-gray-300 flex items-center">
              <input
                type={newpasswordType}
                placeholder="Enter New Password"
                className="outline-none ps-2 text-sm w-full"
                {...register("newPassword", {
                  required: "New password is required",
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
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
            )}

            <br />
            <button
              type="submit"
              className="bg-[#6056E6] text-white p-3 rounded-full md:w-full font-semibold text-sm"
            >
              Save Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
