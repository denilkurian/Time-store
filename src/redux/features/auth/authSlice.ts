import { createSlice } from '@reduxjs/toolkit';



interface AuthState {
  user: null | {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  token: string | null;
  expires_in: number | null;
}

const initialState: AuthState = {
  user: (() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      // console.error('Error parsing user from localStorage:', e);
      return null;
    }
  })(),
  token: localStorage.getItem('token') || null,
  expires_in: (() => {
    const expires = localStorage.getItem('expires_in');
    return expires ? Number(expires) : null;
  })(),
};




const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.access_token;
      state.expires_in = Date.now() + action.payload.expires_in * 1000;

      localStorage.setItem('token', action.payload.access_token);
      localStorage.setItem('expires_in', state.expires_in.toString());
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    refreshCredential: (state, action) => {
      state.token = action.payload.access_token;
      state.expires_in = Date.now() + action.payload.expires_in * 1000;

      localStorage.setItem('token', action.payload.access_token);
      localStorage.setItem('expires_in', state.expires_in.toString());

    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.expires_in = null;

      localStorage.removeItem('token');
      localStorage.removeItem('expires_in');
      localStorage.removeItem('user');

    },

  },
});

export const { setCredentials, refreshCredential, logout } = authSlice.actions;
export default authSlice.reducer;
