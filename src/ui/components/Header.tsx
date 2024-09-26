// src/components/Header.tsx
'use client'
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/logo.png'
const Header = () => {
    return (
        < header className="top-0 left-0 w-full bg-gray-500 text-white flex justify-between items-center py-2 px-8" >
            {/* Logo */}
            < div className="flex items-center space-x-4" >
                <Image
                    src={logo}
                    alt="Dream Fitness Logo"
                    className="h-20 w-20"
                />
            </div >
            {/* Navigation */}
            < nav className="space-x-8 text-2xl font-bold" >
                <Link href="/" className="hover:text-orange-600">
                    Home
                </Link>
                <Link href="/program" className="hover:text-orange-600">
                    Program
                </Link>
                <Link href="/why-us" className="hover:text-orange-600">
                    Why Us
                </Link>
                <Link href="/plan" className="hover:text-orange-600">
                    Plan
                </Link>
                <Link href="/testimonials" className="hover:text-orange-600">
                    Testimonials
                </Link>
            </nav >

            < Link href="/dashboard" className="bg-orange-600 text-black px-4 py-2 rounded-lg hover:bg-orange-600" >
                Dashboard
            </Link >
        </header >
    );
};

export default Header;