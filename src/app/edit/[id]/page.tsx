'use client'
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGetMemberByIdQuery, useUpdateMemberMutation } from '../../../api/membersApiSlice';
import toast from 'react-hot-toast';
import { Member } from '../../../lib/member.model'; // Import the Member model

const EditMember = () => {
    const { id } = useParams(); // Get the id from the URL parameters
    const router = useRouter();
    const { data: memberData, isLoading } = useGetMemberByIdQuery(id as string); // Pass id to the query
    const [updateMember] = useUpdateMemberMutation();

    const [member, setMember] = useState<Member | null>(null);

    useEffect(() => {
        if (memberData) {
            setMember(memberData); // Set member data when fetched
        }
    }, [memberData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMember((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (member) {
            try {
                await updateMember(member).unwrap();
                toast.success('Member updated successfully');
                console.log('Redirecting to dashboard...');
                router.push('/dashboard');
            } catch (error) {
                toast.error('Failed to update member');
                console.error('Update failed:', error);
            }
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (!member) return <p>Member not found</p>;

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto my-8 p-6 bg-slate-50 shadow-md rounded-lg"
        >
            {/* Form fields remain unchanged */}
            <div className="col-span-2">
                <input
                    type="text"
                    name="name"
                    className="border border-gray-300 p-3 rounded-md w-full"
                    placeholder="Enter your name"
                    value={member.name}
                    onChange={handleChange}
                    required
                />
            </div>
            {/* Other form fields */}
            <div className="col-span-2">
                <input
                    type="email"
                    name="email"
                    className="border border-gray-300 p-3 rounded-md w-full"
                    placeholder="Enter your email"
                    value={member.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <select
                    name="gender"
                    className="border border-gray-300 p-3 rounded-md w-full"
                    value={member.gender}
                    onChange={handleChange}
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
                    name="age"
                    className="border border-gray-300 p-3 rounded-md w-full"
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
                    className="border border-gray-300 p-3 rounded-md w-full"
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
                    className="border border-gray-300 p-3 rounded-md w-full"
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
                    className="border border-gray-300 p-3 rounded-md w-full"
                    placeholder="Enter your address"
                    value={member.address || ''}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="col-span-2">
                <input
                    type="tel"
                    name="emergencyContact"
                    className="border border-gray-300 p-3 rounded-md w-full"
                    placeholder="Enter emergency contact number"
                    value={member.emergencyContact || ''}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="col-span-2">
                <select
                    name="membershipType"
                    className="border border-gray-300 p-3 rounded-md w-full"
                    value={member.membershipType}
                    onChange={handleChange}
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
                <button
                    type="submit"
                    className="bg-orange-600 w-full p-3 rounded-md hover:bg-orange-500 transition"
                >
                    Update Member
                </button>
            </div>
        </form>
    );
};

export default EditMember;

