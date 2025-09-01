import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
    // ---- NOUVELLE MUTATION POUR LA MISE À JOUR DU PROFIL ----
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'], // Pour rafraîchir le profil après la mise à jour
    }),
    updateProfilePhoto: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile/photo`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation, // Exporter le nouveau hook
  useUpdateProfilePhotoMutation,
} = usersApiSlice;