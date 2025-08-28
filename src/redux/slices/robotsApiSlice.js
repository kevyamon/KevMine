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
    upgradeRobot: builder.mutation({
      query: (robotId) => ({
        url: `${ROBOTS_URL}/${robotId}/upgrade`,
        method: 'PUT',
      }),
      invalidatesTags: ['User', 'Robot'],
    }),
    // ---- AJOUT DE LA MUTATION DE VENTE ----
    sellRobot: builder.mutation({
      query: ({ robotId, salePrice }) => ({
        url: `${ROBOTS_URL}/${robotId}/sell`,
        method: 'POST',
        body: { salePrice },
      }),
      // On rafraîchit tout : le profil du joueur, les robots du magasin et les catégories
      invalidatesTags: ['User', 'Robot', 'Category'],
    }),
  }),
});

export const {
  useGetRobotsQuery,
  useGetRobotDetailsQuery,
  usePurchaseRobotMutation,
  useUpgradeRobotMutation,
  useSellRobotMutation, // Exporter le hook de la nouvelle mutation
} = robotsApiSlice;