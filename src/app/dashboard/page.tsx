'use client';
import { useState } from 'react';
import { useGetAllMembersQuery } from '@/redux/slice/membersApiSlice';
import Dashboard from '@/ui/components/Dashboard';
import Skeleton from '@/ui/skeletons/Dashboard';

export default function DashboardPage() {
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
          <form onSubmit={handlePinSubmit} className="p-4 border rounded-lg shadow-lg">
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
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>
      ) : isLoading ? (
        <Skeleton />
      ) : (
        <Dashboard />
      )}
    </>
  );
}
