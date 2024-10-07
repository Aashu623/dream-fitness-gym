"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import errorBg from "@/assets/errorBg.png";

function ErrorPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/dashboard/members");
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center relative bg-gray-800">
        <Image
          src={errorBg}
          alt="Error Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        <div className="relative z-10 text-center flex flex-col items-center gap-4">
          <h1 className="text-9xl font-extrabold text-gray-500 absolute top-10">
            ERROR
          </h1>

          <div className="bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-5xl font-bold text-orange-600 mb-4">
              Oops!
            </h2>
            <p className="text-white text-lg mb-6">
              It looks like something went wrong. The page you are looking for
              cannot be found or an error occurred.
            </p>
            <button
              onClick={handleGoBack}
              className="bg-orange-600 text-white py-2 px-6 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Go Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ErrorPage;
