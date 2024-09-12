'use client';

import { useEffect, useState } from 'react';
import { useGetAllMembersQuery, useDeleteMemberMutation } from '@/redux/slice/membersApiSlice';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

import { HiPencilSquare } from "react-icons/hi2";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaFileDownload } from "react-icons/fa";
import InvoiceModal from './InvoiceModal';

const Dashboard = () => {
    const [selectedMember, setSelectedMember] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { data } = useGetAllMembersQuery();
    const [deleteMember] = useDeleteMemberMutation();
    const [members, setMembers] = useState([]);

    useEffect(() => {
        if (data) {
            setMembers(data); // data is already an array of members
        }
    }, [data]);

    const handleDelete = async (id) => {
        try {
            await deleteMember(id).unwrap();
            toast.success('Member deleted successfully');
        } catch (error) {
            toast.error('Failed to delete member');
        }
    };

    const handleEdit = (id) => {
        const memberToEdit = members.find(member => member._id === id);
        setSelectedMember(memberToEdit);
        setShowModal(true);
    };

    const handlePreview = (member) => {
        setSelectedMember(member);
        setShowModal(true);
    };

    // Helper function to calculate the "Valid Upto" date
    const calculateValidUpto = (DOJ, duration) => {
        const joiningDate = new Date(DOJ);
        joiningDate.setMonth(joiningDate.getMonth() + duration); // Add the duration in months
        return joiningDate.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
    };

    // Helper function to format the date as DD/MM/YYYY
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
    };

    // Handle Excel export
    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            members.map((member) => ({
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
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-3xl text-center font-bold mb-6">Dream Fitness Members</h2>

            {/* Button to download Excel */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleDownloadExcel}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                    Download Excel
                </button>
            </div>

            <div className="overflow-x-auto max-h-[75vh]">
                <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="py-3 px-4 text-left">Sr. No.</th>
                            <th className="py-3 px-4 text-left min-w-[150px]">Name</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Phone</th>
                            <th className="py-3 px-4 text-left">Date of Joining</th>
                            <th className="py-3 px-4 text-left">Valid Upto</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members && members.map((member) => (
                            <tr key={member._id} className="border-t hover:bg-gray-100 transition-all">
                                <td className="py-3 px-4">{member?.serialNumber || 'N/A'}</td>
                                <td className="py-3 px-4">{member?.name || 'N/A'}</td>
                                <td className="py-3 px-4">{member?.email || 'N/A'}</td>
                                <td className="py-3 px-4">{member?.phone || 'N/A'}</td>
                                <td className="py-3 px-4">{formatDate(member?.DOJ)}</td>
                                <td className="py-3 px-4">{calculateValidUpto(member?.DOJ, member?.duration)}</td>
                                <td className="py-3 px-4 flex space-x-2">
                                    <HiPencilSquare
                                        size={20}
                                        className="text-blue-600 cursor-pointer"
                                        onClick={() => handleEdit(member._id)}
                                    />
                                    <MdOutlineDeleteForever
                                        onClick={() => handleDelete(member._id)}
                                        size={20}
                                        className="text-red-600 cursor-pointer"
                                    />
                                    <FaFileDownload
                                        onClick={() => handlePreview(member)}
                                        size={20}
                                        className="text-green-600 cursor-pointer"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedMember && (
                <InvoiceModal member={selectedMember} setShowModal={setShowModal} setSelectedMember={setSelectedMember} />
            )}
        </div>
    );
};

export default Dashboard;
