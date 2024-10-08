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
import { IoMdPersonAdd, IoMdOptions } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

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
    const [showFilterOptionsModal, setShowFilterOptionsModal] = useState(false)
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
        <div className="py-8 px-4 bg-gradient-to-r from-black via-gray-800 to-orange-900 min-h-screen flex justify-center">
            <div className=" flex flex-col mx-auto p-6 bg-gray-800 shadow-lg rounded-lg overflow-hidden gap-2">
                <div className='relative w-full flex justify-between items-center bg-gray-800 py-4'>
                    <div className="border border-white rounded-md flex relative w-5/6 shadow-inner">
                        <FaSearch className='absolute top-3 left-2 text-white' />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name"
                            className="bg-transparent px-4 py-2 mx-8 w-full focus:outline-none placeholder:text-white"
                        />
                        <IoMdOptions
                            className='absolute top-3 right-2 text-white cursor-pointer hover:text-orange-500 transition duration-200 ease-in-out'
                            onClick={() => setShowFilterOptionsModal(!showFilterOptionsModal)}
                        />
                        {showFilterOptionsModal && (
                            <div className='absolute z-20 bg-white border border-gray-300 rounded-md p-4 top-12 right-0 w-full shadow-md'>
                                <div className="grid grid-cols-3 gap-2">
                                    <select
                                        value={filterVerified}
                                        onChange={(e) => setFilterVerified(e.target.value)}
                                        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                    >
                                        <option value="">All</option>
                                        <option value="verified">Verified</option>
                                        <option value="unverified">Unverified</option>
                                    </select>

                                    <select
                                        value={filterGender}
                                        onChange={(e) => setFilterGender(e.target.value)}
                                        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
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
                                        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <Link href="/member/register">
                        <IoMdPersonAdd className='text-2xl text-gray-500 hover:text-orange-500 cursor-pointer transition duration-200 ease-in-out' />
                    </Link>
                </div>
                <div className="overflow-auto max-h-[75vh]">
                    <table className="min-w-full bg-gray-800">
                        <thead className="bg-gray-900 sticky top-0 z-10">
                            <tr>
                                <th className="py-3 px-2 text-left cursor-pointer text-white">
                                    Verified
                                </th>
                                <th
                                    className="py-3 px-2 text-left cursor-pointer text-white"
                                    onClick={() => handleSort('serialNumber')}
                                >
                                    SN {'↑↓'}
                                </th>
                                <th
                                    className="py-3 px-2 text-left cursor-pointer text-white"
                                    onClick={() => handleSort('name')}
                                >
                                    Name{'↑↓'}
                                </th>
                                <th className="py-3 px-2 text-left text-white">Email</th>
                                <th className="py-3 px-2 text-left text-white">Phone</th>
                                <th className="py-3 px-2 text-left text-white">Date of Joining</th>
                                <th className="py-3 px-2 text-left text-white">Valid From</th>
                                <th className="py-3 px-2 text-left text-white">Valid Upto</th>
                                <th className="py-3 px-2 text-left text-white">Invoice</th>
                                <th className="py-3 px-2 text-left text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-900">
                            {filteredMembers?.map((member, index) => (
                                <tr
                                    key={index}
                                    className={`hover:bg-gray-900 text-white transition duration-200 ease-in-out cursor-pointer`}
                                >
                                    <td className="py-4 px-2 text-center">
                                        {member.verified ? '✅' : '⚠️'}
                                    </td>
                                    <td className="py-4 px-2 text-center">
                                        {member.serialNumber || index + 1}
                                    </td>
                                    <td className="py-4 px-2 text-center">{member.name}</td>
                                    <td className="py-4 px-2 text-center">{member.email}</td>
                                    <td className="py-4 px-2 text-center">{member.phone}</td>
                                    <td className="py-4 px-2 text-center">
                                        {formatDate(member.DOJ)}
                                    </td>
                                    <td className="py-4 px-2 text-center">
                                        {member.planStarted ? formatDate(member.planStarted) : '-'}
                                    </td>
                                    <td className="py-4 px-2 text-center">
                                        {calculateValidUpto(member.planStarted, member.duration)}
                                    </td>
                                    <td className="py-4 px-2 text-center">
                                        <button
                                            onClick={() => handlePreview(member)}
                                            className="text-orange-500 underline hover:text-orange-600 focus:outline-none"
                                            aria-label="View Invoice"
                                        >
                                            View
                                        </button>
                                    </td>
                                    <td className="py-4 px-2 flex gap-2 justify-center sm:justify-start">
                                        <button
                                            onClick={() => router.push(`/member/${member._id}`)}
                                            className="text-yellow-500 hover:text-yellow-600 focus:outline-none"
                                            aria-label="Edit Member"
                                        >
                                            <HiPencilSquare size={20} />
                                        </button>
                                        <button
                                            onClick={() => router.push(`/member/${member._id}/update`)}
                                            className="text-green-500 hover:text-green-600 focus:outline-none"
                                            aria-label="Upgrade Plan"
                                        >
                                            <GrUpgrade size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(member)}
                                            className="text-red-500 hover:text-red-600 focus:outline-none"
                                            aria-label="Delete Member"
                                        >
                                            <MdOutlineDeleteForever size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {
                                filteredMembers?.length === 0 && (
                                    <tr>
                                        <td
                                            className="py-4 px-2 min-w-full text-center"
                                            colSpan={10}
                                        >
                                            No members found
                                        </td>
                                    </tr>
                                )
                            }
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
                                    className="border rounded-md p-2 flex-1 focus:outline-orange-500 "
                                />
                            </div>
                            <div className='flex justify-end gap-2 mt-4'>
                            <button
                                onClick={() => setShowDeleteDialog(false)}
                                className="border-2 border-orange-500 text-orange-500 bg-white p-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteMember}
                                className="bg-orange-500 text-white p-2 rounded-md"
                            >
                                Confirm
                            </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberList;
