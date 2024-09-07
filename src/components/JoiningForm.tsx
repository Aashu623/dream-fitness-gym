'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // useRouter hook for redirection
import { toast } from "react-hot-toast"; // For toast notifications
import { useAddMemberMutation } from "../api/membersApiSlice";
import { Toaster } from "react-hot-toast"; // For rendering toast notifications

function JoiningForm() {
    const router = useRouter();
    const [addMember] = useAddMemberMutation();

    // State variables for form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");
    const [membershipType, setMembershipType] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
    const [utr, setUtr] = useState("");
    const [receiverName, setReceiverName] = useState("");

    // Handle form submission
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            // Add new member to the database
            await addMember({
                name,
                email,
                gender,
                age: parseInt(age),
                weight: parseFloat(weight),
                phone,
                address,
                emergencyContact,
                membershipType,
                paymentMode,
                utr: paymentMode === "upi" ? utr : "",
                receiverName: paymentMode === "cash" ? receiverName : "",
            }).unwrap();

            // Show toast notification
            toast.success("Member added successfully!");

            // Redirect to the dashboard after 1 second
            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        } catch (error) {
            // Show error toast notification
            toast.error("Failed to add member!");
        }

        // Reset form fields
        setName("");
        setEmail("");
        setGender("");
        setAge("");
        setWeight("");
        setPhone("");
        setAddress("");
        setEmergencyContact("");
        setMembershipType("");
        setPaymentMode("");
        setUtr("");
        setReceiverName("");
    };

    return (
        <div>
            {/* Toast notification container */}
            <Toaster position="top-right" />

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto my-8 p-6 bg-slate-50 shadow-md rounded-lg"
            >
                <div className="col-span-2">
                    <input
                        type="text"
                        className="border border-gray-300 py-2 px-3 rounded-md w-full"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="email"
                        className="border border-gray-300 py-2 px-3 rounded-md w-full"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <select
                        className="border border-gray-300 py-2 px-3 rounded-md w-full"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select your gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <input
                        type="number"
                        className="border border-gray-300 py-2 px-3 rounded-md w-full"
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
                        className="border border-gray-300 py-2 px-3 rounded-md w-full"
                        placeholder="Enter your weight (kg)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <input
                        type="tel"
                        className="border border-gray-300 py-2 px-3 rounded-md w-full"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="text"
                        className="border border-gray-300 py-2 px-3 rounded-md w-full"
                        placeholder="Enter your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="tel"
                        className="border border-gray-300 py-2 px-3 rounded-md w-full"
                        placeholder="Enter emergency contact number"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <select
                        className="border border-gray-300 py-2 px-3 rounded-md w-full"
                        value={membershipType}
                        onChange={(e) => setMembershipType(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select membership type</option>
                        <option value="regular">Regular</option>
                        <option value="exclusive">Exclusive</option>
                        <option value="vip">VIP</option>
                        <option value="bronze">Bronze</option>
                        <option value="silver">Silver</option>
                        <option value="gold">Gold</option>
                    </select>
                </div>

                <div className="col-span-2">
                    <select
                        className="border border-gray-300 py-2 px-3 rounded-md w-full"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select payment mode</option>
                        <option value="upi">UPI</option>
                        <option value="cash">Cash</option>
                    </select>
                </div>

                {paymentMode === "upi" && (
                    <div className="col-span-2">
                        <input
                            type="text"
                            className="border border-gray-300 py-2 px-3 rounded-md w-full"
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
                            className="border border-gray-300 py-2 px-3 rounded-md w-full"
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
                        Join Now
                    </button>
                </div>
            </form>
        </div>
    );
}

export default JoiningForm;
