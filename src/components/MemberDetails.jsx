"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
  useGetMemberByIdQuery,
  useUpdateMemberMutation,
} from "@/redux/slice/membersApiSlice";
import { string, z } from "zod";
import { Member } from "@/lib/member.model";

// Define Zod schema matching memberSchema from mongoose
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
  amount: z
    .number()
    .positive("Amount must be a positive number")
    .min(1, "Amount is required"),
});

function MemberDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: member, isLoading, isError } = useGetMemberByIdQuery(id);
  const [updateMember] = useUpdateMemberMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pin, setPin] = useState("");
  const [formData, setFormData] = useState({
    serialNumber: 0,
    name: "",
    age: 0,
    email: "",
    gender: "",
    phone: "",
    address: "",
    emergencyContact: "",
    duration: 0,
    paymentMode: "",
    utr: "",
    receiverName: "",
    amount: 0,
    verified: false,
  });

  useEffect(() => {
    if (member) {
      setFormData({
        serialNumber: member.serialNumber,
        name: member.name,
        age: member.age,
        email: member.email || "",
        gender: member.gender,
        phone: member.phone,
        address: member.address || "",
        emergencyContact: member.emergencyContact || "",
        duration: member.duration,
        paymentMode: member.paymentMode,
        utr: member.utr || "",
        receiverName: member.receiverName || "",
        amount: parseInt(member.amount),
        verified: member.verified,
      });
    }
  }, [member, setFormData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "number" || name === "duration") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setShowDeleteDialog(true);
  };

  const handleConfirmUpdate = async () => {
    if (pin !== "191800") {
      toast.error("Wrong pin! Contact owner to Update the member.");
      return;
    }
    const validation = memberSchema.safeParse(formData);
    if (!validation.success) {
      console.log(validation.error);
      validation.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      return;
    }
    try {
      await updateMember({
        id,
        updatedData: { ...formData },
      }).unwrap();
      toast.success("Member updated successfully!");

      setIsEditing(false);
      setShowDeleteDialog(false);
      setPin("");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to update member!");
      setShowDeleteDialog(false);
      setPin("");
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel editing? All changes will be lost."
      )
    ) {
      setIsEditing(false);
    }
  };

  if (feching)
    return (
      <div className="min-w-screen min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  if (isError) return <p>Error loading member details</p>;

  return (
    <div className="w-full form-contianer overflow-auto">
      <Toaster position="bottom-center" />

      <form
        onSubmit={handleEdit}
        className="sm:grid sm:grid-cols-2 border-2 rounded-xl gap-6 max-w-screen-md w-full mx-auto my-8 p-6 backdrop-blur-sm shadow-md drop-shadow-lg overflow-y-auto"
      >
        <div className="col-span-1">
          <input
            type="text"
            name="name"
            className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            readOnly={!isEditing}
            required
          />
        </div>
        <div className="col-span-1">
          <input
            type="number"
            name="serialNumber"
            className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
            placeholder="Enter your serial number"
            value={formData.serialNumber}
            onChange={handleChange}
            readOnly
            required
          />
        </div>

        <div className="col-span-2">
          <input
            type="email"
            name="email"
            className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </div>

        <div>
          <select
            name="gender"
            className="border-b border-gray-300 py-2 px-3 font-semibold w-full bg-transparent text-white appearance-none"
            value={formData.gender}
            onChange={handleChange}
            disabled={!isEditing}
            required
          >
            <option
              value=""
              disabled
              className="bg-transparent text-orange-500"
            >
              Select your gender
            </option>
            <option value="male" className="bg-transparent text-orange-500">
              Male
            </option>
            <option value="female" className="bg-transparent text-orange-500">
              Female
            </option>
            <option value="other" className="bg-transparent text-orange-500">
              Other
            </option>
          </select>
        </div>

        <div>
          <input
            type="number"
            name="age"
            className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleChange}
            readOnly={!isEditing}
            required
          />
        </div>

        <div>
          <input
            type="tel"
            name="phone"
            className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            readOnly={!isEditing}
            required
          />
        </div>
        <div>
          <input
            type="tel"
            name="emergencyContact"
            className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
            placeholder="Enter emergency contact number"
            value={formData.emergencyContact}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </div>
        <div className="col-span-2">
          <input
            type="text"
            name="address"
            className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </div>

        <div>
          <select
            name="duration"
            className="border-b border-gray-300 py-2 px-3 font-semibold w-full bg-transparent text-white appearance-none"
            value={formData.duration}
            onChange={handleChange}
            disabled={!isEditing}
            required
          >
            <option
              value=""
              disabled
              className="bg-transparent text-orange-500"
            >
              Select duration
            </option>
            <option
              value={1}
              className="bg-transparent font-semibold text-orange-500"
            >
              1 month
            </option>
            <option
              value={2}
              className="bg-transparent font-semibold text-orange-500"
            >
              2 months
            </option>
            <option
              value={3}
              className="bg-transparent font-semibold text-orange-500"
            >
              3 months
            </option>
            <option
              value={4}
              className="bg-transparent font-semibold text-orange-500"
            >
              4 months
            </option>
            <option
              value={5}
              className="bg-transparent font-semibold text-orange-500"
            >
              5 months
            </option>
            <option
              value={6}
              className="bg-transparent font-semibold text-orange-500"
            >
              6 months
            </option>
            <option
              value={7}
              className="bg-transparent font-semibold text-orange-500"
            >
              7 months
            </option>
            <option
              value={8}
              className="bg-transparent font-semibold text-orange-500"
            >
              8 months
            </option>
            <option
              value={9}
              className="bg-transparent font-semibold text-orange-500"
            >
              9 months
            </option>
            <option
              value={10}
              className="bg-transparent font-semibold text-orange-500"
            >
              10 months
            </option>
            <option
              value={11}
              className="bg-transparent font-semibold text-orange-500"
            >
              11 months
            </option>
            <option
              value={12}
              className="bg-transparent font-semibold text-orange-500"
            >
              12 months (yearly)
            </option>
          </select>
        </div>

        <div>
          <select
            name="paymentMode"
            className="border-b border-gray-300 py-2 px-3 font-semibold w-full bg-transparent text-white appearance-none"
            value={formData.paymentMode}
            onChange={handleChange}
            disabled={!isEditing}
            required
          >
            <option
              value=""
              disabled
              className="bg-transparent text-orange-500"
            >
              Select payment mode
            </option>
            <option value="upi" className="bg-transparent text-orange-500">
              UPI
            </option>
            <option value="cash" className="bg-transparent text-orange-500">
              Cash
            </option>
          </select>
        </div>

        {formData.paymentMode === "upi" && (
          <div>
            <input
              type="text"
              name="utr"
              className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
              placeholder="Enter UTR number"
              value={formData.utr}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        )}

        {formData.paymentMode === "cash" && (
          <div>
            <input
              type="text"
              name="receiverName"
              className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
              placeholder="Enter receiver's name"
              value={formData.receiverName}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        )}

        <div>
          <input
            type="number"
            name="amount"
            className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
            readOnly={!isEditing}
            required
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-white font-semibold ">
            <input
              type="checkbox"
              name="verified"
              className="form-checkbox"
              checked={formData.verified}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  verified: e.target.checked,
                }))
              }
              disabled={!isEditing}
            />
            Verified
          </label>
        </div>
        <div className="col-span-2 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                className="bg-green-500 text-white py-2 px-4 rounded"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                type="button"
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handleEdit}
            >
              Edit
            </button>
          )}
        </div>

        {/* PIN Confirmation Modal (conditionally rendered) */}
        {showDeleteDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-700">Enter PIN to confirm update</p>
              <input
                type="password"
                className="border p-2 rounded w-full mt-2"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
              />
              <div className="flex justify-end mt-4 gap-3">
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded"
                  onClick={handleConfirmUpdate}
                >
                  Confirm
                </button>
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default MemberDetailsPage;
