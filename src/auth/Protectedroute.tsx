import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import isAuthenticated from "./Authenticate";
import { useDispatch } from 'react-redux';
import { logout } from "../redux/features/auth/authSlice";
import useCustomToast from "../hooks/useCustomToast";


interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredUserType }) => {
  const dispatch = useDispatch();
  const { authenticated, type, status } = isAuthenticated();
  const { showToast } = useCustomToast();

  useEffect(() => {
    // Session expired check
    const tokenExpiryTime = parseInt(localStorage.getItem("tokenExpiryTime") || '0', 10);

    if (Date.now() > tokenExpiryTime) {
      dispatch(logout());
      showToast({ message: 'Session expired. Please login.', duration: 3000, type: 'error' });
    }
  }, [dispatch, showToast]);

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ message: 'Session expired. Please log in again.' }} />;
  }

  if (type === "admin" && status === "active") {
    if (requiredUserType && type !== requiredUserType) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }

  if (["vendor", "customer"].includes(type)) {
    if (status === "blocked") {
      return <Navigate to="/user-blocked" replace />;
    }

    if (requiredUserType && type !== requiredUserType) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
