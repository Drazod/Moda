import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import Cookies from "js-cookie";

// Create the API slice using the re-authentication enabled base query
export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
      baseUrl: 'http://moda-production.up.railway.app',
      prepareHeaders: (headers) => {
        const token = Cookies.get("_auth");
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
      },
    }),
    // Define the API endpoints (to be implemented based on application needs)
    endpoints: builder => ({
      // Define your endpoints here (e.g., GET, POST requests to different routes)
    }),
  });