'use client';
import { useState } from 'react';
import { useGetAllMembersQuery } from '@/redux/slice/membersApiSlice';
import Dashboard from '@/ui/components/Dashboard';
import Skeleton from '@/ui/skeletons/Dashboard';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter()
  const [enteredPin, setEnteredPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const correctPin = '191800';

  const { isLoading } = useGetAllMembersQuery();

  const handlePinSubmit = (e: any) => {
    e.preventDefault();
    if (enteredPin === correctPin) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect PIN. Please try again.');
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <form onSubmit={handlePinSubmit} className="p-10 border rounded-lg shadow-lg">
            <div>
              <label htmlFor="pin" className="block mb-2 text-lg font-medium text-orange-400">
                Enter PIN to access Dashboard:
              </label>
              <input
                id="pin"
                type="password"
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                className="p-2 mb-4 border rounded w-full"
                placeholder="Enter PIN"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-blue-600"
            >
              show Dashboard
            </button>
          </form>
          <button
            onClick={() => router.push('/dashboard/members')}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-blue-600 mt-3"
          >
            Go to member List
          </button>
        </div>
      ) : isLoading ? (
        <Skeleton />
      ) : (
        <Dashboard />
      )}
    </>
  );
}
