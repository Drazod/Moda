import { apiSlice } from "../apiSlice";

export const registerSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Define your endpoints here (e.g., GET, POST requests to different routes)
        register: builder.mutation({
            query: (newUser) => ({
              url: '/auth/register',
              method: 'POST',
              body: newUser,
            }),
        }),
    }),
});

export const { useRegisterMutation } = registerSlice;