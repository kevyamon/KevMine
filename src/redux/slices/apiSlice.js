import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import { logout } from './authSlice'; // Étape 1: Importer l'action de déconnexion

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
});

// Étape 2: Créer un "wrapper" pour gérer le rafraîchissement du token
async function baseQueryWithReauth(args, api, extraOptions) {
  let result = await baseQuery(args, api, extraOptions);

  // Si la requête échoue avec une erreur 401 (token expiré)
  if (result.error && result.error.status === 401) {
    // Tenter d'obtenir un nouveau token d'accès via l'endpoint de rafraîchissement
    const refreshResult = await baseQuery(
      { url: '/api/users/refresh-token', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Si le rafraîchissement réussit, relancer la requête originale
      // qui devrait maintenant fonctionner avec le nouveau cookie de token d'accès
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Si le rafraîchissement échoue aussi, déconnecter l'utilisateur
      api.dispatch(logout());
    }
  }

  return result;
}

export const apiSlice = createApi({
  // Étape 3: Utiliser notre nouveau wrapper comme baseQuery
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Robot'],
  endpoints: (builder) => ({}),
});