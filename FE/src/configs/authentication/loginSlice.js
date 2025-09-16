import { apiSlice } from "../apiSlice";

export const loginSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Define your endpoints here (e.g., GET, POST requests to different routes)
        login: builder.mutation({
            query: (user) => ({
              url: '/auth/login',
              method: 'POST',
              body: user,
            }),
        }),
    }),
});

export const { useLoginMutation } = loginSlice;