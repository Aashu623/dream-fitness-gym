'use client'
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGetMemberByIdQuery, useUpdateMemberMutation } from '@/redux/slice/membersApiSlice';
import toast from 'react-hot-toast';
import { Member } from '@/lib/member.model';

const EditMember = () => {
    const { id } = useParams();
    const router = useRouter();
    const { data: memberData, isLoading } = useGetMemberByIdQuery(id as string);
    const [updateMember] = useUpdateMemberMutation();

    const [member, setMember] = useState<Member | null>(null);

    useEffect(() => {
        if (memberData) {
            setMember(memberData);
        }
        console.log(memberData)
    }, [memberData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMember((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (member) {
            try {
                await updateMember({ updatedData: member }).unwrap();
                toast.success('Member updated successfully');
                router.push('/dashboard');
            } catch (error) {
                toast.error('Failed to update member');
                console.error('Update failed:', error);
            }
        }
    };

    const renderSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto my-8 p-6 bg-slate-50 shadow-md rounded-lg">
            {Array(9).fill(0).map((_, index) => (
                <div key={index} className={`col-span-${index === 0 || index === 1 || index === 7 ? '2' : '1'}`}>
                    <div className="bg-gray-300 animate-pulse h-10 w-full rounded-md" />
                </div>
            ))}
            <div className="col-span-2">
                <div className="bg-gray-300 animate-pulse h-12 w-full rounded-md" />
            </div>
        </div>
    );

    if (isLoading) return renderSkeleton();
    if (!member) return <p>Member not found</p>;

    return (
        <div className="form-contianer min-h-screen min-w-screen flex flex-col items-center justify-center">
            <form

                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-screen-md max-h-[500px] scroll-smooth overflow-auto w-full mx-auto my-8 p-6 backdrop-blur-sm shadow-md drop-shadow-md"
            >
                <div className="col-span-2">
                    <input
                        type="text"
                        name="name"
                        className="border-b border-gray-300 py-2 px-3 text-white w-full bg-transparent placeholder:text-white outline-none"
                        placeholder="Enter your name"
                        value={member.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="email"
                        name="email"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                        placeholder="Enter your email"
                        value={member.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <select
                        name="gender"
                        className="border-b border-gray-300 py-2 px-3 font-semibold w-full bg-transparent text-white appearance-none"
                        value={member.gender}
                        onChange={handleChange}
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
                        name="age"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                        placeholder="Enter your age"
                        value={member.age}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <input
                        type="number"
                        name="weight"
                        step="0.1"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                        placeholder="Enter your weight (kg)"
                        value={member.weight}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <input
                        type="tel"
                        name="phone"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                        placeholder="Enter your phone number"
                        value={member.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="text"
                        name="address"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                        placeholder="Enter your address"
                        value={member.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="tel"
                        name="emergencyContact"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                        placeholder="Enter emergency contact number"
                        value={member.emergencyContact}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="col-span-2">
                    <select
                        name="duration"
                        className="border-b border-gray-300 py-2 px-3 font-semibold w-full bg-transparent text-white outline-none"
                        value={member.duration}
                        onChange={(e) => setMember((prev) => prev ? { ...prev, duration: parseInt(e.target.value) } : null)}
                        required
                    >
                        <option value="" disabled className="bg-transparent text-white">Select membership duration</option>
                        <option value="1" className="bg-transparent text-white">1 month</option>
                        <option value="3" className="bg-transparent text-white">3 months</option>
                        <option value="6" className="bg-transparent text-white">6 months</option>
                        <option value="12" className="bg-transparent text-white">12 months (yearly)</option>
                    </select>
                </div>

                <div className="col-span-2">
                    <select
                        name="paymentMode"
                        className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent text-white outline-none appearance-none"
                        value={member.paymentMode}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled className="bg-transparent text-white">Select payment mode</option>
                        <option value="upi" className="bg-transparent text-white">UPI</option>
                        <option value="cash" className="bg-transparent text-white">Cash</option>
                    </select>
                </div>

                {member.paymentMode === "upi" && (
                    <div className="col-span-2">
                        <input
                            type="text"
                            name="utr"
                            className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                            placeholder="Enter UTR number"
                            value={member.utr}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                {member.paymentMode === "cash" && (
                    <div className="col-span-2">
                        <input
                            type="text"
                            name="receiverName"
                            className="border-b border-gray-300 py-2 px-3 text-white font-semibold w-full bg-transparent placeholder:text-white outline-none"
                            placeholder="Enter Receiver's name"
                            value={member.receiverName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <div className="col-span-2 flex items-center gap-4">
                    <label htmlFor="verified" className="text-white font-semibold">
                        Verified
                    </label>
                    <input
                        type="checkbox"
                        id="verified"
                        name="verified"
                        className="text-white"
                        checked={member.verified || false}
                        onChange={(e) => setMember((prev) => prev ? { ...prev, verified: e.target.checked } : null)}
                    />
                </div>

            </form>

            <button
                onClick={handleSubmit}
                className="py-2 px-4 bg-blue-600 max-w-screen-md hover:bg-blue-700 text-white font-semibold rounded-md w-full"
            >
                Update Member
            </button>
        </div>
    );
};

export default EditMember;
