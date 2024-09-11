'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function PreviewPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        // Retrieve form data from localStorage
        const savedData = localStorage.getItem('formData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        } else {
            router.push("/register"); // Redirect if no data found
        }
    }, [router]);

    const handleEdit = () => {
        router.push("/register");
    };

    return (
        <div id="invoice-modal" className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]">
                {/* Invoice Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-4xl font-bold text-blue-600">Dream Fitness</h3>
                        <p className="text-sm text-gray-600 mt-2">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm">Invoice No: <strong>001</strong></p>
                        <p className="text-sm">Due Date: <strong>{new Date().toLocaleDateString()}</strong></p>
                    </div>
                </div>

                {/* Member & Billing Info */}
                <div className="flex justify-between mb-6">
                    <div>
                        <h4 className="text-lg font-semibold mb-2">From</h4>
                        <p><strong>Dream Fitness Gym</strong></p>
                        <p>123 Gym Street</p>
                        <p>City, State</p>
                        <p>Email: gym@fitness.com</p>
                    </div>
                    <div className="text-right">
                        <h4 className="text-lg font-semibold mb-2">Bill to</h4>
                        <p><strong>{formData?.name}</strong></p>
                        <p>{formData?.address}</p>
                        <p>{formData?.phone}</p>
                        <p>{formData?.email}</p>
                    </div>
                </div>

                {/* Invoice Table */}
                <div className="border-t border-b border-gray-300">
                    <div className="grid grid-cols-6 py-2 font-bold text-gray-600 bg-gray-100">
                        <div className="col-span-3 pl-4">Description</div>
                        <div className="text-center">Rate</div>
                        <div className="text-center">Qty</div>
                        <div className="text-center">Amount</div>
                    </div>
                    <div className="grid grid-cols-6 py-2">
                        <div className="col-span-3 pl-4">
                            <p>{formData?.duration} months Membership</p>
                        </div>
                        <div className="text-center">$50</div>
                        <div className="text-center">1</div>
                        <div className="text-center">$50</div>
                    </div>
                </div>

                <div className="text-right mt-4">
                    <button
                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                        onClick={() => {
                            handleDownloadPDF();
                        }}
                    >
                        Download Receipt
                    </button>
                    <button
                        className="ml-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                        onClick={handleEdit}
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PreviewPage;
