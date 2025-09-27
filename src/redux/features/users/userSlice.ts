import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { UserApiResponse } from "./userModel";

interface DepartmentState {
    users: UserApiResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: DepartmentState = {
    users: [],
    loading: false,
    error: null,
};

const userSlice: Slice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserApiResponse[]>) => {
            state.users = action.payload;
            state.loading = false;  // Set loading to false after data is fetched
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;  // Allows manual control of loading state
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;  // Set loading to false if there's an error
        },
        updateUserStatusLocal: (
            state,
            action: PayloadAction<{ userId: number; status: "active" | "blocked" }>
        ) => {
            const { userId, status } = action.payload;
            const userIndex = state.users.findIndex((user: any) => user.id === userId);
            if (userIndex !== -1) {
                state.users[userIndex].status = status; // Update user status locally
            }
        },
    },
});

export const { setUser, setLoading, setError, updateUserStatusLocal } = userSlice.actions;
export default userSlice.reducer;
