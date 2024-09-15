'use client';

import { useEffect, useState } from 'react';
import { useGetAllMembersQuery, useDeleteMemberMutation } from '@/redux/slice/membersApiSlice';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

import { HiPencilSquare } from "react-icons/hi2";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaFileDownload } from "react-icons/fa";
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
    const [filterVerified, setFilterVerified] = useState(''); // For verified/unverified
    const [filterGender, setFilterGender] = useState(''); // For male/female
    const [filterDuration, setFilterDuration] = useState(''); // For duration
    const [filterDOJ, setFilterDOJ] = useState(''); // For Date of Joining
    const [filterValidUpto, setFilterValidUpto] = useState(''); // For Valid Upto

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
        <div className="p-8 bg-orange-100 min-h-screen flex justify-center">
            <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg overflow-hidden">
                <h2 className="text-3xl text-center font-bold mb-6">Dream Fitness Members</h2>

                <div className="flex flex-wrap gap-4 mb-4">
                    {/* Search Input */}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name"
                        className="border rounded-md w-1/3 p-2"
                    />

                    {/* Verified/Unverified Filter */}
                    <select
                        value={filterVerified}
                        onChange={(e) => setFilterVerified(e.target.value)}
                        className="border rounded-md p-2"
                    >
                        <option value="">All</option>
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                    </select>

                    {/* Gender Filter */}
                    <select
                        value={filterGender}
                        onChange={(e) => setFilterGender(e.target.value)}
                        className="border rounded-md p-2"
                    >
                        <option value="">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>

                    {/* Duration Filter */}
                    <input
                        type="number"
                        value={filterDuration}
                        onChange={(e) => setFilterDuration(e.target.value)}
                        placeholder="Filter by duration"
                        className="border rounded-md p-2 w-32"
                    />
                    <div >
                        <button
                            onClick={handleDownloadExcel}
                            className="bg-green-500 text-white px-4 p-2 rounded-md hover:bg-green-600 transition-colors"
                        >
                            Download Excel
                        </button>
                    </div>
                </div>

                {/* Button to download Excel */}

                <div className="overflow-x-auto max-h-[75vh]">
                    <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
                        <thead className="bg-gray-200 sticky top-0 z-10">
                            <tr>
                                <th
                                    className="py-3 px-4 cursor-pointer"
                                    onClick={() => handleSort('serialNumber')}
                                >
                                    Sr. No. {'↑↓'}
                                </th>
                                <th
                                    className="py-3 px-4 cursor-pointer"
                                    onClick={() => handleSort('name')}
                                >
                                    Name {'↑↓'}
                                </th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Phone</th>
                                <th className="py-3 px-4">Date of Joining</th>
                                <th className="py-3 px-4">Valid Upto</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.length > 0 ? (
                                filteredMembers.map((member) => (
                                    <tr key={member._id} className={`${member?.verified ? "bg-green-100" : "bg-red-200"} transition-all`} >
                                        <td className="py-3 px-4">{member?.serialNumber || 'N/A'}</td>
                                        <td className="py-3 px-4">{member?.name || 'N/A'}</td>
                                        <td className="py-3 px-4">{member?.email || 'N/A'}</td>
                                        <td className="py-3 px-4">{member?.phone || 'N/A'}</td>
                                        <td className="py-3 px-4">{formatDate(member?.DOJ)}</td>
                                        <td className="py-3 px-4">{calculateValidUpto(member?.DOJ, member?.duration)}</td>
                                        <td className="py-3 px-4 flex gap-2 space-x-2">
                                            <Link href={`/members/${member._id}`}><HiPencilSquare
                                                size={25}
                                                className="text-blue-600 cursor-pointer"
                                            /></Link>
                                            <MdOutlineDeleteForever
                                                onClick={() => handleDeleteClick(member)}
                                                size={25}
                                                className="text-red-600 cursor-pointer"
                                            />
                                            <FaFileDownload
                                                onClick={() => handlePreview(member)}
                                                size={25}
                                                className="text-green-600 cursor-pointer"
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="text-center py-4">
                                        No members found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {
                    showModal && selectedMember && (
                        <InvoiceModal member={selectedMember} setShowModal={setShowModal} setSelectedMember={setSelectedMember} />
                    )
                }

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
                                        className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                                        onClick={() => {
                                            setShowDeleteDialog(false);
                                            setPin(''); // Clear PIN on cancel
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                                        onClick={confirmDeleteMember}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    );
};

export default Dashboard;
