import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";

interface VendorProfileState {
  title: string;
  businessEntity: string | null;
  panNumber: string;
  cinNumber: string;
  gstNumber: string;
  vendorUniqueId: string; // New field for vendor unique ID
  logo: File | null;
  logoPreview: string | null;
  isLoading: boolean;
  snackbarMessage: string;
  snackbarOpen: boolean;
}

const initialState: VendorProfileState = {
  title: "",
  businessEntity: "",
  panNumber: "",
  cinNumber: "",
  gstNumber: "",
  vendorUniqueId: "",
  logo: null,
  logoPreview: null,
  isLoading: false,
  snackbarMessage: "",
  snackbarOpen: false,
};

// Define the type of data returned by the thunk
interface VendorProfileData {
  title: string;
  businessEntity: string | null;
  panNumber: string;
  cinNumber: string;
  gstNumber: string;
  vendorUniqueId: string;
}

// Async thunk to fetch vendor profile
export const fetchVendorProfile = createAsyncThunk(
  "vendorProfile/fetchVendorProfile",
  async ({ userId, token }: { userId: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/vendor_profiles/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { title, business_entity, pan_no, cin, gst_no, vendor_unique_id } = response.data.data.attributes;

      return {
        title,
        businessEntity: business_entity,
        panNumber: pan_no || "",
        cinNumber: cin || "",
        gstNumber: gst_no || "",
        vendorUniqueId: vendor_unique_id || "",
      };
    } catch (error) {
      return rejectWithValue((error as any).response?.data || "Error fetching vendor profile");
    }
  }
);

const vendorProfileSlice = createSlice({
  name: "vendorProfile",
  initialState,
  reducers: {
    setProfileData(state, action: PayloadAction<VendorProfileState>) {
      state.title = action.payload.title;
      state.businessEntity = action.payload.businessEntity;
      state.panNumber = action.payload.panNumber;
      state.cinNumber = action.payload.cinNumber;
      state.gstNumber = action.payload.gstNumber;
      state.vendorUniqueId = action.payload.vendorUniqueId;
      state.logoPreview = action.payload.logoPreview;
      console.log(state)
    },
    setLogo(state, action: PayloadAction<File | null>) {
      state.logo = action.payload;
    },
    setLogoPreview(state, action: PayloadAction<string | null>) {
      state.logoPreview = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSnackbar(state, action: PayloadAction<{ message: string; open: boolean }>) {
      state.snackbarMessage = action.payload.message;
      state.snackbarOpen = action.payload.open;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorProfile.pending, (state) => {
        state.isLoading = true;
        state.snackbarMessage = "";
        state.snackbarOpen = false;
      })
      .addCase(
        fetchVendorProfile.fulfilled,
        (state, action: PayloadAction<VendorProfileData>) => {
          state.isLoading = false;
          state.title = action.payload.title;
          state.businessEntity = action.payload.businessEntity;
          state.panNumber = action.payload.panNumber;
          state.cinNumber = action.payload.cinNumber;
          state.gstNumber = action.payload.gstNumber;
          state.vendorUniqueId = action.payload.vendorUniqueId;
          state.snackbarMessage = "Vendor profile fetched successfully";
          state.snackbarOpen = true;
        }
      )
      .addCase(fetchVendorProfile.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.snackbarMessage = `Error: ${action.payload}`;
        state.snackbarOpen = true;
      });
  },
});

export const {
  setProfileData,
  setLogo,
  setLogoPreview,
  setLoading,
  setSnackbar,
} = vendorProfileSlice.actions;

export default vendorProfileSlice.reducer;
