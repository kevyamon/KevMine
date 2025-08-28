import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // CETTE LIGNE EST LA SOLUTION
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Robot'],
  endpoints: (builder) => ({}),
});