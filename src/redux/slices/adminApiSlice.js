import { apiSlice } from './apiSlice';
import { ADMIN_URL } from '../constants';

// L'URL pour les avertissements côté utilisateur (pas admin)
const WARNINGS_URL = '/api/warnings';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGameSettings: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/settings`,
      }),
      providesTags: ['Settings'],
      keepUnusedDataFor: 60,
    }),
    updateGameSettings: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/settings`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
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
    grantBonus: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/users/grant-bonus`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    // ---- MUTATIONS ET QUERIES POUR LES AVERTISSEMENTS ----
    sendWarning: builder.mutation({
      // La query est correcte et prend déjà en compte les 'suggestedActions'
      query: ({ userId, message, suggestedActions }) => ({
        url: `${ADMIN_URL}/users/${userId}/warn`,
        method: 'POST',
        body: { message, suggestedActions },
      }),
      invalidatesTags: ['Warning'],
    }),
    // CORRECTION : Renommage pour plus de clarté, comme demandé
    getMyWarnings: builder.query({
      query: () => ({
        url: WARNINGS_URL, 
      }),
      providesTags: ['Warning'],
    }),
    dismissWarning: builder.mutation({
      query: (warningId) => ({
        url: `${WARNINGS_URL}/${warningId}/dismiss`,
        method: 'PUT',
      }),
      invalidatesTags: ['Warning'],
    }),
  }),
});

export const {
  useGetGameSettingsQuery,
  useUpdateGameSettingsMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useGrantBonusMutation,
  // Exporter les hooks mis à jour
  useSendWarningMutation,
  useGetMyWarningsQuery, // Renommé ici
  useDismissWarningMutation,
} = adminApiSlice;