import { apiSlice } from './apiSlice';

const QUESTS_URL = '/api/quests';

export const questApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Pour les joueurs : récupérer les quêtes du jour
    getQuests: builder.query({
      query: () => ({
        url: QUESTS_URL,
        method: 'GET',
      }),
      providesTags: ['Quest'],
      keepUnusedDataFor: 30,
    }),
    // Pour les joueurs : réclamer une récompense
    claimQuestReward: builder.mutation({
      query: (questId) => ({
        url: `${QUESTS_URL}/${questId}/claim`,
        method: 'POST',
      }),
      invalidatesTags: ['Quest', 'User'],
    }),
    
    // --- NOUVEAUTÉS POUR L'ADMIN ---
    getAllQuests: builder.query({
      query: () => ({
        url: `${QUESTS_URL}/admin/all`,
      }),
      providesTags: (result = []) => [
        'Quest',
        ...result.map(({ _id }) => ({ type: 'Quest', id: _id })),
      ],
    }),
    createQuest: builder.mutation({
      query: (data) => ({
        url: `${QUESTS_URL}/admin`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Quest'],
    }),
    updateQuest: builder.mutation({
      query: (data) => ({
        url: `${QUESTS_URL}/admin/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Quest', id: arg.id }],
    }),
    deleteQuest: builder.mutation({
      query: (questId) => ({
        url: `${QUESTS_URL}/admin/${questId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Quest'],
    }),
  }),
});

export const {
  useGetQuestsQuery,
  useClaimQuestRewardMutation,
  // Exporter les nouveaux hooks pour l'admin
  useGetAllQuestsQuery,
  useCreateQuestMutation,
  useUpdateQuestMutation,
  useDeleteQuestMutation,
} = questApiSlice;