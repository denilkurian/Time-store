import { apiSlice } from "../API/apiSlice";
import { UserApiResponse, SingleUserApiResponse } from "./userModel";

const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<UserApiResponse, { type?: string; number?: number; email?: string; page?: string }>({
            query: (queryParams) => {
                const queryString = new URLSearchParams(
                    Object.entries(queryParams)
                        .filter(([_, value]) => value !== undefined)
                        .map(([key, value]) => [key, String(value)])
                ).toString();
                return {
                    url: `/users?${queryString}`,
                    method: 'GET',
                };
            },
            keepUnusedDataFor: 5,
        }),

        updateUserStatus: builder.mutation<void, { userId: number | null; status: 'active' | 'blocked' }>({
            query: ({ userId, status }) => ({
                url: `/users/${userId}/status/blocked`,
                method: 'PATCH',
                body: { status },
            }),
        }),
        getUserById: builder.query<SingleUserApiResponse, { userId: number | null }>({
            query: ({ userId }) => ({
                url: `/users/${userId}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetUsersQuery,
    useUpdateUserStatusMutation,
    useGetUserByIdQuery
} = userApi