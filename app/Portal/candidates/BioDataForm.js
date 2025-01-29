"use client";
import { FaTimes } from "react-icons/fa";
import { PiCheckCircle } from "react-icons/pi";

export default function BioDataForm({
    jobSeekerDetails,
    handleInputChange,
    jobseekerUpdateSubmitHandler,
    isSubmitting,
    onClose,
}) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {/* Popup Container */}
            <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h4 className="text-2xl font-semibold text-[#001571]">Edit Bio Data</h4>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 focus:outline-none"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <form onSubmit={jobseekerUpdateSubmitHandler} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                Birth Day
                            </label>
                            <input
                                type="date"
                                name="dob"
                                value={jobSeekerDetails.dob || ""}
                                onChange={handleInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                Nationality
                            </label>
                            <input
                                type="text"
                                name="nationality"
                                value={jobSeekerDetails.nationality || ""}
                                onChange={handleInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                Languages
                            </label>
                            <input
                                type="text"
                                name="languages"
                                value={jobSeekerDetails.languages || ""}
                                placeholder="example: English, French, Spanish, ...etc"
                                onChange={handleInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={jobSeekerDetails.address || ""}
                                onChange={handleInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                Age
                            </label>
                            <input
                                type="text"
                                name="age"
                                disabled
                                value={jobSeekerDetails.age || ""}
                                onChange={handleInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                Marital Status
                            </label>
                            <select
                                name="maritalStatus"
                                value={jobSeekerDetails.maritalStatus || ""}
                                onChange={handleInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                            >
                                <option value="">Select Marital Status</option>
                                <option value="Married">Married</option>
                                <option value="Single">Single</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                Religion
                            </label>
                            <input
                                type="text"
                                name="religion"
                                value={jobSeekerDetails.religion || ""}
                                onChange={handleInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#001571]">
                                Ethnicity
                            </label>
                            <input
                                type="text"
                                name="ethnicity"
                                value={jobSeekerDetails.ethnicity || ""}
                                onChange={handleInputChange}
                                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-end">
                    <button
                        type="submit"
                        onClick={jobseekerUpdateSubmitHandler}
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