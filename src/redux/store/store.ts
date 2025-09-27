import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../reducer/themeSlice";
import titleReducer from "../reducer/titleSlice";
import documentsReducer from "../reducer/documentsSlice";
// import vendorProfileReducer from "../reducer/vendorProfileSlice";
import authReducer from "../reducer/authSlice";
import uiReducer from '../reducer/uiSlice';
import userReducer from '../features/users/userSlice';
import vendorProfileSlice from '../reducer/vendorProfileSlice';
import { apiSlice } from "../features/API/apiSlice";
import approvalReducer from "../reducer/approvalSlice";
import imageReducer from '../../redux/features/ProductImage/imageSlice';
import productReducer from "../../redux/feature/products/productSlice";
import guestReducer from '../feature/Guest/guestSlice';
import dashboardReducer from '../feature/Dashboard/DashboardSlice';
import settingsReducer from '../feature/Settings/settingsSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    title: titleReducer,
    user: userReducer,
    ui: uiReducer,
    auth: authReducer,
    vendorProfile: vendorProfileSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
    documents: documentsReducer,
    // vendorProfile: vendorProfileReducer,
    approvals: approvalReducer,
    product: productReducer,
    images: imageReducer,
    guest: guestReducer,
    dashboard: dashboardReducer,
    settings: settingsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
