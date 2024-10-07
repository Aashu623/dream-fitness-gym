import React from 'react';

const MemberListSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="mb-4 flex justify-between items-center">
                <div className="bg-gray-700 w-48 h-10 rounded-lg animate-pulse"></div>
                <div className="bg-gray-700 w-28 h-10 rounded-lg animate-pulse"></div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                        <tr>
                            {['Status', '#', 'Name', 'Email', 'Phone', 'DOJ', 'Valid Upto', 'Actions'].map((header, idx) => (
                                <th key={idx} scope="col" className="py-3 px-2">
                                    <div className="bg-gray-700 h-4 w-20 rounded animate-pulse"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                        {/* Skeleton Rows */}
                        {[...Array(10)].map((_, index) => (
                            <tr key={index} className="bg-gray-700">
                                {Array(8).fill(2).map((_, idx) => (
                                    <td key={idx} className="py-3 px-2">
                                        <div className="bg-gray-600 h-4 w-full rounded animate-pulse"></div>
                                    </td>
                                ))}
                                <td className="py-3 px-2">
                                    <div className="flex space-x-2">
                                        <div className="bg-gray-600 h-5 w-5 rounded-lg animate-pulse"></div>
                                        <div className="bg-gray-600 h-5 w-5 rounded-lg animate-pulse"></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MemberListSkeleton;
