"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
  useGetMemberByIdQuery,
  useUpdateMemberMutation,
} from "@/redux/slice/membersApiSlice";
import { z } from "zod";
import Image from "next/image";
import formBg from '@/assets/formBg.png';


const memberSchema = z.object({
  serialNumber: z.number(),
  name: z.string().min(1, "Name is required"),
  age: z.number().min(1, "Age is required"),
  email: z.string().email("Invalid email").optional(),
  gender: z.enum(["male", "female", "other"]),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits"),
  address: z.string().optional(),
  emergencyContact: z
    .string()
    .min(10, "Emergency contact must be at least 10 digits")
    .optional(),
  duration: z.number().min(1, "Duration is required"),
  paymentMode: z.enum(["upi", "cash"]),
  utr: z.string().optional(),
  receiverName: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  verified: z.boolean(),
  planStarted: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
});

// Input field component
const InputField = ({ label, ...props }) => (
  <div className="col-span-1">
    <label className="block text-sm font-semibold text-white">{label}</label>
    <input
      className="w-full px-3 py-2 mt-1 border bg-transparent text-white text-sm placeholder:text-white placeholder:text-sm border-gray-300 rounded-lg shadow-sm "
      {...props}
    />
  </div>
);

function MemberDetailsPage() {
  const router = useRouter();
  const { id }: { id: string } = useParams();
  const { data: member, isLoading: fetching, isError } = useGetMemberByIdQuery(id);
  const [updateMember, { isLoading: updating }] = useUpdateMemberMutation();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pin, setPin] = useState("");
  const [formData, setFormData] = useState({
    serialNumber: 0,
    name: "",
    age: "",
    email: "",
    gender: "",
    phone: "",
    address: "",
    emergencyContact: "",
    duration: "",
    paymentMode: "utr",
    utr: "",
    receiverName: "",
    amount: "",
    verified: false,
    planStarted: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (member) {
      setFormData({
        serialNumber: member.serialNumber,
        name: member.name,
        age: member.age.toString(),
        email: member.email || "",
        gender: member.gender,
        phone: member.phone,
        address: member.address || "",
        emergencyContact: member.emergencyContact || "",
        duration: member.duration.toString(),
        paymentMode: member.paymentMode,
        utr: member.utr || "",
        receiverName: member.receiverName || "",
        amount: member.amount,
        verified: member.verified,
        planStarted: member.planStarted
          ? new Date(member.planStarted).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setShowUpdateModal(true);
  };

  const handleConfirmUpdate = async () => {
    if (pin !== "191800") {
      toast.error("Wrong PIN! Contact the owner to update the member.");
      return;
    }

    const parsedData = {
      ...formData,
      age: parseInt(formData.age),
      duration: parseInt(formData.duration),
      planStarted: formData.planStarted,
      verified: formData.verified,
    };

    const validation = memberSchema.safeParse(parsedData);
    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      return;
    }

    try {
      await updateMember({
        id: id,
        updatedData: {
          ...parsedData,
          planStarted: new Date(parsedData.planStarted),
        },
      }).unwrap();

      setShowUpdateModal(false);
      setPin("");
      router.push("/dashboard/members");
      toast.success("Member updated successfully!");
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to update member!";
      toast.error(errorMessage);
      setShowUpdateModal(false);
      setPin("");
    }
  };

  if (fetching)
    return (
      <div className="min-w-screen min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  if (isError) return <p>Error loading member details</p>;

  return (
    <>
      <Toaster position="bottom-center" />
      <h1 className="absolute text-9xl white top-2 font-extrabold text-gray-500">UPDATE</h1>
      <div className="w-full flex justify-center max-w-screen-lg rounded-xl z-10 mt-10 ">
        <div className="w-full overflow-hidden min-h-full flex items-center justify-between flex-col">
          <Image src={formBg} alt="formBg" className="h-full w-full rounded-l-md" />
        </div>
        <div className="flex flex-col gap-4 rounded-r-md bg-gray-800 w-full px-8 pt-6 shadow-lg">
          <form
            onSubmit={(e)=>e.preventDefault()}
            className="min-w-[600px] grid grid-cols-1 sm:grid-cols-2 gap-3 bg-transparent relative">

            {/* Name */}
            <InputField
              label="Name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Serial Number */}
            <InputField
              label="Serial Number"
              type="number"
              name="serialNumber"
              placeholder="Serial Number"
              value={formData.serialNumber}
              onChange={handleChange}
              readOnly
              required
            />

            {/* Email */}
            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Gender */}
            <div className="col-span-1">
              <label htmlFor="gender" className="text-white font-semibold">Gender</label>
              <select
                name="gender"
                className="border border-gray-300 py-2 px-3 w-full bg-transparent text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Age */}
            <InputField
              label="Age"
              type="number"
              name="age"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleChange}
              required
            />

            {/* Phone */}
            <InputField
              label="Phone"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            {/* Address */}
            <InputField
              label="Address"
              type="text"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              required={false}
            />

            {/* Duration */}
            <InputField
              label="Duration"
              type="number"
              name="duration"
              placeholder="Duration (in months)"
              value={formData.duration}
              onChange={handleChange}
              required
            />

            {/* Payment Mode */}
            <div className="col-span-1">
              <label htmlFor="paymentMode" className="text-white font-semibold">Payment Mode</label>
              <select
                name="paymentMode"
                className="border border-gray-300 py-2 px-3 w-full bg-transparent text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={formData.paymentMode}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select payment mode</option>
                <option value="upi">UPI</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            {/* Conditional UTR */}
            {formData.paymentMode === "upi" && (
              <InputField
                label="UTR"
                type="text"
                name="utr"
                placeholder="Enter UTR"
                value={formData.utr}
                onChange={handleChange}
                required={formData.paymentMode === "upi"}
              />
            )}

            {/* Conditional Receiver Name */}
            {formData.paymentMode === "cash" && (
              <InputField
                label="Receiver Name"
                type="text"
                name="receiverName"
                placeholder="Name of cash receiver"
                value={formData.receiverName}
                onChange={handleChange}
                required={formData.paymentMode === "cash"}
              />
            )}

            {/* Amount */}
            <InputField
              label="Amount"
              type="text"
              name="amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />

            {/* Plan Started */}
            <InputField
              label="Plan Started"
              type="date"
              name="planStarted"
              placeholder="Enter plan started date"
              value={formData.planStarted}
              onChange={handleChange}
              required={false}
            />

            {/* Verified */}
            <input
              className="absolute -bottom-10 left-2 h-6 w-6 mt-2 mr-2"
              type="checkbox"
              name="verified"
              checked={formData.verified}
              onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
              required={false}
            />
          </form>
          <div className="col-span-2 flex justify-end gap-2 mb-4">
            <button
              type="button"
              onClick={(e)=>setShowUpdateModal(true)}
              className="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {updating ? "Updating..." : "Update Member"}
            </button>
          </div>

          {showUpdateModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Enter PIN</h2>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN"
                  className="border border-gray-300 py-2 px-3 text-black w-full bg-white placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="flex justify-end mt-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={()=>handleConfirmUpdate()}
                    className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MemberDetailsPage;