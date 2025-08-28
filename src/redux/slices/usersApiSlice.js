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
    // ---- NOUVELLE MUTATION POUR LA PHOTO DE PROFIL ----
    updateProfilePhoto: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile/photo`,
        method: 'PUT',
        body: data,
        // Note: On n'ajoute pas de Content-Type ici,
        // le navigateur le fera automatiquement pour le FormData
      }),
      invalidatesTags: ['User'], // Pour rafraîchir le profil après l'upload
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfilePhotoMutation, // Exporter le nouveau hook
} = usersApiSlice;