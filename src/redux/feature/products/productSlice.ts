import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../../../utils/axiosConfig";
import { Category, ProductModelInterface } from '../products/productModel';
// interface ProductState {
//   categories: Category[];
//   subCategories: any[];
//   productDetails: Record<string, any>;
//   productDetailsById: ProductModelInterface | null;
//   allProductDetails: any[];
//   loading: boolean;
//   error: string | null;
//   successMessage: string;
// }

// const initialState: ProductState = {
//   categories: [],
//   subCategories: [],
//   productDetails: {},
//   productDetailsById: null,
//   allProductDetails: [],
//   loading: false,
//   error: null,
//   successMessage: "",
// };
// Fetch categories
export const fetchCategories = createAsyncThunk("products/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/public/product-categories");
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
  }
});

export const fetchServiceCategories = createAsyncThunk<
  { rejectValue: string }
>
  ("products/fetchServiceCategories", async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/service-categories");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
    }
  });

export const fetchProductDetailsById = createAsyncThunk<
  ProductModelInterface,
  { id: number },
  { rejectValue: string }
>("products/fetchProductDetailsById", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data.data.attributes as ProductModelInterface;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch product details");
  }
});



export const fetchProductDetails = createAsyncThunk<
  void,
  { rejectValue: string }
>(
  "products/fetchProductDetails",
  async (_, { rejectWithValue }) => {
    try {
      const productId = 5;  // Hardcoding productId as 5
      const response = await axiosInstance.get(`/products/${productId}`, {
      });
      return response.data.data.attributes;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || "Failed to fetch product details");
    }
  }
);

export const fetchAllProductDetails = createAsyncThunk(
  "products/fetchAllProductDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || "Failed to fetch all product details");
    }
  }
);


// Update product details
export const updateProductDetails = createAsyncThunk<
  any,
  { productId: string; updatedData: any },
  { rejectValue: string }
>(
  "products/updateProductDetails",
  async (
    { productId, updatedData },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(`/products/${productId}`, updatedData, {

      });
      return response.data;
    } catch (error) {
      return rejectWithValue((error as any).response?.data?.message || "Failed to update product details");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    categories: [] as Category[],
    serviceCategories: [] as Category[],
    subCategories: [] as Category[],
    productDetails: {},
    productDetailsById: {} as ProductModelInterface,
    allProductDetails: [],
    loading: false,
    error: "",
    successMessage: "",
  },
  reducers: {
    resetSuccessMessage: (state) => {
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductDetails.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAllProductDetails.fulfilled, (state, action) => {
        const productDetails = action.payload.map((item: any) => item.attributes);
        state.allProductDetails = productDetails;
        state.loading = false;
      })
      .addCase(fetchAllProductDetails.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchProductDetailsById.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchProductDetailsById.fulfilled, (state, action) => {
        state.productDetailsById = action.payload;
        state.loading = false;
        state.error = "";
      })
      .addCase(fetchProductDetailsById.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        const categoriesData = Array.isArray(action.payload) ? action.payload : [];
        state.categories = categoriesData.filter((item) => item?.parent_id === null);
        state.subCategories = categoriesData.filter((item) => item.attributes?.parent_id !== null);
      })
      .addCase(fetchServiceCategories.fulfilled, (state, action) => {
        const categoriesData = Array.isArray(action.payload) ? action.payload : [];
        state.serviceCategories = categoriesData.filter((item) => item.attributes?.parent_id === null);
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.productDetails = action.payload ?? {}; 
      })
      .addCase(updateProductDetails.fulfilled, (state) => {
        state.successMessage = "Product updated successfully!";
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = "";
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
        (state) => {
          state.loading = false;
          state.error ="An error occurred";
        }
      );
  },
});

export const { resetSuccessMessage } = productSlice.actions;
export default productSlice.reducer;