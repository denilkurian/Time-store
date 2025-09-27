import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';
import dayjs from 'dayjs';

export interface Filters {
  page?: number;
  purpose?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

// Define the type for approval data
interface ApprovalData {
  serial_number: number;
  name: string;
  email?: string;
  phone_number?: string;
  purpose: string;
  status: string;
  type: string;
  id: string;
  rejection_comment?: string;
  approvable_id: string;
  approvable?: string;
  created_at?: string;
  excerpt?: string; // Add this property
  description?: string;
  category_id?: string;
  sub_category_id?: string;
  mrp?: number;
  minimum_order?: number;
  service_unit?: string;
}

// Define the type for the slice state
interface ApprovalState {
  data: ApprovalData[];
  fullApprovalData: any,
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ApprovalState = {
  data: [],
  fullApprovalData: {},
  loading: false,
  error: null,
};

// Reusable transformation logic
const transformApprovalData = (item: any, index?: number): ApprovalData => {
  // Extract common data
  const commonData = {
    id: item.id,
    user_id: item.attributes?.user_id,
    product_id: item.relationships?.approvable?.data?.id || null,
    serial_number: index !== undefined ? index + 1 : Number(item.id),
    purpose: item.attributes?.purpose,
    type: item.relationships?.approvable?.type?.replace('App\\Models\\', '') || '',
    approvable_id: item.relationships?.approvable?.data?.id,
    status: item.attributes?.status,
    approvable: item.relationships?.approvable?.type,
    rejection_comment: item.attributes?.rejection_comment,
    created_at: item.attributes?.created_at,
  };

  // Conditional logic based on the approvable type
  if ((commonData.type === 'Product' || commonData.type === 'Service') && item.relationships?.approvable?.details?.attributes) {
    const details = item.relationships.approvable.details.attributes;
    return {
      ...commonData,
      name: details.name,
      excerpt: details.excerpt,
      description: details.description,
      category_id: details.category_id,
      sub_category_id: details.sub_category_id,
      mrp: details.mrp,
      minimum_order: details.minimum_order,
      service_unit:details.service_unit
    };
  } else if (item.relationships?.approvable?.details?.attributes) {
    // Default case: assuming user data
    const details = item.relationships.approvable.details.attributes;
    return {
      ...commonData,
      name: `${details.first_name || ''} ${details.last_name || ''}`.trim(),
      email: details.email || '',
      phone_number: details.phone || '',
    };
  } else {
    // Fallback for unexpected or missing details
    return {
      ...commonData,
      name: 'Unknown',
    };
  }
};


export const fetchApprovals = createAsyncThunk(
  'approvals/fetchApprovals',
  async (filters: Filters) => {
    const params = new URLSearchParams();

    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.purpose) params.append('purpose', filters.purpose);
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', `App\\Models\\${filters.type}`);
    if (filters.startDate) params.append('start_date', dayjs(filters.startDate).format('YYYY-MM-DD'));
    if (filters.endDate) params.append('end_date', dayjs(filters.endDate).format('YYYY-MM-DD'));

    const response = await axiosInstance.get(`/approvals?${params.toString()}`);
    return {
      originalData: response.data,
      transformedData: response.data.data.map((item: any, index: number) =>
        transformApprovalData(item, index)
      ),
    };
  }
);

// Async thunk for fetching approval data by ID
export const fetchApprovalById = createAsyncThunk(
  'approvals/fetchApprovalById',
  async (id: string) => {
    const response = await axiosInstance.get(`/approvals/${id}`);
    return transformApprovalData(response.data.data);
  }
);

const approvalSlice = createSlice({
  name: 'approvals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApprovals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovals.fulfilled, (state, action) => {
        state.loading = false;
        state.fullApprovalData = action.payload.originalData;
        state.data = action.payload.transformedData;
      })
      .addCase(fetchApprovals.rejected, (state, action) => {
        console.log("datas", action.error.message)

        state.loading = false;
        state.error = action.error.message || 'Failed to fetch approvals';
      })
      .addCase(fetchApprovalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovalById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [action.payload];
      })
      .addCase(fetchApprovalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch approval by ID';
      });
  },
});

export default approvalSlice.reducer;