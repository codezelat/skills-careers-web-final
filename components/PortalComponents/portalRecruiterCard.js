import RecruiterProfile from "@/app/admindashboard/recruiters/RecruiterProfile";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RiDeleteBinFill, RiEdit2Fill } from "react-icons/ri";

export default function PortalJobCard({ recruiter, isSelected, onSelect }) {
    const { recruiterName, email, contactNumber, logo } = recruiter;
    const [showRecruiter, setShowRecruiter] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this recruiter?")) {
            try {
                setIsDeleting(true);
                const response = await fetch(`/api/recruiter/delete?id=${_id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert("Recruiter Deleted Successfully!!!");
                } else {
                    alert("Failed to delete recruiter...");
                }
            } catch (error) {
                console.error("Error deleting recruiter:", error);
                alert("Error deleting recruiter");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <div className="py-4 rounded-lg transition-shadow border-b border-gray-200 flex items-center text-sm font-semibold">
            {/* Checkbox */}
            <div className="flex items-center px-4 py-3 w-[3%]">
                <input
                    type="checkbox"
                    className="form-checkbox text-[#001571] border-gray-300 rounded"
                    checked={isSelected}
                    onChange={(e) => onSelect(e.target.checked)}
                />
            </div>
            <div className="flex flex-row space-x-3 w-[24.25%] items-center pl-4">
                {/* Recruiter Logo */}
                <div className="">
                    <Image
                        src={logo || "/images/default-image.jpg"}
                        alt="Recruiter Logo"
                        width={40}
                        height={40}
                        className="rounded-full shadow-lg"
                    />
                </div>
                {/* Recruiter Name */}
                <div className="items-center">{recruiterName}</div>
            </div>
            {/* Email */}
            <div className="px-4 py-3 font-semibold w-[24.25%] flex items-center">{email}</div>
            {/* Website */}
            <div className="px-4 py-3 font-semibold w-[24.25%] flex items-center">{contactNumber}</div>
            {/* Actions */}
            <div className="py-3 flex gap-2 ml-auto justify-end w-[24.25%] items-center">
                <button
                    className="flex items-center justify-center w-1/2 bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800"
                    onClick={() => setShowRecruiter(true)}
                >
                    <span className="mr-2">
                        <RiEdit2Fill size={20} />
                    </span>
                    <span>Edit</span>
                </button>
                <button
                    className="flex items-center justify-center w-1/2 bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
                    type="button"
                    onClick={handleDelete}
                >
                    <span className="mr-2">
                        <RiDeleteBinFill size={20} />
                    </span>
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
            {/* Edit Profile Form Popup */}
            {showRecruiter && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
                        <RecruiterProfile onClose={() => setShowRecruiter(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}
