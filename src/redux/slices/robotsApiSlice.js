import { apiSlice } from './apiSlice';
import { ROBOTS_URL } from '../constants';

export const robotsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRobots: builder.query({
      query: () => ({
        url: ROBOTS_URL,
      }),
      providesTags: ['Robot'],
      keepUnusedDataFor: 5,
    }),
    getRobotDetails: builder.query({
      query: (robotId) => ({
        url: `${ROBOTS_URL}/${robotId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    purchaseRobot: builder.mutation({
      query: (robotId) => ({
        url: `${ROBOTS_URL}/${robotId}/purchase`,
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Robot'],
    }),
    // ---- AJOUT DE LA MUTATION D'AMÉLIORATION ----
    upgradeRobot: builder.mutation({
      query: (robotId) => ({
        url: `${ROBOTS_URL}/${robotId}/upgrade`,
        method: 'PUT',
      }),
      // Pour rafraîchir le profil utilisateur (solde KVM) et les robots
      invalidatesTags: ['User', 'Robot'],
    }),
  }),
});

export const {
  useGetRobotsQuery,
  useGetRobotDetailsQuery,
  usePurchaseRobotMutation,
  useUpgradeRobotMutation, // Exporter le hook de la nouvelle mutation
} = robotsApiSlice;