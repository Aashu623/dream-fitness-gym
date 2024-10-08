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
import dayjs from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Stats = () => {
  const { data: members, isLoading } = useGetAllMembersQuery();
  const [statistics, setStatistics] = useState({
    totalMembers: 0,
    maleMembers: 0,
    femaleMembers: 0,
    durationCounts: Array(12).fill(0),
    totalAmount: 0
  });

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const [totalAmountByDate, setTotalAmountByDate] = useState(0);
  useEffect(() => {
    if (members && !isLoading) {
      const maleMembers = members.filter(member => member.gender === 'male').length;
      const femaleMembers = members.filter(member => member.gender === 'female').length;

      const durationCounts = Array(12).fill(0);
      let totalAmount = 0;

      members.forEach(member => {
        const memberAmount = parseInt(member.amount) || 0;

        totalAmount += memberAmount;

        if (member.previousPlan) {
          member.previousPlan.forEach(plan => {
            totalAmount += parseInt(plan.amount) || 0;
          });
        }

        if (member.duration >= 1 && member.duration <= 12) {
          durationCounts[member.duration - 1] += 1;
        }
      });

      setStatistics({
        totalMembers: members.length,
        maleMembers,
        femaleMembers,
        durationCounts,
        totalAmount
      });
    }
  }, [members, isLoading]);

  useEffect(() => {
    if (members && dateRange.startDate && dateRange.endDate) {
      const filteredMembers = members.filter(member => {
        const joinDate = dayjs(member.DOJ);
        const start = dayjs(dateRange.startDate);
        const end = dayjs(dateRange.endDate);
        return joinDate.isAfter(start) && joinDate.isBefore(end);
      });

      const totalAmount = filteredMembers.reduce((sum, member) => sum + parseInt(member.amount), 0);
      setTotalAmountByDate(totalAmount);
    }
  }, [members, dateRange]);

  const handleDateChange = (e:any) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

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
    <div className="flex min-h-screen bg-orange-50 pr-4">
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
        <div className='flex flex-col gap-4 py-6'>
          <div className="p-4 bg-orange-400 text-white rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">Total Amount Collected</h2>
            <span className="text-3xl font-bold">₹{statistics.totalAmount}</span>
          </div>
          <div className="bg-orange-400 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Filter by Joining Date</h2>
            <div className="flex flex-col gap-4 text-black">
              <input
                type="date"
                name="startDate"
                className="p-2 border rounded "
                value={dateRange.startDate}
                onChange={handleDateChange}
                placeholder="Start Date"
              />
              <input
                type="date"
                name="endDate"
                className="p-2 border rounded"
                value={dateRange.endDate}
                onChange={handleDateChange}
                placeholder="End Date"
              />
              <div className="text-lg text-white">
                <strong>Total Collection (in selected range): </strong>₹{totalAmountByDate}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1  p-6">
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
