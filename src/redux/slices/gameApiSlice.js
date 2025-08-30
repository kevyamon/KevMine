import { apiSlice } from './apiSlice';

const GAME_URL = '/api/game';

export const gameApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserGameStatus: builder.query({
      query: () => ({
        url: `${GAME_URL}/status`,
        method: 'GET',
      }),
      providesTags: ['GameStatus'],
      keepUnusedDataFor: 5,
    }),
    claimKevium: builder.mutation({
      query: () => ({
        url: `${GAME_URL}/claim`,
        method: 'POST',
      }),
      invalidatesTags: ['GameStatus', 'User'],
    }),
    getLeaderboard: builder.query({
      query: (searchTerm) => ({
        url: `${GAME_URL}/leaderboard`,
        params: { searchTerm },
      }),
      providesTags: ['Leaderboard'],
      // CORRECTION : Ajout du polling toutes les 60 secondes comme demandé
      keepUnusedDataFor: 60,
    }),
    getPlayerRank: builder.query({
      query: (userId) => ({
        url: `${GAME_URL}/rank/${userId}`,
      }),
      providesTags: (result, error, arg) => [{ type: 'PlayerRank', id: arg }],
    }),
  }),
});

export const {
  useGetUserGameStatusQuery,
  useClaimKeviumMutation,
  useGetLeaderboardQuery,
  useGetPlayerRankQuery,
} = gameApiSlice;