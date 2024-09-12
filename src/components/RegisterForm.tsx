'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { useAddMemberMutation, useGetAllMembersQuery } from "@/redux/slice/membersApiSlice";

function RegisterForm() {
    const router = useRouter();
    const { data: members } = useGetAllMembersQuery();
    const [addMember] = useAddMemberMutation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");
    const [duration, setDuration] = useState(0);
    const [paymentMode, setPaymentMode] = useState("");
    const [utr, setUtr] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [amount, setAmount] = useState(0);

    console.log(members)

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const serialNumber = members?.length + 1 || 1;
        const DOJ = new Date();
        try {

            const newMember = await addMember({
                serialNumber,
                name,
                email,
                gender,
                DOJ,
                age: parseInt(age),
                weight: parseFloat(weight),
                phone,
                address,
                emergencyContact,
                duration,
                paymentMode,
                amount,
                utr: paymentMode === "upi" ? utr : "",
                receiverName: paymentMode === "cash" ? receiverName : "",
            }).unwrap();

            toast.success("Member added successfully!");
            router.push("/dashboard");
        } catch (error) {
            toast.error("Failed to add member!");
        }
    };

    return (
        <div className="w-full">
            <Toaster position="bottom-center" />

            <form
                onSubmit={handleSubmit}
                className="sm:grid sm:grid-cols-2 gap-6 max-w-screen-md w-full mx-auto my-8 p-6 backdrop-blur-sm shadow-md drop-shadow-md"
            >
                <div className="col-span-2">
                    <input
                        type="text"
                        className="border-b border-gray-300 py-2 px-3 text-white w-full bg-transparent placeholder:text-white  outline-none"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="email"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white  outline-none"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <select
                        className="border-b border-gray-300 py-2 px-3 font-semibold w-full bg-transparent text-white appearance-none"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                    >
                        <option value="" disabled className="bg-transparent text-white">Select your gender</option>
                        <option value="male" className="bg-transparent text-white">Male</option>
                        <option value="female" className="bg-transparent text-white">Female</option>
                        <option value="other" className="bg-transparent text-white">Other</option>
                    </select>
                </div>


                <div>
                    <input
                        type="number"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white  outline-none"
                        placeholder="Enter your age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <input
                        type="number"
                        step="0.1"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white  outline-none"
                        placeholder="Enter your weight (kg)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <input
                        type="tel"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white  outline-none"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="text"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white  outline-none"
                        placeholder="Enter your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="tel"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white  outline-none"
                        placeholder="Enter emergency contact number"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <select
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent text-white outline-none"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        required
                    >
                        <option value="" disabled className="bg-transparent text-white">Select membership type</option>
                        <option value="1" className="bg-transparent text-white">1 month</option>
                        <option value="3" className="bg-transparent text-white">3 months</option>
                        <option value="6" className="bg-transparent text-white">6 months</option>
                        <option value="12" className="bg-transparent text-white">12 months (yearly)</option>
                    </select>

                </div>

                <div className="col-span-1">
                    <select
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent text-white outline-none appearance-none"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        required
                    >
                        <option value="" disabled className="bg-transparent text-gray-400">Select payment mode</option>
                        <option value="upi" className="bg-transparent text-black hover:text-white ">UPI</option>
                        <option value="cash" className="bg-transparent text-black hover:text-white">Cash</option>
                    </select>
                </div>
                <div className="col-span-1">
                    <input
                        type="number"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white  outline-none"
                        placeholder="Enter emergency contact number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                {paymentMode === "upi" && (
                    <div className="col-span-2">
                        <input
                            type="text"
                            className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white  outline-none"
                            placeholder="Enter UTR number"
                            value={utr}
                            onChange={(e) => setUtr(e.target.value)}
                            required
                        />
                    </div>
                )}

                {paymentMode === "cash" && (
                    <div className="col-span-2">
                        <input
                            type="text"
                            className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white  outline-none"
                            placeholder="Enter Receiver's name"
                            value={receiverName}
                            onChange={(e) => setReceiverName(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div className="col-span-2">
                    <button
                        type="submit"
                        className="bg-orange-600 w-full py-2 px-3 rounded-md hover:bg-orange-500 transition"
                    >
                        Save and Preview
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;
