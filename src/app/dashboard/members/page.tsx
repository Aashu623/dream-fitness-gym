'use client'
import MemberList from '@/ui/components/MemberList'
import Skeleton from '@/ui/skeletons/MemberList'
import { useGetAllMembersQuery } from '@/redux/slice/membersApiSlice';
export default function MemberListPage() {
    const { isLoading } = useGetAllMembersQuery();

    return (
        <>{isLoading? <Skeleton /> : <MemberList />}</>
    )
}
