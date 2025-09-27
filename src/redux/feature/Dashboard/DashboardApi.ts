import { createAsyncThunk } from "@reduxjs/toolkit";
import { DashboardApiResponse } from "./DashboardModel";
import axiosInstance from "../../../utils/axiosConfig";
import { AxiosResponse } from "axios";

export const fetchDashboardDetails = createAsyncThunk<
    DashboardApiResponse,
    void,
    { rejectValue: string }
>(
    "dashboard/fetchDashboardDetails",
    async (_, { rejectWithValue }) => {
        try {
            const response: AxiosResponse<DashboardApiResponse> = await axiosInstance.get(`/report/dashboard`);
            return response.data;
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "An unexpected error occurred while fetching dashboard details";
            console.error("Fetch Dashboard Error:", errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);
