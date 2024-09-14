'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { useAddMemberMutation, useGetAllMembersQuery } from "@/redux/slice/membersApiSlice";
import { z } from "zod";

// Define Zod schema matching memberSchema from mongoose
const memberSchema = z.object({
    serialNumber: z.number(),
    name: z.string().min(1, "Name is required"),
    age: z.number().min(1, "Age is required"),
    email: z.string().email("Invalid email").optional(),
    gender: z.enum(["male", "female", "other"]),
    weight: z.number().positive("Weight must be a positive number").optional(),
    phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must not exceed 15 digits"),
    address: z.string().optional(),
    emergencyContact: z.string().min(10, "Emergency contact must be at least 10 digits").optional(),
    duration: z.number().min(1, "Duration is required"),
    paymentMode: z.enum(["upi", "cash"]),
    utr: z.string().optional(),
    receiverName: z.string().optional(),
    amount: z.number().positive("Amount must be a positive number").min(1, "Amount is required"),
    DOJ: z.date(),
});

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
    const [amount, setAmount] = useState("");
    const [serialNumber, setSerialNumber] = useState(1);
    // Compute the serial number based on the last member's serial number
    useEffect(() => {
        if (members && members.length > 0) {
            const lastMemberSerial = Math.max(...members.map((member: any) => member.serialNumber || 1));
            setSerialNumber(lastMemberSerial + 1);
        }

    }, [members]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const DOJ = new Date();

        // Gather form data
        const formData = {
            serialNumber,
            name,
            email,
            gender,
            age: parseInt(age),
            weight: weight ? parseFloat(weight) : undefined,
            phone,
            address,
            emergencyContact,
            duration,
            paymentMode,
            utr: paymentMode === "upi" ? utr : undefined,
            receiverName: paymentMode === "cash" ? receiverName : undefined,
            amount: parseFloat(amount),
            DOJ,
        };

        // Validate formData using Zod schema
        const validation = memberSchema.safeParse(formData);
        if (!validation.success) {
            validation.error.issues.forEach((issue) => {
                toast.error(issue.message);
            });
            return;
        }

        try {
            await addMember(formData).unwrap();
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
                        className="border-b border-gray-300 py-2 px-3 text-white w-full bg-transparent placeholder:text-white outline-none"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="email"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <select
                        className="border-b border-gray-300 py-2 px-3 font-semibold w-full bg-transparent text-white appearance-none"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                    >
                        <option value="" disabled className="bg-transparent text-orange-500">Select your gender</option>
                        <option value="male" className="bg-transparent text-orange-500">Male</option>
                        <option value="female" className="bg-transparent text-orange-500">Female</option>
                        <option value="other" className="bg-transparent text-orange-500">Other</option>
                    </select>
                </div>

                <div>
                    <input
                        type="number"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
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
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                        placeholder="Enter your weight (kg)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>

                <div>
                    <input
                        type="tel"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="text"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                        placeholder="Enter your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="tel"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                        placeholder="Enter emergency contact number"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                    />
                </div>

                <div className="col-span-2">
                    <select
                        className="border-b border-gray-300 py-2 px-3 font-semibold w-full bg-transparent text-white outline-none"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        required
                    >
                        <option value="" className="bg-transparent font-semibold text-orange-500">Select membership type</option>
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

                <div className="col-span-1">
                    <select
                        className="border-b border-gray-300 py-2 px-3 font-semibold w-full bg-transparent text-white outline-none appearance-none"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        required
                    >
                        <option value="" disabled className="bg-transparent text-orange-500">Select payment mode</option>
                        <option value="upi" className="bg-transparent text-orange-500">UPI</option>
                        <option value="cash" className="bg-transparent text-orange-500">Cash</option>
                    </select>
                </div>

                {
                    paymentMode === "upi" && (
                        <div>
                            <input
                                type="text"
                                className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                                placeholder="Enter UTR"
                                value={utr}
                                onChange={(e) => setUtr(e.target.value)}
                                required
                            />
                        </div>
                    )
                }

                {
                    paymentMode === "cash" && (
                        <div>
                            <input
                                type="text"
                                className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                                placeholder="Enter receiver name"
                                value={receiverName}
                                onChange={(e) => setReceiverName(e.target.value)}
                                required
                            />
                        </div>
                    )
                }

                <div>
                    <input
                        type="number"
                        step="0.01"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                        placeholder="Enter total amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700 duration-500 transition-all text-white w-full py-2 px-3"
                    >
                        Register
                    </button>
                </div>
            </form >
        </div >
    );
}

export default RegisterForm;
