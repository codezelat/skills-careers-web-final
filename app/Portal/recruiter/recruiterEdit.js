"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import { PiCheckCircle } from "react-icons/pi";

const RECRUITER_CATEGORIES = [
    "IT - Hardware, Network & Telecoms",
    "Accounting, Banking, Finance & Insurance",
    "Sales, Marketing & Digital",
    "Corporate & Senior Management",
    "HR, Administration & Office Support",
    "Civil Engineering, Architecture & Design",
    "Mechanical, Electrical & Technical Engineerings",
    "Manufacturing, Operations & Quality",
];

export default function RecruiterEdit({
    recruiterDetails,
    onClose,
    onSubmit,
    onInputChange,
    isSubmitting,
}) {
    const [isOther, setIsOther] = useState(
        recruiterDetails.category && !RECRUITER_CATEGORIES.includes(recruiterDetails.category)
    );

    const handleCategoryChange = (e) => {
        const val = e.target.value;
        if (val === "Other") {
            setIsOther(true);
            // Don't update the parent category yet, or clear it, dependent on UX. 
            // Better to clear it so input starts empty, or keep previous if switching back?
            // Let's clear it so they can type fresh.
            onInputChange({ target: { name: "category", value: "" } });
        } else {
            setIsOther(false);
            onInputChange(e);
        }
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {/* Popup Container */}
            <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h4 className="text-2xl font-semibold text-[#001571]">Edit Profile</h4>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 focus:outline-none"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                Recruiter Name
                            </label>
                            <input
                                type="text"
                                name="recruiterName"
                                value={recruiterDetails.recruiterName || ""}
                                onChange={onInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={recruiterDetails.location || ""}
                                onChange={onInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-[#001571]">
                                    Recruiter Category
                                </label>
                                <select
                                    name="category"
                                    value={
                                        isOther
                                            ? "Other"
                                            : RECRUITER_CATEGORIES.includes(recruiterDetails.category)
                                                ? recruiterDetails.category
                                                : ""
                                    }
                                    onChange={handleCategoryChange}
                                    className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                >
                                    <option value="">Select Category</option>
                                    {RECRUITER_CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                    <option value="Other">Other</option>
                                </select>
                                {isOther && (
                                    <input
                                        type="text"
                                        name="category"
                                        placeholder="Type your category"
                                        value={recruiterDetails.category || ""}
                                        onChange={onInputChange}
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#001571]">
                                    Employee Range
                                </label>
                                <input
                                    type="text"
                                    name="employeeRange"
                                    value={recruiterDetails.employeeRange || ""}
                                    onChange={onInputChange}
                                    className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-[#001571]">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    name="email"
                                    value={recruiterDetails.email || ""}
                                    onChange={onInputChange}
                                    className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#001571]">
                                    Phone
                                </label>
                                <input
                                    type="number"
                                    name="telephoneNumber"
                                    value={recruiterDetails.telephoneNumber || ""}
                                    onChange={onInputChange}
                                    className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                Company Description
                            </label>
                            <textarea
                                name="companyDescription"
                                value={recruiterDetails.companyDescription || ""}
                                onChange={onInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                rows={4}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                Facebook
                            </label>
                            <input
                                name="facebook"
                                value={recruiterDetails.facebook || ""}
                                onChange={onInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                rows={4}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                Instagram
                            </label>
                            <input
                                name="instagram"
                                value={recruiterDetails.instagram || ""}
                                onChange={onInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                rows={4}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                LinkedIn
                            </label>
                            <input
                                name="linkedin"
                                value={recruiterDetails.linkedin || ""}
                                onChange={onInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                rows={4}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                X
                            </label>
                            <input
                                name="x"
                                value={recruiterDetails.x || ""}
                                onChange={onInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                rows={4}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                Dribbble
                            </label>
                            <input
                                name="dribbble"
                                value={recruiterDetails.dribbble || ""}
                                onChange={onInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                rows={4}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                Github
                            </label>
                            <input
                                name="github"
                                value={recruiterDetails.github || ""}
                                onChange={onInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                rows={4}
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-end">
                    <button
                        type="submit"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                            }`}
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                        <span className="ml-2">
                            <PiCheckCircle size={20} />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}