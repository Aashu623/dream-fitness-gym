"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUpdateMemberPlanMutation, useGetMemberByIdQuery } from "@/redux/slice/membersApiSlice";
import { useParams } from "next/navigation";
import Loader from "@/ui/Loader";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import formBg from '@/assets/formBg.png';
import InputField from "./InputField";
import { ColorRing } from 'react-loader-spinner'
import ErrorPage from "./Error";


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

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await updateMemberPlan({
                memberId: id,
                newAmount,
                newPlanStartDate,
                newReceiverName,
                newUtr,
                newPaymentMode,
                newDuration,
            }).unwrap();

            router.push(`/dashboard/members`);
        } catch (error) {
            console.error("Failed to update plan:", error);
        }
    };

    if (memberLoading) return <Loader />;
    if (memberError) return <ErrorPage/>;

    return (
        <>
            <Toaster position="bottom-center" />
            <h1 className="absolute text-9xl white top-2 font-extrabold text-gray-500">RENEW</h1>
            <div className="w-full flex justify-center max-w-screen-lg rounded-xl z-10 mt-10 ">
                <div className="w-full overflow-hidden min-h-full flex items-center justify-between flex-col">
                    <Image src={formBg} alt="formBg" className="h-full w-full rounded-l-md" />
                </div>
                <div className="flex flex-col justify-between gap-4 rounded-r-md bg-gray-800 w-full px-8 pt-6 shadow-lg">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="min-w-[600px] grid grid-cols-1 sm:grid-cols-2 gap-3 bg-transparent relative"
                    >
                        <InputField
                            label="New Amount"
                            type="text"
                            value={newAmount}
                            onChange={(e) => setNewAmount(e.target.value)}
                            placeholder="Enter new amount"
                            required
                        />
                        <InputField
                            label="New Plan Start Date"
                            type="date"
                            value={newPlanStartDate}
                            onChange={(e) => setNewPlanStartDate(e.target.value)}
                            required
                        />
                        <InputField
                            label="New Payment Mode"
                            type="select"
                            value={newPaymentMode}
                            onChange={(e) => setNewPaymentMode(e.target.value)}
                            options={["UPI", "Cash"]}
                            required
                        />
                        {newPaymentMode === "Cash" && (
                            <InputField
                                label="New Receiver Name"
                                type="text"
                                value={newReceiverName}
                                onChange={(e) => setNewReceiverName(e.target.value)}
                                placeholder="Enter receiver's name"
                                required
                            />
                        )}
                        {newPaymentMode === "UPI" && (
                            <InputField
                                label="New UTR"
                                type="text"
                                value={newUtr}
                                onChange={(e) => setNewUtr(e.target.value)}
                                placeholder="Enter UTR"
                                required
                            />
                        )}
                        <InputField
                            label="New Duration"
                            type="select"
                            value={newDuration}
                            onChange={(e) => setNewDuration(parseInt(e.target.value))}
                            options={[...Array(12)].map((_, i) => `${i + 1}`)}
                            required
                        />
                    </form>
                    <div className="flex justify-end col-span-2 mb-5">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e)}
                            className="px-6 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            disabled={isLoading}
                        >
                            {isLoading ? <ColorRing height="20" width="20" visible={true} /> : "Renew"}

                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}