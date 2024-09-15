import React from 'react';

const Skeleton = () => {
    return (
        <div className="p-8 bg-gray-100 min-h-screen flex justify-center">
            <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
                <h2 className="text-center text-2xl font-semibold p-4">Dream Fitness Members</h2>
                <div className="flex justify-between items-center px-4 py-2">
                    <input
                        type="text"
                        className="border border-gray-300 p-2 rounded w-1/4"
                        placeholder="Search by name"
                        disabled
                    />
                    <button className="bg-green-500 text-white px-4 py-2 rounded" disabled>
                        Download Excel
                    </button>
                </div>
                <table className="table-auto w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2">Sr. No.</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Phone</th>
                            <th className="px-4 py-2">Date of Joining</th>
                            <th className="px-4 py-2">Valid Upto</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(3)].map((_, index) => (
                            <tr key={index} className="animate-pulse">
                                <td className="px-4 py-2">
                                    <div className="h-4 w-8 bg-gray-300 rounded"></div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="h-4 w-48 bg-gray-300 rounded"></div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                                </td>
                                <td className="px-4 py-2 flex justify-center space-x-2">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Skeleton;
