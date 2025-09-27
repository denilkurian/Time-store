// axiosConfig.js
import axios from "axios";
import { store } from "../redux/store/store";


const baseUrl = import.meta.env.VITE_BASE_URL;

// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: `${baseUrl}/`, // Set your base URL here
  validateStatus: (status) => status < 500, // Accepts any status code below 500 as a "valid" response
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const state = store.getState();
    const token = state.auth.token; 
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle error
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (response) => {
    console.log(response);

    if (response.data.message == "Unauthenticated") {
      // Handle unauthorized access (token expired or invalid)
      localStorage.removeItem("token"); // Clear token
      window.location.href = "/login"; // Redirect to login
    }

  }
);
export default axiosInstance;