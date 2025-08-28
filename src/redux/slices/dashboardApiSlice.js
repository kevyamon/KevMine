import { apiSlice } from './apiSlice';

const DASHBOARD_URL = '/api/dashboard';

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => ({
        url: `${DASHBOARD_URL}/stats`,
        method: 'GET',
      }),
      providesTags: ['DashboardStats'],
      keepUnusedDataFor: 30, // Mettre en cache pendant 30s
    }),
  }),
});

export const { useGetStatsQuery } = dashboardApiSlice;