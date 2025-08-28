import { apiSlice } from './apiSlice';
import { ADMIN_URL, USERS_URL } from '../constants'; // J'ajoute USERS_URL

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGameSettings: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/settings`,
      }),
      providesTags: ['Settings'],
      keepUnusedDataFor: 60,
    }),
    // NOUVEAUX ENDPOINTS POUR LA GESTION UTILISATEUR
    getUsers: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/users`,
      }),
      providesTags: ['User'], // Utilise le tag 'User' pour rafraîchir la liste
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${ADMIN_URL}/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ userId, ...data }) => ({
        url: `${ADMIN_URL}/users/${userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getUserDetails: builder.query({
        query: (userId) => ({
            url: `${ADMIN_URL}/users/${userId}`,
        }),
        keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetGameSettingsQuery,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
} = adminApiSlice;