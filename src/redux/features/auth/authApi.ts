import { apiSlice } from "../API/apiSlice";




interface AuthResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role_id: number;
    created_at: string;
    updated_at: string;
    role: {
      id: number;
      name: string;
    };
  };
  access_token: string;
  token_type: string;
  expires_in: number;
}


export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
    getUserProfile: builder.query<AuthResponse, void>({
      query: () => ({
        url: '/admin',
        method: 'GET',
      }),
    }),
  }),
});

export const { useLoginUserMutation, useGetUserProfileQuery } = authApi;
