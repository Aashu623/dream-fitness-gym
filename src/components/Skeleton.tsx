import React from 'react';

const Skeleton = () => {
    return (
        <div className="p-8 bg-gray-100 min-h-screen flex justify-center">
            <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
                <h2 className="text-center text-2xl font-semibold p-4">Dream Fitness Members</h2>
                <table className="table-auto w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Contact</th>
                            <th className="px-4 py-2">Membership</th>
                            <th className="px-4 py-2">Payment Mode</th>
                            <th className="px-4 py-2">UTR/Receiver</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(3)].map((_, index) => (
                            <tr key={index} className="animate-pulse">
                                <td className="px-4 py-2">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                </td>
                                <td className="px-4 py-2 flex justify-center">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
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
