'use client';

import { useEffect, useState } from 'react';
import { useGetAllMembersQuery, useDeleteMemberMutation } from '@/redux/slice/membersApiSlice';
import toast from 'react-hot-toast';

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
        if (data?.data) {
            setMembers(data.data);
            console.log(data.data); // Log the correct state value
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

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-3xl text-center font-bold mb-6">Dream Fitness Members</h2>
            <div className="overflow-x-auto max-h-[75vh]">
                <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="py-3 px-4 text-left min-w-[300px]">Name</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Contact</th>
                            <th className="py-3 px-4 text-left">Membership</th>
                            <th className="py-3 px-4 text-left">Payment Mode</th>
                            <th className="py-3 px-4 text-left">UTR/Receiver</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members && members.map((member) => (
                            <tr key={member._id} className="border-t hover:bg-gray-100 transition-all">
                                <td className="py-3 px-4">{member?.name || 'N/A'}</td>
                                <td className="py-3 px-4">{member?.email || 'N/A'}</td>
                                <td className="py-3 px-4">{member?.phone || 'N/A'}</td>
                                <td className="py-3 px-4">{member?.duration} {member.duration ? member.duration > 1 ? 'Months' : 'Month' : ''}</td>
                                <td className="py-3 px-4">{member?.paymentMode || 'N/A'}</td>
                                <td className="py-3 px-4">
                                    {member?.paymentMode === 'upi' ? member?.utr || 'N/A' : member?.receiverName || 'N/A'}
                                </td>
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
