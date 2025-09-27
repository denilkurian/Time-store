import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiResponse, SingleApiResponse } from "./guestModel";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchGuestProductDetails = createAsyncThunk<
    ApiResponse,
    {
        page: number;
        filters: { minPrice?: number | null; maxPrice?: number | null; minOrder?: number | null; category?: string | null; subCategory?: string | null },
        name: string
    },
    { rejectValue: string }
>("products/fetchGuestProductDetails", async ({ page, filters, name }, { rejectWithValue }) => {
    try {
        const payload = {
            data: {
                attributes: {
                    min_price: filters.minPrice || null,
                    max_price: filters.maxPrice || null,
                    min_order: filters.minOrder || null,
                    category: filters.category || null,
                    subCategory: filters.subCategory || null,
                    name: name
                },
            },
        };
        
        const response = await axios.post(`${baseUrl}/public/products?page=${page}`, payload);
        return response.data as ApiResponse;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch product details");
    }
});

export const fetchServiceDetails = createAsyncThunk<
    ApiResponse,
    {
        page: number;
        filters: { minPrice?: number | null; maxPrice?: number | null; minOrder?: number | null; category?: string | null; subCategory?: string | null },
        name: string
    },
    { rejectValue: string }
>("products/fetchServiceDetails", async ({ page, filters, name }, { rejectWithValue }) => {
    try {
        const payload = {
            data: {
                attributes: {
                    min_price: filters.minPrice || null,
                    max_price: filters.maxPrice || null,
                    min_order: filters.minOrder || null,
                    category: filters.category || null,
                    subCategory: filters.subCategory || null,
                    name: name
                },
            },
        };
        const response = await axios.post(`${baseUrl}/public/services?page=${page}`, payload);
        return response.data as ApiResponse;
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data?.message || "Failed to fetch product details");
    }
});
export const fetchDetails = createAsyncThunk<
    SingleApiResponse,
    {
        dataType: string;
        id: number
    },
    { rejectValue: string }
>("products/fetchDetails", async ({ dataType, id }, { rejectWithValue }) => {
    try { 
        const response = await axios.get(`${baseUrl}/public/${dataType}/${id}`);        
        return response.data as SingleApiResponse;
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data?.message || "Failed to fetch product details");
    }
});