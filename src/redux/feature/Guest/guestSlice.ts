import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitialState } from './guestModel';
import { fetchDetails, fetchGuestProductDetails, fetchServiceDetails } from './guestApi';

const initialState: InitialState = {
    productApiResponse: null,
    productListAttributes: null,
    productDetails: [],
    singleDetails: null,
    productDetailsById: null,
    allProductDetails: [],
    serviceListAttributes: [],
    serviceResponse: null,
    loading: true,
    error: null,
    pageType: "Product",
    successMessage: "",
};

const guestSlice = createSlice({
    name: "guest",
    initialState,
    reducers: {
        setActivePage: (state, action: PayloadAction<string>) => {
            console.log("page aan",action.payload);
            
            state.pageType = action.payload;
        },
        resetSuccessMessage: (state) => {
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGuestProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGuestProductDetails.fulfilled, (state, action) => {
                state.productApiResponse = action.payload;
                state.productListAttributes = action.payload?.data.map((X) => X.attributes);
                state.loading = false;
            })
            .addCase(fetchGuestProductDetails.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchServiceDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServiceDetails.fulfilled, (state, action) => {
                state.serviceResponse = action.payload;
                state.serviceListAttributes = action.payload.data.map((x) => x.attributes).flat();
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchServiceDetails.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDetails.fulfilled, (state, action) => {
                state.loading = true;
                state.singleDetails = action.payload;
            })
            .addMatcher(
                (action) => action.type.endsWith("/pending"),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith("/fulfilled"),
                (state) => {
                    state.loading = false;
                }
            )
    },
});

export const { resetSuccessMessage, setActivePage } = guestSlice.actions;
export default guestSlice.reducer;
