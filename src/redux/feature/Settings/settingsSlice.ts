import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./settingsModel";
import { fetchSettings } from "./settingApi";

const initialState: InitialState = {
    response: null,
    settingsValue: [],
    singleValue: null,
    error: null,
    loading: false,
    successMessage: ''
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        resetSuccessMessage: (state) => {
            state.successMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.settingsValue = action.payload.data;
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
            .addMatcher(
                (action) => action.type.endsWith("/rejected"),
                (state, action: { error: { message: string } }) => {
                    state.loading = false;
                    state.error = action.error.message as string;
                }
            );
    },
});

export const { resetSuccessMessage } = settingsSlice.actions;
export default settingsSlice.reducer;
