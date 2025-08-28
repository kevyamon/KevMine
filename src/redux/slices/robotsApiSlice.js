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
    // ---- AJOUT DE LA MUTATION D'ACHAT ----
    purchaseRobot: builder.mutation({
      query: (robotId) => ({
        url: `${ROBOTS_URL}/${robotId}/purchase`,
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Robot'], // Pour rafraîchir les données utilisateur et robots après l'achat
    }),
  }),
});

export const {
  useGetRobotsQuery,
  useGetRobotDetailsQuery,
  usePurchaseRobotMutation, // Exporter le hook de la nouvelle mutation
} = robotsApiSlice;