import React, { useState, useEffect } from 'react';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-1/6 bg-gray-600 text-white p-4">
                <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
                <ul className="space-y-4">
                    <li className="hover:text-orange-300">
                        <a href="#">Register</a>
                    </li>
                    <li className="hover:text-orange-300">
                        <a href="#">Members</a>
                    </li>
                    <li className="hover:text-orange-300">
                        <a href="#">Dummy Link 1</a>
                    </li>
                    <li className="hover:text-orange-300">
                        <a href="#">Dummy Link 2</a>
                    </li>
                </ul>
                <div className='flex flex-col gap-4 py-6 animate-pulse'>
                    <div className="p-4 bg-orange-400 text-white rounded-lg shadow-lg text-center">
                        <h2 className="text-lg font-semibold">Total Amount Collected</h2>
                        <span className="text-3xl font-bold"></span>
                    </div>
                    <div className="bg-orange-400 text-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Filter by Joining Date</h2>
                        <div className="flex flex-col gap-4 text-black">
                            <input
                                type="date"
                                name="startDate"
                                className="p-2 border rounded "
                                placeholder="Start Date"
                            />
                            <input
                                type="date"
                                name="endDate"
                                className="p-2 border rounded"
                                placeholder="End Date"
                            />
                            <div className="text-lg text-white">
                                <strong>Total Collection (in selected range): </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="w-full p-6">
                <header className="mb-6 text-center">
                    <h1 className="text-3xl font-bold">Dream Fitness</h1>
                </header>

                <section className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-orange-500 text-white rounded-lg p-6 text-center">
                        <h2 className="text-xl">Total Members</h2>
                        <p className="text-4xl font-bold">20</p>
                    </div>
                    <div className="bg-orange-500 text-white rounded-lg p-6 text-center">
                        <h2 className="text-xl">Male Members</h2>
                        <p className="text-4xl font-bold">14</p>
                    </div>
                    <div className="bg-orange-500 text-white rounded-lg p-6 text-center">
                        <h2 className="text-xl">Female Members</h2>
                        <p className="text-4xl font-bold">6</p>
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Gender Distribution</h3>
                        <div className={`w-full h-64 flex items-center justify-center ${loading ? 'animate-pulse bg-gray-200' : ''}`}>
                            {loading ? <div className="h-48 w-48 rounded-full bg-gray-300"></div> : 'Pie Chart Here'}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Plan Duration</h3>
                        <div className={`w-full h-64 flex items-center justify-center ${loading ? 'animate-pulse bg-gray-200' : ''}`}>
                            {loading ? (
                                <div className="w-48 h-48 bg-gray-300"></div>
                            ) : (
                                'Bar Chart Here'
                            )}
                        </div>
                    </div>
                </section>

                <div className="mt-6 text-center">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                        View All Members
                    </button>
                </div>
            </main>
        </div>
    );
}
