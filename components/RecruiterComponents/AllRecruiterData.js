import RecruiterProfile from "@/app/admindashboard/recruiters/RecruiterProfile";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function AllRecruiterData({ recruiter, isSelected, onSelect }) {
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
    <div className="p-4 rounded-lg transition-shadow border-b border-gray-200 flex items-center">
      <div className="flex flex-row space-x-4 w-1/3 items-center">
        {/* Checkbox */}
        <div className=" flex justify-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-[#001571] border-gray-300 rounded"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
          />
        </div>
        {/* Recruiter Logo */}
        <div className="">
          <Image
            src={logo || "/images/default-image.jpg"}
            alt="Recruiter Logo"
            width={50}
            height={50}
            className="rounded-full shadow-lg"
          />
        </div>
        {/* Recruiter Name */}
        <div className="font-medium items-center">{recruiterName}</div>
      </div>
      {/* Email */}
      <div className="w-1/4 font-medium items-center">{email}</div>
      {/* Website */}
      <div className="w-1/6 font-medium items-end">{contactNumber}</div>
      {/* Actions */}
      <div className="w-1/3 flex justify-end gap-2">
        <button
          className="bg-[#001571] text-white px-5 py-2 rounded-lg text-sm flex items-center space-x-2"
          onClick={() => setShowRecruiter(true)}
        >
          <Image
            src="/images/miyuri_img/edit.png"
            alt="Edit"
            width={20}
            height={20}
          />
          <span>Edit Account</span>
        </button>
        <button
          className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm flex items-center space-x-2"
          type="button"
          onClick={handleDelete}
        >
          <Image
            src="/images/miyuri_img/eye-slash.png"
            alt="Restrict"
            width={20}
            height={20}
            className="mr-2"
          />
          <span>Restrict</span>
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
