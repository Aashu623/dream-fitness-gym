'use client'
import React from 'react';
import RegisterForm from '@/ui/components/RegisterForm';
export default function Register() {
    return (
        <div className="min-h-screen min-w-screen bg-gradient-to-r from-black via-gray-800 to-orange-900 flex items-center justify-center">
            <RegisterForm />
        </div>
    );
}
