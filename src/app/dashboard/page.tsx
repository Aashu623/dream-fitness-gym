'use client'
import { useGetAllMembersQuery } from '@/redux/slice/membersApiSlice';
import Dashboard from '../../components/Dashboard';
import Skeleton from '@/components/Skeleton'


export default function DashboardPage() {
  const { isLoading } = useGetAllMembersQuery();


  return (
    <>
      {isLoading ? <Skeleton /> : (
        <div className="min-h-screen bg-gray-100">
          <Dashboard />
        </div >
      )}
    </>
  );
}
