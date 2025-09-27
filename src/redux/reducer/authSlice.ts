import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';


interface AuthState {
  token: string | null;
  userId: string | null;
  userType: string | null;
  userStatus: string | null;
  isAuthenticated: boolean;
  isLogoutLoading: boolean,
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  userId: null,
  userType: null,
  userStatus: null,
  isAuthenticated: false,
  isLogoutLoading: false,
};

if (initialState.token) {
  const decoded: any = jwtDecode(initialState.token);
  initialState.userId = decoded.user_id;
  initialState.userType = decoded.type;
  initialState.userStatus = decoded.status;
  initialState.isAuthenticated = true;
}


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string }>) => {
      const decoded = jwtDecode(action.payload.token) as any;
      const expiryTime = Date.now() + 60 * 60 * 1000; // Set expiry to 1 minute after login

      state.token = action.payload.token;
      state.userId = decoded.user_id;
      state.userType = decoded.type;
      state.userStatus = decoded.status;
      state.isAuthenticated = true;

      // Store token and expiry in localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("tokenExpiryTime", expiryTime.toString());
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.userType = null;
      state.userStatus = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiryTime");
    },
    setLogoutLoading(state, action) {
      state.isLogoutLoading = action.payload;  // Action to set loading state
    },
  },
});

export const { setAuth, logout,setLogoutLoading  } = authSlice.actions;
export default authSlice.reducer;