'use client'
import { useGetAllMembersQuery } from '@/redux/slice/membersApiSlice';
import Dashboard from '@/ui/components/Dashboard';
import Skeleton from '@/ui/skeletons/Dashboard'
export default function DashboardPage() {
  const { isLoading } = useGetAllMembersQuery();


  return (
    <>
      {isLoading ? <Skeleton /> : (<Dashboard />)}
    </>
  );
}
