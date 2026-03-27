import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export function LogModal() {
    const [open, setOpen] = React.useState(false);
    const [rating, setRating] = React.useState(0);
    const toggleModal = () => setOpen(!open);

    // PREVENT SCROLL JUMP: Locks the background when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [open]);

    return (
        <>
            {/* Trigger Button - Remains in the Navbar */}
            <button
                onClick={toggleModal}
                type="button"
                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-all ml-2"
            >
                Log
            </button>
            {/* PORTAL: Teleports the modal to the bottom of <body> */}
            {open && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={toggleModal}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-2xl transition-all">
                        {/* Header */}
                        <div className="relative mb-6">

                            <p className="text-gray-500">Add movie to your films.</p>
                            <button
                                onClick={toggleModal}
                                className="absolute -top-1 -right-1 p-2 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {/* Form Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-blue-900">Name</label>
                                <input
                                    type="text"
                                    placeholder="eg. White Shoes"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                />
                            </div>
                    
                            {/* Rating Scale Section */}
                            <div className="w-full">
                                <label className="mb-2 block text-left font-sans text-sm font-medium text-blue-900">
                                    Rating (1-10)
                                </label>
                                <div className="flex flex-wrap items-center justify-between gap-1 rounded-lg border border-blue-300 bg-white p-2">
                                    {[...Array(10)].map((_, index) => {
                                        const value = index + 1;
                                        const isSelected = rating === value; 
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setRating(value)}
                                                className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold transition-all ${isSelected? 'bg-sky-900 text-white shadow-md scale-110': 'text-gray-600 hover:bg-gray-100'
                                                    }`} >{value} </button>); })}
                                </div>
                                <div className="mt-1 flex justify-between px-1 text-[10px] font-medium uppercase text-gray-400">
                                    <span>Poor</span>
                                    <span>Excellent</span>
                                </div>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={toggleModal}
                                className="rounded-lg bg-sky-600 px-6 py-2 font-semibold text-white hover:bg-sky-700 transition-colors"
                            > Log </button>
                              </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}