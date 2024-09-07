'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetAllMembersQuery, useDeleteMemberMutation } from '../api/membersApiSlice';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { HiPencilSquare } from "react-icons/hi2";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaFileDownload } from "react-icons/fa";

const Dashboard = () => {
    const [selectedMember, setSelectedMember] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const { data: members = [] } = useGetAllMembersQuery();
    const [deleteMember] = useDeleteMemberMutation();

    const handleEdit = (id) => {
        router.push(`/edit/${id}`);
    };

    console.log(members)
    const handleDelete = async (id) => {
        try {
            await deleteMember(id).unwrap();
            toast.success('Member deleted successfully');
        } catch (error) {
            toast.error('Failed to delete member');
        }
    };

    const handlePreview = (member) => {
        setSelectedMember(member);
        setShowModal(true);
    };

    const handleDownloadPDF = () => {
        if (selectedMember) {
            const doc = new jsPDF();

            // Set font and title
            doc.setFont("helvetica", "normal");
            doc.setFontSize(18);
            doc.text("Dream Fitness GYM - Membership Receipt", 10, 10);

            // Personal Information Section
            doc.setFontSize(14);
            doc.text("Personal Information", 10, 20);
            doc.setFontSize(12);
            const personalInfo = [
                `Name: ${selectedMember.name}`,
                `Email: ${selectedMember.email}`,
                `Phone: ${selectedMember.phone}`,
                `Gender: ${selectedMember.gender}`,
                `Age: ${selectedMember.age}`,
                `Weight: ${selectedMember.weight}`,
                `Address: ${selectedMember.address}`
            ];
            let y = 30;
            personalInfo.forEach(detail => {
                doc.text(detail, 10, y);
                y += 10;
            });

            // Emergency Contact Section
            doc.setFontSize(14);
            doc.text("Emergency Contact", 10, y);
            doc.setFontSize(12);
            y += 10;
            doc.text(`Contact: ${selectedMember.emergencyContact}`, 10, y);

            // Membership Information Section
            y += 20;
            doc.setFontSize(14);
            doc.text("Membership Information", 10, y);
            doc.setFontSize(12);
            const membershipInfo = [
                `Membership Type: ${selectedMember.membershipType}`,
                `Payment Mode: ${selectedMember.paymentMode}`,
                `UTR/Receiver: ${selectedMember.paymentMode === 'upi' ? selectedMember.utr : selectedMember.receiverName}`
            ];
            y += 10;
            membershipInfo.forEach(detail => {
                doc.text(detail, 10, y);
                y += 10;
            });

            // Footer with Terms
            y += 20;
            doc.setFontSize(10);
            doc.text("Members must complete a health questionnaire and declare any medical conditions.", 10, y);
            y += 10;
            doc.text("Members must follow all safety guidelines and inform staff in case of discomfort.", 10, y);
            y += 10;
            doc.text("Thank you for your membership!", 10, y + 20);

            doc.save(`${selectedMember.name}_receipt.pdf`);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedMember(null);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-3xl text-center font-bold mb-6">Dream Fitness Members</h2>
            <table className="min-w-full bg-white shadow-md rounded-md overflow-auto max-h-100">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-2 px-4 text-left min-w-[300px]">Name</th>
                        <th className="py-2 px-4 text-left">Email</th>
                        <th className="py-2 px-4 text-left">Contact</th>
                        <th className="py-2 px-4 text-left">Membership</th>
                        <th className="py-2 px-4 text-left">Payment Mode</th>
                        <th className="py-2 px-4 text-left">UTR/Receiver</th>
                        <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member._id} className="border-t">
                            <td className="py-2 px-4">{member.name}</td>
                            <td className="py-2 px-4">{member.email}</td>
                            <td className="py-2 px-4">{member.phone}</td>
                            <td className="py-2 px-4">{member.membershipType}</td>
                            <td className="py-2 px-4">{member.paymentMode}</td>
                            <td className="py-2 px-4">
                                {member.paymentMode === 'upi' ? member.utr : member.receiverName}
                            </td>
                            <td className="py-2 px-4 flex space-x-2">
                                <HiPencilSquare
                                    onClick={() => handleEdit(member._id)}
                                    size={20}
                                    className="text-blue-600 cursor-pointer"
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

            {showModal && selectedMember && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-3/4 max-w-2xl shadow-lg">
                        {/* Invoice Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-4xl font-bold text-blue-600">Dream fitness</h3>
                                <p className="text-sm text-gray-600 mt-2">Date: {new Date().toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm">Invoice No: <strong>001</strong></p>
                                <p className="text-sm">Due Date: <strong>{new Date().toLocaleDateString()}</strong></p>
                            </div>
                        </div>

                        {/* Member & Billing Info */}
                        <div className="flex justify-between mb-8">
                            <div>
                                <h4 className="text-lg font-semibold mb-2">From</h4>
                                <p><strong>Gym Name</strong></p>
                                <p>123 Gym Street</p>
                                <p>City, State</p>
                                <p>Email: gym@fitness.com</p>
                            </div>
                            <div className="text-right">
                                <h4 className="text-lg font-semibold mb-2">Bill to</h4>
                                <p><strong>{selectedMember.name}</strong></p>
                                <p>{selectedMember.address}</p>
                                <p>{selectedMember.phone}</p>
                                <p>{selectedMember.email}</p>
                            </div>
                        </div>

                        {/* Invoice Table */}
                        <div className="border-t border-b border-gray-300">
                            <div className="grid grid-cols-6 py-2 font-bold text-gray-600 bg-gray-100">
                                <div className="col-span-3 pl-4">Description</div>
                                <div className="text-center">Rate</div>
                                <div className="text-center">Qty</div>
                                <div className="text-center">Amount</div>
                            </div>
                            <div className="grid grid-cols-6 py-2">
                                <div className="col-span-3 pl-4">
                                    <p>{selectedMember.membershipType} Membership</p>
                                </div>
                                <div className="text-center">$50</div>
                                <div className="text-center">1</div>
                                <div className="text-center">$50</div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="mt-6 text-right">
                            <p className="font-semibold">Subtotal: $50</p>
                            <p className="font-semibold">Total: $50</p>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button
                                onClick={handleDownloadPDF}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                            >
                                Download PDF
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
