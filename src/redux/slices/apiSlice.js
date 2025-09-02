import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import { logout } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
});

async function baseQueryWithReauth(args, api, extraOptions) {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: '/api/users/refresh-token', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User', 
    'Robot', 
    'Category', 
    'Leaderboard', 
    'PlayerRank', 
    'Settings', 
    'Quest', 
    'DashboardStats',
    'Notification',
    'ArchivedNotification',
    'Message',
    'Conversation',
    'ArchivedConversation',
    'Warning', // NOUVEAU : Ajout du tag pour les avertissements
  ],
  endpoints: (builder) => ({}),
});