import { apiSlice } from './apiSlice';
import { ADMIN_URL } from '../constants';

const LOGS_URL = '/api/logs';

export const logApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLogs: builder.query({
      query: () => ({
        url: LOGS_URL,
      }),
      providesTags: ['Log'],
      keepUnusedDataFor: 5,
    }),
    clearLogs: builder.mutation({
      query: () => ({
        url: LOGS_URL,
        method: 'DELETE',
      }),
      invalidatesTags: ['Log'],
    }),
  }),
});

export const { useGetLogsQuery, useClearLogsMutation } = logApiSlice;