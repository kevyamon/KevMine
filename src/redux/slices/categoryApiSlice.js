import { apiSlice } from './apiSlice';
import { ADMIN_URL } from '../constants'; // L'URL de base est déjà dans apiSlice

const CATEGORIES_URL = '/api/categories';

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: CATEGORIES_URL,
      }),
      providesTags: ['Category'],
      keepUnusedDataFor: 5,
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: CATEGORIES_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORIES_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: ({ id, confirmationCode }) => ({
        url: `${CATEGORIES_URL}/${id}`,
        method: 'DELETE',
        body: { confirmationCode },
      }),
      invalidatesTags: ['Category', 'Robot'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApiSlice;