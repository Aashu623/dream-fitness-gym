import React from 'react'
import Image from 'next/image'
import logo from '../assets/logo.png'
export default function Main() {
    return (
        <div className="flex justify-between items-center w-full px-8 py-8">

            <div className="w-full md:w-1/2">
                <div className="text-left">
                    <h2 className="text-lg font-semibold bg-orange-600 text-black inline-block px-4 py-2 rounded-full mb-4">
                        THE BEST FITNESS CLUB OF TOWN
                    </h2>
                    <h1 className="text-6xl font-extrabold mb-4">DREAM FITNESS</h1>
                    <h2 className="text-5xl font-semibold">GYM</h2>
                    <p className="mt-4 text-lg">
                        In here, we will help you shape and build your dream body and live up your life to the fullest.
                    </p>
                    <div className="mt-8 space-x-4">
                        <button className="bg-orange-600 text-black px-6 py-3 rounded-lg hover:bg-orange-600">
                            Get Started
                        </button>
                        <button className="border border-orange-600  px-6 py-3 rounded-lg hover:bg-orange-600">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>


            <div className="w-full md:w-1/2 flex justify-center items-center">
                <Image
                    src={logo} // Replace with your logo file path
                    alt="Dream Fitness Logo"
                    width={400}
                    height={400}
                    className="max-w-full h-auto"
                />
            </div>
        </div>
    )
}
