import { apiSlice } from './apiSlice';
import { ADMIN_URL } from '../constants';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGameSettings: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/settings`,
      }),
      providesTags: ['Settings'],
      keepUnusedDataFor: 60, // Garder les paramètres en cache pendant 60s
    }),
  }),
});

export const { useGetGameSettingsQuery } = adminApiSlice;