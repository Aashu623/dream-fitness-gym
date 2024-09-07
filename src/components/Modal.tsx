'use client'
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import JoiningForm from './JoiningForm'; // Adjust the path to where your JoiningForm component is located

const ModalWithForm = () => {
    // Handle form submission
    const handleFormSubmit = (formData: any) => {
        console.log('Form submitted:', formData);
        // Add your form submission logic here
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="box-border w-full text-violet11 shadow-blackA4 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[10px]">
                    Open Modal
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                {/* Blurrose background overlay */}
                <Dialog.Overlay className="fixed inset-0 bg-white backdrop-blur-sm" />

                <Dialog.Content className="fixed top-1/2 left-1/2 w-[80vw] h-[70vh] p-[20px] bg-white rounded-[6px] transform -translate-x-1/2 -translate-y-1/2 overflow-auto">
                    <div className="flex justify-between items-center mb-[15px]">
                        <Dialog.Title className="text-[18px] font-semibold text-black">Join Dream Fitness</Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="text-black hover:text-violet11">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </Dialog.Close>
                    </div>

                    {/* Integrate the JoiningForm component here */}
                    <JoiningForm />

                    <Dialog.Close asChild>
                        <button className="box-border w-full text-black shadow-blackA4 hover:bg-gray-200 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[10px]">
                            Close Modal
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default ModalWithForm;
