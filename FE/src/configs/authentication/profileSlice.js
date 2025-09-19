import { apiSlice } from "../apiSlice";

export const profileSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Define your endpoints here (e.g., GET, POST requests to different routes)
        getProfile: builder.query({
            query: () => "/user/profile",
        }),
        updateUserProfile: builder.mutation({
            query: ({ id, name,phone,address }) => ({
              url: `/auth/${id}/changeProfile`,
              method: "PUT",
              body: {name,phone, address},
            }),
        }),
    }),
});

export const { useGetProfileQuery,useUpdateUserProfileMutation} = profileSlice;