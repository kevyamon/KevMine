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
      providesTags: (result, error, arg) => [{ type: 'Robot', id: arg }],
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
    sellRobot: builder.mutation({
      query: (robotId) => ({
        url: `${ROBOTS_URL}/${robotId}/sell`,
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Robot', 'Category'],
    }),
    // --- NOUVELLES MUTATIONS POUR L'ADMIN ---
    createRobot: builder.mutation({
      query: (data) => ({
        url: ROBOTS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Robot'],
    }),
    updateRobot: builder.mutation({
      query: (data) => ({
        url: `${ROBOTS_URL}/${data.robotId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Robot'],
    }),
    deleteRobot: builder.mutation({
      query: (robotId) => ({
        url: `${ROBOTS_URL}/${robotId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Robot'],
    }),
  }),
});

export const {
  useGetRobotsQuery,
  useGetRobotDetailsQuery,
  usePurchaseRobotMutation,
  useUpgradeRobotMutation,
  useSellRobotMutation,
  // Exporter les nouveaux hooks
  useCreateRobotMutation,
  useUpdateRobotMutation,
  useDeleteRobotMutation,
} = robotsApiSlice;