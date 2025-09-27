import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    isCollapse: boolean;
}

const initialState: UIState = {
    isCollapse: true,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleCollapse: (state) => {
            state.isCollapse = !state.isCollapse;

        },
        setCollapse: (state, action: PayloadAction<boolean>) => {
            state.isCollapse = action.payload;
        },
    },
});

export const { toggleCollapse, setCollapse } = uiSlice.actions;
export default uiSlice.reducer;
