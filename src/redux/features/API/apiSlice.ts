import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { refreshCredential, logout } from '../auth/authSlice';  // Ensure correct path

const baseUrl = import.meta.env.VITE_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);  
    }
    return headers;
  },
});



const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: '/refresh',
        method: 'POST',
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {

      api.dispatch(refreshCredential(refreshResult.data));

      result = await baseQuery(args, api, extraOptions);
    } else {

      api.dispatch(logout());
    }
  }


  return result;
};

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    refreshToken: builder.mutation({
      query: () => ({
        url: '/refresh',
        method: 'POST',
      }),
    }),

  }),
});

export const { useRefreshTokenMutation } = apiSlice;
