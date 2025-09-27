import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosConfig";
import { ApiResponse } from "./settingsModel";

export const fetchSettings = createAsyncThunk<ApiResponse>(
    "products/fetchProductDetailsById",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/settings`);
            return response.data as ApiResponse;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch product details");
        }
    }
);
