'use client';
import { useEffect, useState } from 'react';
import { useGetAllMembersQuery, useDeleteMemberMutation } from '@/redux/slice/membersApiSlice';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { HiPencilSquare } from "react-icons/hi2";
import { MdOutlineDeleteForever } from "react-icons/md";
import InvoiceModal from './InvoiceModal';
import Link from 'next/link';

const Dashboard = () => {
    const [selectedMember, setSelectedMember] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const { data: members } = useGetAllMembersQuery();
    const [deleteMember] = useDeleteMemberMutation();
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterVerified, setFilterVerified] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [filterDuration, setFilterDuration] = useState('');
    const [filterDOJ, setFilterDOJ] = useState('');
    const [filterValidUpto, setFilterValidUpto] = useState('');

    useEffect(() => {
        let filtered = members;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(member =>
                member.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by verified/unverified status
        if (filterVerified) {
            filtered = filtered.filter(member =>
                filterVerified === 'verified' ? member.verified : !member.verified
            );
        }

        // Filter by gender
        if (filterGender) {
            filtered = filtered.filter(member => member.gender === filterGender);
        }

        // Filter by duration
        if (filterDuration) {
            filtered = filtered.filter(member => member.duration === parseInt(filterDuration));
        }

        // Filter by DOJ (Date of Joining)
        if (filterDOJ) {
            filtered = filtered.filter(member => formatDate(member.DOJ) === formatDate(filterDOJ));
        }

        // Filter by Valid Upto
        if (filterValidUpto) {
            filtered = filtered.filter(member => calculateValidUpto(member.DOJ, member.duration) === formatDate(filterValidUpto));
        }

        setFilteredMembers(filtered);
    }, [searchQuery, filterVerified, filterGender, filterDuration, filterDOJ, filterValidUpto, members]);

    const [sortBy, setSortBy] = useState({ field: '', order: 'asc' });
    const [pin, setPin] = useState('');
    const correctPin = '191800';

    useEffect(() => {
        let filtered = members;

        if (searchQuery) {
            filtered = filtered.filter(member =>
                member.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredMembers(filtered);
    }, [searchQuery, members]);

    // Sort function
    const handleSort = (field: string) => {
        const isAsc = sortBy.field === field && sortBy.order === 'asc';
        const order = isAsc ? 'desc' : 'asc';

        const sorted = [...filteredMembers].sort((a, b) => {
            if (field === 'serialNumber') {
                return order === 'asc'
                    ? (a.serialNumber || 0) - (b.serialNumber || 0)
                    : (b.serialNumber || 0) - (a.serialNumber || 0);
            } else if (field === 'name') {
                return order === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            }
            return 0;
        });

        setFilteredMembers(sorted);
        setSortBy({ field, order });
    };

    const confirmDeleteMember = async () => {
        if (pin === correctPin) {
            try {
                await deleteMember(memberToDelete._id).unwrap();
                toast.success('Member deleted successfully');
                setShowDeleteDialog(false);
                setMemberToDelete(null);
                setPin(''); // Reset PIN input
            } catch (error) {
                toast.error('Failed to delete member');
            }
        } else {
            toast.error('Incorrect PIN, deletion failed');
        }
    };

    const handleDeleteClick = (member: any) => {
        setMemberToDelete(member);
        setShowDeleteDialog(true);
    };

    const handlePreview = (member: any) => {
        setSelectedMember(member);
        setShowModal(true);
    };

    const calculateValidUpto = (DOJ: string | number | Date, duration: number) => {
        const joiningDate = new Date(DOJ);
        joiningDate.setMonth(joiningDate.getMonth() + duration);
        return joiningDate.toLocaleDateString('en-GB');
    };

    const formatDate = (date: string | number | Date) => {
        return new Date(date).toLocaleDateString('en-GB');
    };

    const isExpiringSoon = (validUpto: string) => {
        const validDate = new Date(validUpto);
        const today = new Date();
        const differenceInDays = Math.ceil((validDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return differenceInDays <= 5;
    };

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredMembers.map((member) => ({
                Name: member.name,
                Email: member.email,
                Phone: member.phone,
                'Date of Joining': formatDate(member.DOJ),
                'Valid Upto': calculateValidUpto(member.DOJ, member.duration),
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');
        XLSX.writeFile(workbook, 'members.xlsx');
    };


    return (
        <div className="py-8 bg-orange-100 min-h-screen flex justify-center">
            <div className="flex mx-auto p-6 bg-white shadow-lg rounded-lg overflow-hidden gap-2">

                <div className="flex flex-col gap-4 mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name"
                        className="border rounded-md w-full p-2"
                    />

                    <select
                        value={filterVerified}
                        onChange={(e) => setFilterVerified(e.target.value)}
                        className="border rounded-md p-2 w-full"
                    >
                        <option value="">All</option>
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                    </select>

                    <select
                        value={filterGender}
                        onChange={(e) => setFilterGender(e.target.value)}
                        className="border rounded-md p-2 w-full"
                    >
                        <option value="">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>

                    <input
                        type="number"
                        value={filterDuration}
                        onChange={(e) => setFilterDuration(e.target.value)}
                        placeholder="Filter by duration"
                        className="border rounded-md p-2 w-32 w-full"
                    />
                    <button
                        onClick={handleDownloadExcel}
                        className="bg-green-500 text-white w-full px-2 p-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                        Download Excel
                    </button>
                    <Link href="/register"><button
                        onClick={handleDownloadExcel}
                        className="bg-green-500 text-white w-full px-2 p-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                        New Member
                    </button></Link>
                </div>

                <div className="overflow-x-auto max-h-[75vh]">
                    <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
                        <thead className="bg-gray-200 sticky top-0 z-10">
                            <tr>
                                <th
                                    className="py-3 px-2 cursor-pointer"
                                >
                                    Verified
                                </th>
                                <th
                                    className="py-3 px-2 cursor-pointer"
                                    onClick={() => handleSort('serialNumber')}
                                >
                                    SN {'↑↓'}
                                </th>
                                <th
                                    className="py-3 px-2 cursor-pointer"
                                    onClick={() => handleSort('name')}
                                >
                                    Name {'↑↓'}
                                </th>
                                <th className="py-3 px-2">Email</th>
                                <th className="py-3 px-2">Phone</th>
                                <th className="py-3 px-2">Date of Joining</th>
                                <th className="py-3 px-2">Valid Upto</th>
                                <th className="py-3 px-2">Invoice</th>
                                <th className="py-3 px-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredMembers.map((member, index) => (
                                <tr key={index} className={isExpiringSoon(calculateValidUpto(member.DOJ, member.duration)) ? 'bg-yellow-200' : ''}>
                                    <td className="py-3 px-2 text-center"><input
                                        type="checkbox"
                                        checked={member.verified}
                                    /></td>
                                    <td className="py-3 px-2 text-center">{member.serialNumber}</td>
                                    <td className="py-3 px-2">{member.name}</td>
                                    <td className="py-3 px-2">{member.email}</td>
                                    <td className="py-3 px-2 text-center">{member.phone}</td>
                                    <td className="py-3 px-2 text-center">{formatDate(member.DOJ)}</td>
                                    <td className="py-3 px-2 text-center">{calculateValidUpto(member.DOJ, member.duration)}</td>
                                    <td className="py-3 px-2 text-center">
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => handlePreview(member)}
                                        >
                                            View
                                        </button>
                                    </td>
                                    <td className="py-3 px-2 flex gap-2">
                                        <Link
                                            href={`/members/${member._id}`}
                                            className="text-2xl text-green-500 hover:text-green-700"
                                        >
                                            <HiPencilSquare />
                                        </Link>
                                        <button
                                            className="text-2xl text-red-500 hover:text-red-700"
                                            onClick={() => handleDeleteClick(member)}
                                        >
                                            <MdOutlineDeleteForever />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <InvoiceModal
                        member={selectedMember}
                        setShowModal={setShowModal}
                    />
                )}
                {
                    showDeleteDialog && memberToDelete && (
                        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                                <p>Are you sure you want to delete {memberToDelete.name}?</p>
                                <div className="mt-4">
                                    <label htmlFor="pin" className="block mb-2">Enter PIN:</label>
                                    <input
                                        type="password"
                                        id="pin"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        className="border p-2 rounded-md w-full"
                                    />
                                </div>
                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        className="bg-gray-300 text-black px-2 py-2 rounded-md hover:bg-gray-400 transition-colors"
                                        onClick={() => {
                                            setShowDeleteDialog(false);
                                            setPin(''); // Clear PIN on cancel
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-2 py-2 rounded-md hover:bg-red-600 transition-colors"
                                        onClick={confirmDeleteMember}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Dashboard;