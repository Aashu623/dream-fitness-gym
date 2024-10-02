"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
  useGetMemberByIdQuery,
  useUpdateMemberMutation,
} from "@/redux/slice/membersApiSlice";
import { z } from "zod";

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
    .string()
    .min(1, "Amount is required"),
  verified: z.boolean(),
  planStarted: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
});

const InputField = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  readOnly,
  required,
}) => (
  <input
    type={type}
    name={name}
    className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    required={required}
  />
);

function MemberDetailsPage() {
  const router = useRouter();
  const { id }: { id: string } = useParams();
  const {
    data: member,
    isLoading: fetching,
    isError,
  } = useGetMemberByIdQuery(id);
  const [updateMember, { isLoading: updating }] = useUpdateMemberMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
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
    amount: '',
    verified: false,
    planStarted: new Date().toISOString().split("T")[0],
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
        amount: member.amount,
        verified: member.verified,
        planStarted: member.planStarted
          ? new Date(member.planStarted).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "number" || name === "duration") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseInt(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    setShowUpdateModal(true);
  };

  const handleConfirmUpdate = async () => {
    if (pin !== "191800") {
      toast.error("Wrong PIN! Contact the owner to update the member.");
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
        id: id,
        updatedData: { ...formData, planStarted: new Date(formData.planStarted) },
      }).unwrap();

      setIsEditing(false);
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
          amount: member.amount,
          verified: member.verified,
          planStarted: member.planStarted
            ? new Date(member.planStarted).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        });
      }
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
    <div className="w-full form-container overflow-auto">
      <Toaster position="bottom-center" />

      <form
        onSubmit={isEditing ? handleSave : handleEdit}
        className="sm:grid sm:grid-cols-2 border-2 rounded-xl gap-6 max-w-screen-md w-full mx-auto my-8 p-6 backdrop-blur-sm shadow-md drop-shadow-lg overflow-y-auto"
      >
        <div className="col-span-1">
          <InputField
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            readOnly={!isEditing}
            required
          />
        </div>
        <div className="col-span-1">
          <InputField
            type="number"
            name="serialNumber"
            placeholder="Enter your serial number"
            value={formData.serialNumber}
            onChange={handleChange}
            readOnly
            required
          />
        </div>

        <div className="col-span-2">
          <InputField
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            readOnly={!isEditing}
            required={true}
          />
        </div>

        <div>
          <label htmlFor="gender" className="sr-only">
            Gender
          </label>
          <select
            name="gender"
            id="gender"
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
          <InputField
            type="number"
            name="age"
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleChange}
            readOnly={!isEditing}
            required
          />
        </div>

        <div>
          <InputField
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            readOnly={!isEditing}
            required
          />
        </div>
        <div>
          <InputField
            type="tel"
            name="emergencyContact"
            placeholder="Enter emergency contact number"
            value={formData.emergencyContact}
            onChange={handleChange}
            readOnly={!isEditing}
            required={true}
          />
        </div>
        <div className="col-span-2">
          <InputField
            type="text"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            readOnly={!isEditing}
            required={false}
          />
        </div>

        <div>
          <label htmlFor="duration" className="sr-only">
            Duration
          </label>
          <select
            name="duration"
            id="duration"
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
            {[...Array(12)].map((_, index) => {
              const month = index + 1;
              const label =
                month === 12
                  ? "12 months (yearly)"
                  : `${month} month${month > 1 ? "s" : ""}`;
              return (
                <option
                  key={month}
                  value={month}
                  className="bg-transparent font-semibold text-orange-500"
                >
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label htmlFor="paymentMode" className="sr-only">
            Payment Mode
          </label>
          <select
            name="paymentMode"
            id="paymentMode"
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
            <InputField
              type="text"
              name="utr"
              placeholder="Enter UTR number"
              value={formData.utr}
              onChange={handleChange}
              readOnly={!isEditing}
              required={false}
            />
          </div>
        )}

        {formData.paymentMode === "cash" && (
          <div>
            <InputField
              type="text"
              name="receiverName"
              placeholder="Enter receiver's name"
              value={formData.receiverName}
              onChange={handleChange}
              readOnly={!isEditing}
              required={false}
            />
          </div>
        )}

        <div>
          <InputField
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleChange}
            readOnly={!isEditing}
            required
          />
        </div>
        <div>
          <InputField
            type="date"
            name="planStarted"
            placeholder="Enter start date"
            value={formData.planStarted}
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
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded"
                disabled={updating}
              >
                {updating ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={handleCancel}
                disabled={updating}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handleEdit}
            >
              Edit
            </button>
          )}
        </div>

        {/* PIN Confirmation Modal */}
        {showUpdateModal && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg" role="document">
              <h2 id="modal-title" className="text-lg font-bold mb-4">
                Confirm Update
              </h2>
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
                  disabled={updating}
                  onClick={handleConfirmUpdate}
                >
                  {updating ? "Confirming..." : "Confirm"}
                </button>
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                  onClick={() => setShowUpdateModal(false)}
                  disabled={updating}
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
