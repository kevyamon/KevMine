import { apiSlice } from './apiSlice';

const GAME_URL = '/api/game'; // Création d'une constante pour la clarté

export const gameApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Requête pour obtenir le statut du jeu (KVM non réclamés, etc.)
    getUserGameStatus: builder.query({
      query: () => ({
        url: `${GAME_URL}/status`,
        method: 'GET',
      }),
      providesTags: ['GameStatus'],
      keepUnusedDataFor: 5,
    }),

    // Mutation pour réclamer les KVM minés
    claimKevium: builder.mutation({
      query: () => ({
        url: `${GAME_URL}/claim`,
        method: 'POST',
      }),
      invalidatesTags: ['GameStatus', 'User'],
    }),

    // ---- NOUVELLE REQUÊTE POUR LE CLASSEMENT ----
    getLeaderboard: builder.query({
      query: () => ({
        url: `${GAME_URL}/leaderboard`,
      }),
      providesTags: ['Leaderboard'],
      keepUnusedDataFor: 60, // On garde le classement en cache pendant 60 secondes
    }),
  }),
});

export const {
  useGetUserGameStatusQuery,
  useClaimKeviumMutation,
  useGetLeaderboardQuery, // Exporter le nouveau hook
} = gameApiSlice;