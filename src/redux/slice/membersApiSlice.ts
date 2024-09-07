import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Member } from "../lib/member.model";

export const membersApiSlice = createApi({
  reducerPath: "membersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getAllMembers: builder.query<Member[], void>({
      query: () => "/members",
    }),
    getMemberById: builder.query<Member, string>({
      query: (id) => `/members/${id}`,
    }),
    addMember: builder.mutation<Member, Partial<Member>>({
      query: (newMember) => ({
        url: "/members",
        method: "POST",
        body: newMember,
      }),
    }),
    updateMember: builder.mutation<
      Member,
      { id: string; updatedData: Partial<Member> }
    >({
      query: ({ id, updatedData }) => ({
        url: `/members/${id}`,
        method: "PUT",
        body: updatedData,
      }),
    }),
    deleteMember: builder.mutation<void, string>({
      query: (id) => ({
        url: `/members/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllMembersQuery,
  useGetMemberByIdQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} = membersApiSlice;
