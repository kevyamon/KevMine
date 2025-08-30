import { apiSlice } from './apiSlice';

const MESSAGES_URL = '/api/messages';

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({
        url: `${MESSAGES_URL}/conversations`,
        method: 'GET',
      }),
      providesTags: ['Conversation'],
      keepUnusedDataFor: 30,
    }),
    getMessages: builder.query({
      query: (conversationId) => ({
        url: `${MESSAGES_URL}/${conversationId}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Message', id: arg }],
    }),
    sendMessage: builder.mutation({
      query: ({ receiverId, text }) => ({
        url: `${MESSAGES_URL}/send/${receiverId}`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: ['Message', 'Conversation'],
    }),
    // NOUVELLE MUTATION
    findOrCreateConversation: builder.mutation({
      query: (receiverId) => ({
        url: `${MESSAGES_URL}/conversations/findOrCreate`,
        method: 'POST',
        body: { receiverId },
      }),
      invalidatesTags: ['Conversation'],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useFindOrCreateConversationMutation, // Exporter le nouveau hook
} = messageApiSlice;