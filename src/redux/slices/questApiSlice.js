import { apiSlice } from './apiSlice';

const QUESTS_URL = '/api/quests';

export const questApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuests: builder.query({
      query: () => ({
        url: QUESTS_URL,
        method: 'GET',
      }),
      providesTags: ['Quest'],
      keepUnusedDataFor: 30, // Garder en cache pendant 30 secondes
    }),
    claimQuestReward: builder.mutation({
      query: (questId) => ({
        url: `${QUESTS_URL}/${questId}/claim`,
        method: 'POST',
      }),
      // Invalider les quêtes et le profil utilisateur pour rafraîchir les données
      invalidatesTags: ['Quest', 'User'],
    }),
  }),
});

export const { useGetQuestsQuery, useClaimQuestRewardMutation } = questApiSlice;