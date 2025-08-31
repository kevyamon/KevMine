import { apiSlice } from './apiSlice';

const MESSAGES_URL = '/api/messages';

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({
        url: `${MESSAGES_URL}/conversations`,
        method: 'GET',
      }),
      providesTags: (result = []) => [
        'Conversation',
        ...result.map(({ _id }) => ({ type: 'Conversation', id: _id })),
      ],
      keepUnusedDataFor: 30,
    }),
    getArchivedConversations: builder.query({
      query: () => ({
        url: `${MESSAGES_URL}/conversations/archived`,
        method: 'GET',
      }),
      providesTags: (result = []) => [
        'ArchivedConversation',
        ...result.map(({ _id }) => ({ type: 'ArchivedConversation', id: _id })),
      ],
    }),
    getMessages: builder.query({
      query: (conversationId) => ({
        url: `${MESSAGES_URL}/${conversationId}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Message', id: arg }],
    }),
    sendMessage: builder.mutation({
      query: ({ receiverId, text, replyTo }) => ({
        url: `${MESSAGES_URL}/send/${receiverId}`,
        method: 'POST',
        body: { text, replyTo },
      }),
      invalidatesTags: ['Conversation'],
    }),
    editMessage: builder.mutation({
      query: ({ messageId, text }) => ({
        url: `${MESSAGES_URL}/${messageId}`,
        method: 'PUT',
        body: { text },
      }),
      // Pas d'invalidation, géré par socket pour une mise à jour plus fluide
    }),
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `${MESSAGES_URL}/${messageId}`,
        method: 'DELETE',
      }),
      // Pas d'invalidation, géré par socket
    }),
    findOrCreateConversation: builder.mutation({
      query: (receiverId) => ({
        url: `${MESSAGES_URL}/conversations/findOrCreate`,
        method: 'POST',
        body: { receiverId },
      }),
      invalidatesTags: ['Conversation'],
    }),
    markConversationAsRead: builder.mutation({
      query: (conversationId) => ({
        url: `${MESSAGES_URL}/conversations/${conversationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Conversation'],
    }),
    toggleArchiveConversation: builder.mutation({
      query: (conversationId) => ({
        url: `${MESSAGES_URL}/conversations/${conversationId}/archive`,
        method: 'PUT',
      }),
      invalidatesTags: ['Conversation', 'ArchivedConversation'],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetArchivedConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useFindOrCreateConversationMutation,
  useMarkConversationAsReadMutation,
  useToggleArchiveConversationMutation,
} = messageApiSlice;