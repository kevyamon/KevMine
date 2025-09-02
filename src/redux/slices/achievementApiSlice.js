import { apiSlice } from './apiSlice';

const ACHIEVEMENTS_URL = '/api/achievements';

export const achievementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Pour les joueurs : récupérer leurs succès et leur progression
    getAchievements: builder.query({
      query: () => ({
        url: ACHIEVEMENTS_URL,
        method: 'GET',
      }),
      providesTags: ['UserAchievement'],
    }),

    // --- Pour l'admin ---
    getAllAchievements: builder.query({
      query: () => ({
        url: `${ACHIEVEMENTS_URL}/admin/all`,
      }),
      providesTags: ['Achievement'],
    }),
    createAchievement: builder.mutation({
      query: (data) => ({
        url: `${ACHIEVEMENTS_URL}/admin`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Achievement'],
    }),
    updateAchievement: builder.mutation({
      query: (data) => ({
        url: `${ACHIEVEMENTS_URL}/admin/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Achievement', 'UserAchievement'],
    }),
    deleteAchievement: builder.mutation({
      query: (id) => ({
        url: `${ACHIEVEMENTS_URL}/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Achievement', 'UserAchievement'],
    }),
  }),
});

export const {
  useGetAchievementsQuery,
  useGetAllAchievementsQuery,
  useCreateAchievementMutation,
  useUpdateAchievementMutation,
  useDeleteAchievementMutation,
} = achievementApiSlice;