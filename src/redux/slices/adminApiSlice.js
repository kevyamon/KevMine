import { apiSlice } from './apiSlice';
import { ADMIN_URL, USERS_URL } from '../constants';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGameSettings: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/settings`,
      }),
      providesTags: ['Settings'],
      keepUnusedDataFor: 60,
    }),
    // NOUVELLE MUTATION POUR METTRE À JOUR LES PARAMÈTRES
    updateGameSettings: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/settings`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'], // Rafraîchir les données après la mise à jour
    }),
    getUsers: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/users`,
      }),
      providesTags: ['User'],
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
  useUpdateGameSettingsMutation, // Exporter le nouveau hook
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
} = adminApiSlice;