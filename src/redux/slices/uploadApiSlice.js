import { apiSlice } from './apiSlice';
const UPLOADS_URL = '/api/uploads';

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadRobotImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOADS_URL}/robot`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useUploadRobotImageMutation } = uploadApiSlice;