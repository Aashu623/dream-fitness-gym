'use client';
import { useEffect, useState } from 'react';
import { useGetAllMembersQuery, useDeleteMemberMutation } from '@/redux/slice/membersApiSlice';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { HiPencilSquare } from "react-icons/hi2";
import { GrUpgrade } from "react-icons/gr";
import { MdOutlineDeleteForever } from "react-icons/md";
import InvoiceModal from '@/ui/components/InvoiceModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MemberList = () => {
    const router = useRouter();
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

        if (searchQuery) {
            filtered = filtered.filter(member =>
                member.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterVerified) {
            filtered = filtered.filter(member =>
                filterVerified === 'verified' ? member.verified : !member.verified
            );
        }

        if (filterGender) {
            filtered = filtered.filter(member => member.gender === filterGender);
        }

        if (filterDuration) {
            filtered = filtered.filter(member => member.duration === parseInt(filterDuration));
        }

        if (filterDOJ) {
            filtered = filtered.filter(member => formatDate(member.DOJ) === formatDate(filterDOJ));
        }

        if (filterValidUpto) {
            filtered = filtered.filter(member => calculateValidUpto(member.DOJ, member.duration) === formatDate(filterValidUpto));
        }

        setFilteredMembers(filtered);
    }, [searchQuery, filterVerified, filterGender, filterDuration, filterDOJ, filterValidUpto, members]);

    const [sortBy, setSortBy] = useState({ field: '', order: 'asc' });
    const [pin, setPin] = useState('');
    const correctPin = '191800';

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
                setPin('');
            } catch (error) {
                toast.error('Failed to delete member');
            }
        } else {
            toast.error('Incorrect PIN, deletion failed');
        }
    };

    const handleUpgradeClick = (member: any) => {
        setMemberToDelete(member);
        setShowDeleteDialog(true);
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
        <div className="py-8 px-4 bg-orange-100 min-h-screen flex justify-center">
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
                        className="border rounded-md p-2 w-full"
                    />
                    <button
                        onClick={handleDownloadExcel}
                        className="bg-green-500 text-white w-full px-2 p-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                        Download Excel
                    </button>
                    <Link href="/member/register">
                        <button
                            className="bg-green-500 text-white w-full px-2 p-2 rounded-md hover:bg-green-600 transition-colors"
                        >
                            New Member
                        </button>
                    </Link>
                </div>

                <div className="overflow-x-auto max-h-[75vh]">
                    <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
                        <thead className="bg-gray-200 sticky top-0 z-10">
                            <tr>
                                <th className="py-3 px-2 cursor-pointer">Verified</th>
                                <th className="py-3 px-2 cursor-pointer" onClick={() => handleSort('serialNumber')}>SN {'↑↓'}</th>
                                <th className="py-3 px-2 cursor-pointer" onClick={() => handleSort('name')}>Name {'↑↓'}</th>
                                <th className="py-3 px-2">Email</th>
                                <th className="py-3 px-2">Phone</th>
                                <th className="py-3 px-2">Date of Joining</th>
                                <th className="py-3 px-2">Valid From</th>
                                <th className="py-3 px-2">Valid Upto</th>
                                <th className="py-3 px-2">Invoice</th>
                                <th className="py-3 px-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredMembers?.map((member, index) => (
                                <tr key={index} className={isExpiringSoon(calculateValidUpto(member.planStarted, member.duration)) ? 'bg-yellow-100' : ''}>
                                    <td className="py-4 px-2 text-center">{member.verified ? '✅' : '⚠️'}</td>
                                    <td className="py-4 px-2 text-center">{member.serialNumber || index + 1}</td>
                                    <td className="py-4 px-2 text-center">{member.name}</td>
                                    <td className="py-4 px-2 text-center">{member.email}</td>
                                    <td className="py-4 px-2 text-center">{member.phone}</td>
                                    <td className="py-4 px-2 text-center">{formatDate(member.DOJ)}</td>
                                    <td className="py-4 px-2 text-center">{member.planStarted ? formatDate(member.planStarted) : '-'}</td>
                                    <td className="py-4 px-2 text-center">{calculateValidUpto(member.planStarted, member.duration)}</td>
                                    <td className="py-4 px-2 text-center">
                                        <button onClick={() => handlePreview(member)} className="text-blue-500">
                                            View
                                        </button>
                                    </td>
                                    <td className="flex gap-3 py-4 px-2 text-center">
                                        <button onClick={() => router.push(`/member/${member._id}`)} className="text-yellow-500">
                                            <HiPencilSquare size={20} />
                                        </button>
                                        <button onClick={() => router.push(`/member/${member._id}/update`)} className='text-green-500'>
                                            <GrUpgrade size={20} />
                                        </button>
                                        <button onClick={() => handleDeleteClick(member)} className="text-red-500">
                                            <MdOutlineDeleteForever size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Invoice Modal */}
                {showModal && (
                    <InvoiceModal
                        member={selectedMember}
                        setShowModal={setShowModal}
                    />
                )}

                {/* Delete Confirmation Dialog */}
                {showDeleteDialog && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg">
                            <h2 className="text-xl font-bold">Confirm Deletion</h2>
                            <p>Are you sure you want to delete this member?</p>
                            <div className="flex gap-2 mt-4">
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="Enter PIN"
                                    className="border rounded-md p-2 flex-1"
                                />
                                <button
                                    onClick={confirmDeleteMember}
                                    className="bg-red-500 text-white p-2 rounded-md"
                                >
                                    Confirm
                                </button>
                            </div>
                            <button
                                onClick={() => setShowDeleteDialog(false)}
                                className="mt-4 text-blue-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberList;
