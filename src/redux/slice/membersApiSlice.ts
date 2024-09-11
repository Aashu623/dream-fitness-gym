import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Member } from "@/lib/member.model";

const membersApiSlice = createApi({
  reducerPath: "membersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/members" }),
  tagTypes: ["Member", "MemberList"],
  endpoints: (builder) => ({
    // Fetch all members
    getAllMembers: builder.query<Member[], void>({
      query: () => "/",
      providesTags: ["MemberList"],
    }),

    getMemberById: builder.query<Member, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Member", id }],
    }),

    addMember: builder.mutation<Member, Partial<Member>>({
      query: (newMember) => ({
        url: "/",
        method: "POST",
        body: newMember,
      }),
      invalidatesTags: ["MemberList"],
    }),

    updateMember: builder.mutation<Member,{updatedData: Partial<Member> }>({
      query: ({ updatedData }) => ({
        url: `/${updatedData.serialNumber}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error) => [
        { type: "Member" },
        "MemberList",
      ],
    }),

    deleteMember: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Member", id },
        "MemberList",
      ],
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

export default membersApiSlice;
