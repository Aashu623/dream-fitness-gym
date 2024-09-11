import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the API slice
export const emailApiSlice = createApi({
  reducerPath: "emailApi", // Optional, the name of the slice
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }), // Assuming you're working with Next.js API routes
  endpoints: (builder) => ({
    sendEmail: builder.mutation({
      query: ({ email, memberDetails }) => ({
        url: "/sendEmail",
        method: "POST",
        body: { email, memberDetails },
      }),
    }),
  }),
});

// Export the mutation hook
export const { useSendEmailMutation } = emailApiSlice;
