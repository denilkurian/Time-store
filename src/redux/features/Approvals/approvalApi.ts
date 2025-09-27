import { apiSlice } from "../API/apiSlice";




export const approvalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    approveStatus: builder.mutation({
      query: (data) => ({
        url:`approvals/${data.id}/approve`,
        method: 'POST',
        body:data,
        headers:{
            'Accept':'application/json'
        }
      }),
    }),
    rejectStatus: builder.mutation({
      query: (data) => ({
        url:`approvals/${data.id}/reject`,
        method: 'POST',
        body:data,
        headers:{
            'Accept':'application/json'
        }
      }),
    }),
    
  }),
});

export const { useApproveStatusMutation,useRejectStatusMutation } = approvalApi;
