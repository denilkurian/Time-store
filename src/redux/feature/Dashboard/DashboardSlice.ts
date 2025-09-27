import { createSlice } from '@reduxjs/toolkit';
import { InitialState } from './DashboardModel';
import { fetchDashboardDetails } from './DashboardApi';

const initialState: InitialState = {
    data: null,
    loading: true,
    error: null,
    successMessage: null,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        resetSuccessMessage: (state) => {
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.successMessage = "Dashboard details fetched successfully";
            })
            .addCase(fetchDashboardDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetSuccessMessage } = dashboardSlice.actions;
export default dashboardSlice.reducer;
