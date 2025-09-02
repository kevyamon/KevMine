import { apiSlice } from './apiSlice';

const NOTIFICATIONS_URL = '/api/notifications';

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: NOTIFICATIONS_URL,
        method: 'GET',
      }),
      providesTags: (result = []) => [
        'Notification',
        ...result.map(({ _id }) => ({ type: 'Notification', id: _id })),
      ],
    }),
    getArchivedNotifications: builder.query({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/archived`,
        method: 'GET',
      }),
      providesTags: (result = []) => [
        'ArchivedNotification',
        ...result.map(({ _id }) => ({ type: 'ArchivedNotification', id: _id })),
      ],
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/mark-read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    // NOUVEAU : Mutation pour marquer une seule notification comme lue
    markOneAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `${NOTIFICATIONS_URL}/${notificationId}/mark-read`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Notification', id: arg }],
    }),
    toggleArchiveNotification: builder.mutation({
      query: (notificationId) => ({
        url: `${NOTIFICATIONS_URL}/${notificationId}/archive`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification', 'ArchivedNotification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetArchivedNotificationsQuery,
  useMarkAllAsReadMutation,
  useToggleArchiveNotificationMutation,
  useMarkOneAsReadMutation, // Exporter le nouveau hook
} = notificationApiSlice;