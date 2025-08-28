import { apiSlice } from './apiSlice';
import { ADMIN_URL } from '../constants'; // Correction: l'URL de base est déjà dans apiSlice, pas besoin d'importer des constantes spécifiques ici sauf si nécessaire.

export const gameApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Requête pour obtenir le statut du jeu (KVM non réclamés, etc.)
    getUserGameStatus: builder.query({
      query: () => ({
        url: `/api/game/status`,
        method: 'GET',
      }),
      providesTags: ['GameStatus'], // Tag pour la gestion du cache
      keepUnusedDataFor: 5, // Garder les données en cache pour 5 secondes
    }),

    // Mutation pour réclamer les KVM minés
    claimKevium: builder.mutation({
      query: () => ({
        url: `/api/game/claim`,
        method: 'POST',
      }),
      // Après avoir réclamé, on invalide les données du jeu et de l'utilisateur
      // pour forcer un rafraîchissement immédiat de l'interface
      invalidatesTags: ['GameStatus', 'User'],
    }),
  }),
});

export const { useGetUserGameStatusQuery, useClaimKeviumMutation } = gameApiSlice;