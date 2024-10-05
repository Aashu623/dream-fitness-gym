"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUpdateMemberPlanMutation, useGetMemberByIdQuery } from "@/redux/slice/membersApiSlice";
import { useParams } from "next/navigation";
import Loader from "@/ui/Loader";

export default function UpdatePlanPage() {
    const { id } = useParams();
    const router = useRouter();

    const { data: member, isLoading: memberLoading, error: memberError } = useGetMemberByIdQuery(id);

    const [updateMemberPlan, { isLoading, isError }] = useUpdateMemberPlanMutation();

    const [newAmount, setNewAmount] = useState("");
    const [newPlanStartDate, setNewPlanStartDate] = useState("");
    const [newReceiverName, setNewReceiverName] = useState("");
    const [newUtr, setNewUtr] = useState("");
    const [newPaymentMode, setNewPaymentMode] = useState("UPI");
    const [newDuration, setNewDuration] = useState(0);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await updateMemberPlan({
                memberId: id,
                newAmount,
                newPlanStartDate,
                newReceiverName,
                newUtr,
                newPaymentMode,
                newDuration
            }).unwrap();

            router.push(`/dashboard/members`);
        } catch (error) {
            console.error("Failed to update plan:", error);
        }
    };

    if (memberLoading) return <Loader />;
    if (memberError) return <div className="text-center text-lg text-red-500">Error loading member data.</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-white mb-8">Update Plan for {member?.name}</h1>

            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-6 border-2 border-gray-300 rounded-xl p-8 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 shadow-lg">
                <div className="space-y-4">
                    <label className="block text-white text-sm font-medium">New Amount</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-white bg-transparent placeholder-white outline-none focus:ring-2 focus:ring-orange-500"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        placeholder="Enter new amount"
                        required
                    />
                </div>

                <div className="space-y-4">
                    <label className="block text-white text-sm font-medium">New Plan Start Date</label>
                    <input
                        type="date"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-white bg-transparent outline-none focus:ring-2 focus:ring-orange-500"
                        value={newPlanStartDate}
                        onChange={(e) => setNewPlanStartDate(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-4">
                    <label className="block text-white text-sm font-medium">New Payment Mode</label>
                    <select
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-white bg-transparent outline-none focus:ring-2 focus:ring-orange-500"
                        value={newPaymentMode}
                        onChange={(e) => setNewPaymentMode(e.target.value)}
                        required
                    >
                        <option value="UPI">UPI</option>
                        <option value="Cash">Cash</option>
                    </select>
                </div>

                {/* Conditional Fields for Payment Mode */}
                {newPaymentMode === "Cash" && (
                    <div className="space-y-4">
                        <label className="block text-white text-sm font-medium">New Receiver Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-white bg-transparent placeholder-white outline-none focus:ring-2 focus:ring-orange-500"
                            value={newReceiverName}
                            onChange={(e) => setNewReceiverName(e.target.value)}
                            placeholder="Enter receiver's name"
                            required
                        />
                    </div>
                )}

                {newPaymentMode === "UPI" && (
                    <div className="space-y-4">
                        <label className="block text-white text-sm font-medium">New UTR</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-white bg-transparent placeholder-white outline-none focus:ring-2 focus:ring-orange-500"
                            value={newUtr}
                            onChange={(e) => setNewUtr(e.target.value)}
                            placeholder="Enter UTR"
                            required
                        />
                    </div>
                )}

                <div className="space-y-4 col-span-2">
                    <label className="block text-white text-sm font-medium">New Duration</label>
                    <select
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-white bg-transparent outline-none focus:ring-2 focus:ring-orange-500"
                        value={newDuration}
                        onChange={(e) => setNewDuration(parseInt(e.target.value))}
                        required
                    >
                        <option value="" disabled>Select duration</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1} month{i + 1 > 1 ? "s" : ""}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end col-span-2 mt-4">
                    <button
                        type="submit"
                        className="px-6 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Update Plan"}
                    </button>
                </div>

                {isError && <div className="col-span-2 text-red-500 text-center mt-4">Failed to update the plan. Please try again.</div>}
            </form>
        </div>
    );
}
