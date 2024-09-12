import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "@/assets/logo.png";
import Image from "next/image";

export default function InvoiceModal({
  member,
  setShowModal,
  setSelectedMember,
}) {
  const handleDownloadPDF = () => {
    const modalElement = document.getElementById("invoice-modal");
    if (modalElement) {
      html2canvas(modalElement, { scale: 6 })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("l", "mm", "a4"); // Landscape orientation

          const pdfWidth = 297; // Width of A4 in landscape orientation
          const pdfHeight = 210; // Height of A4 in landscape orientation
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;

          // Calculate the scaling factor
          const scaleX = pdfWidth / canvasWidth;
          const scaleY = pdfHeight / canvasHeight;
          const scale = Math.max(scaleX, scaleY); // Scale to fit the entire page

          // Calculate the new image dimensions
          const imgWidth = canvasWidth * scale;
          const imgHeight = canvasHeight * scale;

          // Position the image at the center of the PDF
          const xOffset = (pdfWidth - imgWidth) / 2;
          const yOffset = (pdfHeight - imgHeight) / 2;

          pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
          pdf.save(`${member.name}_invoice.pdf`);
        })
        .catch((error) => {
          console.error("Error generating PDF: ", error);
        });
    } else {
      console.error("Modal element not found");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  return (
    <div
      id="invoice-modal"
      className="fixed inset-0 bg-orange-100 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-lg w-full max-w-5xl shadow-lg overflow-y-auto max-h-[90vh]">
        {/* Invoice Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Image src={logo} alt="Dream Fitness" className="size-24" />
            <p className="text-sm text-gray-600 mt-2">
              Date: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm">
              Serial No: <strong>{member?.serialNumber}</strong>
            </p>
            <p className="text-sm">
              Joining Date: <strong>{member?.DOJ}</strong>
            </p>
          </div>
        </div>

        {/* Member & Billing Info */}
        <div className="flex justify-between mb-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">From</h4>
            <p>
              <strong>Dream Fitness Gym</strong>
            </p>
            <p>123 Gym Street</p>
            <p>City, State</p>
            <p>Email: gym@fitness.com</p>
          </div>
          <div className="text-right">
            <h4 className="text-lg font-semibold mb-2">Bill to</h4>
            <p>
              <strong>{member?.name}</strong>
            </p>
            <p>{member?.address}</p>
            <p>{member?.phone}</p>
            <p>{member?.email}</p>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="border-t border-b border-gray-300">
          <div className="grid grid-cols-6 py-2 font-bold text-gray-600 bg-gray-100">
            <div className="col-span-4 pl-4">Description</div>
            <div className="text-center ">Months</div>
            <div className="text-center">Amount</div>
          </div>
          <div className="grid grid-cols-6 py-2">
            <div className="col-span-4 pl-4">
              <p>Membership</p>
            </div>
            <div className="text-center">{member?.duration}</div>
            <div className="text-center">{member?.ammount}</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 pt-4 border-t border-gray-300">
          <h4 className="text-lg font-semibold mb-2">Important Instructions</h4>
          <ul className="list-disc list-inside text-gray-600">
            <li>All payments are non-refundable.</li>
            <li>Memberships are valid only for the duration specified.</li>
            <li>Please keep this invoice for your records.</li>
            <li>Contact us at gym@fitness.com for any queries or issues.</li>
          </ul>
        </div>

        <div className="text-right mt-4">
          <button
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            onClick={handleDownloadPDF}
          >
            Download Receipt
          </button>
          <button
            className="ml-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
