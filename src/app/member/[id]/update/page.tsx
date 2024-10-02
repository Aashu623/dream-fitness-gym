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

    if (memberLoading) return <Loader />
    if (memberError) return <div className="text-center text-lg text-red-500">Error loading member data.</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold text-center text-white mb-6">Update Plan for {member?.name}</h1>

            <form onSubmit={handleSubmit} className="sm:grid sm:grid-cols-2 border-2 rounded-xl gap-6 max-w-screen-md w-full mx-auto my-8 p-6 backdrop-blur-sm shadow-md drop-shadow-lg flex flex-col">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white mb-1">New Amount</label>
                    <input
                        type="text"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        placeholder="Enter new amount"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white mb-1">New Plan Start Date</label>
                    <input
                        type="date"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                        value={newPlanStartDate}
                        onChange={(e) => setNewPlanStartDate(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white mb-1">New Payment Mode</label>
                    <select
                        className="border-b border-gray-300 py-2 px-3 font-semibold w-full bg-transparent text-white outline-none"
                        value={newPaymentMode}
                        onChange={(e) => setNewPaymentMode(e.target.value)}
                        required
                    >
                        <option value="UPI" className="bg-transparent font-semibold text-orange-500">UPI</option>
                        <option value="Cash" className="bg-transparent font-semibold text-orange-500">Cash</option>
                    </select>
                </div>

                {/* Conditionally render inputs based on payment mode */}
                {newPaymentMode === "Cash" && (
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white mb-1">New Receiver Name</label>
                        <input
                            type="text"
                            className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                            value={newReceiverName}
                            onChange={(e) => setNewReceiverName(e.target.value)}
                            placeholder="Enter receiver's name"
                            required
                        />
                    </div>
                )}

                {newPaymentMode === "UPI" && (
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white mb-1">New UTR</label>
                        <input
                            type="text"
                            className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                            value={newUtr}
                            onChange={(e) => setNewUtr(e.target.value)}
                            placeholder="Enter UTR"
                            required
                        />
                    </div>
                )}

                <div className="space-y-2 col-span-2">
                    <label className="block text-sm font-semibold text-white mb-1">New Duration</label>
                    <select
                        className="border-b border-gray-300 py-2 px-3 font-semibold w-full bg-transparent text-white outline-none"
                        value={newDuration}
                        onChange={(e) => setNewDuration(parseInt(e.target.value))}
                        required
                    >
                        <option value="" className="bg-transparent font-semibold text-orange-500">Select duration</option>
                        <option value={1} className="bg-transparent font-semibold text-orange-500">1 month</option>
                        <option value={2} className="bg-transparent font-semibold text-orange-500">2 months</option>
                        <option value={3} className="bg-transparent font-semibold text-orange-500">3 months</option>
                        <option value={4} className="bg-transparent font-semibold text-orange-500">4 months</option>
                        <option value={5} className="bg-transparent font-semibold text-orange-500">5 months</option>
                        <option value={6} className="bg-transparent font-semibold text-orange-500">6 months</option>
                        <option value={7} className="bg-transparent font-semibold text-orange-500">7 months</option>
                        <option value={8} className="bg-transparent font-semibold text-orange-500">8 months</option>
                        <option value={9} className="bg-transparent font-semibold text-orange-500">9 months</option>
                        <option value={10} className="bg-transparent font-semibold text-orange-500">10 months</option>
                        <option value={11} className="bg-transparent font-semibold text-orange-500">11 months</option>
                        <option value={12} className="bg-transparent font-semibold text-orange-500">12 months (yearly)</option>
                    </select>
                </div>

                <div className="flex justify-end col-span-2 mt-4">
                    <button
                        type="submit"
                        className="max-w-[200px] bg-orange-500 text-white px-6 py-2 rounded-lg shadow hover:bg-orange-600 transition duration-200"
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Update Plan"}
                    </button>
                </div>

                {isError && <div className="text-red-500 text-center mt-3 col-span-2">Failed to update plan. Try again.</div>}
            </form>
        </div>
    );
}
