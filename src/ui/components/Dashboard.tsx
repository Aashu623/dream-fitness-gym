import { Bar, Pie } from 'react-chartjs-2';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { useGetAllMembersQuery } from '@/redux/slice/membersApiSlice';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Stats = () => {
  const { data: members, isLoading } = useGetAllMembersQuery();
  const [statistics, setStatistics] = useState({
    totalMembers: 0,
    maleMembers: 0,
    femaleMembers: 0,
    durationCounts: Array(12).fill(0)
  });

  useEffect(() => {
    if (members && !isLoading) {
      const maleMembers = members.filter(member => member.gender === 'male').length;
      const femaleMembers = members.filter(member => member.gender === 'female').length;

      const durationCounts = Array(12).fill(0);
      members.forEach(member => {
        if (member.duration >= 1 && member.duration <= 12) {
          durationCounts[member.duration - 1] += 1;
        }
      });

      setStatistics({
        totalMembers: members.length,
        maleMembers,
        femaleMembers,
        durationCounts
      });
    }
  }, [members, isLoading]);

  const genderData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Members by Gender',
        data: [statistics.maleMembers, statistics.femaleMembers],
        backgroundColor: ['#36A2EB', '#FF6384']
      }
    ]
  };

  const filteredDurationCounts = statistics.durationCounts
    .map((count, index) => (count > 0 ? { count, label: `${index + 1} Month${index + 1 > 1 ? 's' : ''}` } : null))
    .filter(Boolean);

  const planData = {
    labels: filteredDurationCounts.map(item => item.label),
    datasets: [
      {
        label: 'Plan Duration',
        data: filteredDurationCounts.map(item => item.count),
        backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
      }
    ]
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-1/6 bg-gray-600 text-white p-6">
        <nav className="flex flex-col space-y-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <Link href="/member/register">
            <span className="hover:text-gray-300 cursor-pointer">Register</span>
          </Link>
          <Link href="/dashboard/members">
            <span className="hover:text-gray-300 cursor-pointer">Members</span>
          </Link>
          <Link href="#">
            <span className="hover:text-gray-300 cursor-pointer">Dummy Link 1</span>
          </Link>
          <Link href="#">
            <span className="hover:text-gray-300 cursor-pointer">Dummy Link 2</span>
          </Link>
        </nav>
      </aside>

      <div className="flex-1 bg-orange-50 p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Dream Fitness</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-orange-400 text-white rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">Total Members</h2>
            <span className="text-3xl font-bold">{statistics.totalMembers}</span>
          </div>
          <div className="p-4 bg-orange-400 text-white rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">Male Members</h2>
            <span className="text-3xl font-bold">{statistics.maleMembers}</span>
          </div>
          <div className="p-4 bg-orange-400 text-white rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">Female Members</h2>
            <span className="text-3xl font-bold">{statistics.femaleMembers}</span>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-lg">Loading statistics...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-center">Gender Distribution</h2>
              <div className="relative w-full h-80">
                <Pie data={genderData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>

            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-center">Plan Duration</h2>
              <div className="relative w-full h-64">
                <Bar data={planData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/dashboard/members">
            <span className="bg-orange-400 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-orange-600 transition-all">
              View All Members
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Stats;
