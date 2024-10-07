'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { useAddMemberMutation, useGetAllMembersQuery } from "@/redux/slice/membersApiSlice";
import { z } from "zod";
import { ColorRing } from 'react-loader-spinner'
import Image from "next/image";
import formBg from '@/assets/formBg.png';
import { duration } from "html2canvas/dist/types/css/property-descriptors/duration";


const memberSchema = z.object({
    serialNumber: z.number(),
    name: z.string().min(1, "Name is required"),
    age: z.number().min(1, "Age is required"),
    email: z.string().email("Invalid email").optional(),
    gender: z.enum(["male", "female", "other"]),
    phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must not exceed 15 digits"),
    address: z.string().optional(),
    emergencyContact: z.string().min(10, "Emergency contact must be at least 10 digits").optional(),
    duration: z.number().min(1, "Duration is required"),
    paymentMode: z.enum(["upi", "cash"]),
    utr: z.string().optional(),
    receiverName: z.string().optional(),
    amount: z.string().min(1, "Amount is required"),
    DOJ: z.date(),
});

function RegisterForm() {
    const router = useRouter();
    const { data: members } = useGetAllMembersQuery();
    const [addMember, { isLoading: adding }] = useAddMemberMutation();
    const initialFormData = {
        serialNumber: 0,
        name: '',
        email: '',
        gender: '',
        age: 0,
        phone: '',
        address: '',
        emergencyContact: '',
        duration: 1,
        paymentMode: 'upi',
        utr: '',
        receiverName: '',
        amount: '',
        DOJ: new Date().toISOString().split('T')[0],
    }
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (members && members.length > 0) {
            const lastMemberSerial = Math.max(...members.map((member: any) => member.serialNumber || 1));
            setFormData((prev) => ({ ...prev, serialNumber: lastMemberSerial + 1 }));
        }
    }, [members]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const updatedValue = name === "duration" || name === "age" ? parseInt(value, 10) || '' : value;

        setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validation = memberSchema.safeParse({
            ...formData,
            age: formData.age,
            DOJ: new Date(formData.DOJ),
            utr: formData.paymentMode === "upi" ? formData.utr : undefined,
            receiverName: formData.paymentMode === "cash" ? formData.receiverName : undefined,
        });

        if (!validation.success) {
            validation.error.issues.forEach((issue) => toast.error(issue.message));
            validation.error.issues.forEach((issue) => console.log(issue));
            return;
        }

        try {
            await addMember(validation.data).unwrap();
            toast.success("Member added successfully!");
            router.push("/dashboard/members");
        } catch {
            toast.error("Failed to add member!");
        }
    };

    return (
        <>
            <Toaster position="bottom-center" />
            <h1 className="absolute text-9xl white top-2 font-extrabold text-gray-500">REGISTER</h1>
            <div className="w-full flex justify-center max-w-screen-lg rounded-xl z-10 mt-10 ">
                <div className="w-full overflow-hidden min-h-full flex items-center justify-between flex-col">
                    <Image src={formBg} alt="formBg" className="h-full w-full rounded-l-md" />
                </div>
                <div className="flex flex-col gap-4 rounded-r-md bg-gray-800 w-full px-8 pt-10 shadow-lg">
                    <form onSubmit={(e) => e.preventDefault()} className="min-w-[600px] grid grid-cols-1 sm:grid-cols-2 gap-3 bg-transparent">
                        <InputField
                            label="Name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="Enter your name"
                            required
                        />

                        {/** Serial Number **/}
                        <InputField
                            label="Serial Number"
                            name="serialNumber"
                            type="number"
                            value={formData.serialNumber}
                            onChange={(e) => handleInputChange(e)}
                        />

                        {/** Email **/}
                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="Enter your email"
                        />

                        {/** Gender **/}
                        <SelectField
                            label="Gender"
                            name="gender"
                            value={formData.gender}
                            onChange={(e) => handleInputChange(e)}
                            options={[
                                { value: '', label: 'Select your gender', disabled: true },
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Other' },
                            ]}
                            required
                        />

                        {/** Age **/}
                        <InputField
                            label="Age"
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="Enter your age"
                            required
                        />

                        {/** Phone Number **/}
                        <InputField
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => {
                                handleInputChange(e);
                                setFormData((prev) => ({ ...prev, emergencyContact: e.target.value }));
                            }}
                            placeholder="Enter your phone number"
                            required
                        />

                        {/* * Emergency Contact *
                    <InputField
                        label="Emergency Contact"
                        name="emergencyContact"
                        type="tel"
                        value={formData.emergencyContact}
                        onChange={(e)=>handleInputChange(e)}
                        placeholder="Enter emergency contact number"
                    /> */}

                        {/** Address **/}
                        <InputField
                            label="Address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="Enter your address"
                        />

                        {/** Plan Duration **/}
                        <SelectField
                            label="Plan Duration"
                            name="duration"
                            type="number"
                            value={formData.duration}
                            onChange={(e) => handleInputChange(e)}
                            options={[
                                { value: '', label: "Select duration", disabled: true },
                                { value: 1, label: '1 month' },
                                { value: 2, label: '2 months' },
                                { value: 3, label: '3 months' },
                                { value: 4, label: '4 months' },
                                { value: 5, label: '5 months' },
                                { value: 6, label: '6 months' },
                                { value: 7, label: '7 months' },
                                { value: 8, label: '8 months' },
                                { value: 9, label: '9 months' },
                                { value: 10, label: '10 months' },
                                { value: 11, label: '11 months' },
                                { value: 12, label: '12 months (yearly)' },
                            ]}
                            required
                        />

                        {/** Payment Mode **/}
                        <SelectField
                            label="Payment Mode"
                            name="paymentMode"
                            value={formData.paymentMode}
                            onChange={(e) => handleInputChange(e)}
                            options={[
                                { value: '', label: 'Select payment mode', disabled: true },
                                { value: 'upi', label: 'UPI' },
                                { value: 'cash', label: 'Cash' },
                            ]}
                            required
                        />

                        {/** Amount **/}
                        <InputField
                            label="Amount"
                            name="amount"
                            type="text"
                            value={formData.amount}
                            onChange={(e) => handleInputChange(e)}
                            placeholder="Enter total amount"
                            required
                        />

                        {/** UTR (if UPI) **/}
                        {formData.paymentMode === 'upi' && (
                            <InputField
                                label="UTR"
                                name="utr"
                                type="text"
                                value={formData.utr}
                                onChange={(e) => handleInputChange(e)}
                                placeholder="Enter UTR"
                                required
                            />
                        )}

                        {/** Receiver Name (if Cash) **/}
                        {formData.paymentMode === 'cash' && (
                            <InputField
                                label="Receiver Name"
                                name="receiverName"
                                type="text"
                                value={formData.receiverName}
                                onChange={(e) => handleInputChange(e)}
                                placeholder="Enter receiver name"
                                required
                            />
                        )}

                        {/** Joining Date **/}
                        <InputField
                            label="Joining Date"
                            name="DOJ"
                            type="date"
                            value={formData.DOJ}
                            onChange={(e) => handleInputChange(e)}
                            required
                        />

                    </form>
                    <div className="col-span-2 flex justify-end gap-2">
                        <button
                            onClick={(e) => setFormData(initialFormData)}
                            type="button"
                            className="w-full max-w-[100px] p-2 bg-white font-semibold text-orange-600 hover:bg-orange-50 hover:text-orange-600 border-2 border-orange-600 rounded-lg transition-colors duration-300"
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e)}
                            disabled={adding}
                            className="w-full max-w-[100px] p-2 bg-orange-600 text-white hover:bg-white hover:text-orange-600 border-2 border-orange-600 rounded-lg transition-colors duration-300"
                        >
                            {adding ? <ColorRing height="20" width="20" /> : "Register"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function InputField({ label, ...props }) {
    return (
        <div className="col-span-1">
            <label className="block text-sm font-semibold text-white">{label}</label>
            <input
                className="w-full px-3 py-2 mt-1 border bg-transparent text-white text-sm placeholder:text-white placeholder:text-sm border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                {...props}
            />
        </div>
    );
}

function SelectField({ label, options, ...props }) {
    return (
        <div className="col-span-1">
            <label className="block text-sm font-semibold text-white">{label}</label>
            <select
                className="w-full px-3 py-2 mt-1 border bg-transparent text-gray-300 text-sm border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default RegisterForm;
