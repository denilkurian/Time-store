import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout,setLogoutLoading } from "../redux/reducer/authSlice";
import useCustomToast from "../hooks/useCustomToast";
import isAuthenticated from "../auth/Authenticate";
import axiosInstance from "./axiosConfig"; // Adjust the import path as needed

const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast } = useCustomToast();


    const logoutUser = async () => {
        const authStatus = isAuthenticated();

        // If the session has expired, redirect immediately
        if (!authStatus.authenticated) {
            showToast({ message: 'Session expired. Please login.', duration: 3000, type: 'error' });
            dispatch(logout());
            navigate('/login');
            return;
        }

        try {
            dispatch(setLogoutLoading(true));
            const response = await axiosInstance.post('/logout'); // Use your API logout endpoint

            if (response.status === 200) {
                showToast({ message: 'Logout Successfully', duration: 3000, type: 'success' });
                dispatch(logout());
                navigate('/login');
            } else {
                console.error('Logout failed', response);
            }
        } catch (error) {
            console.error('Logout API call failed', error);
            showToast({ message: 'An error occurred during logout.', duration: 3000, type: 'error' });
        }
        finally {
            dispatch(setLogoutLoading(false));
        }
    };

    return logoutUser;
};

export default useLogout;
