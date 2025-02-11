"use client";
import { useState } from "react";
import Image from "next/image";
import { FaCircleChevronRight } from "react-icons/fa6";
import UpdateInquiryForm from "./updateInquiryForm";

export default function InquiryCard({ inquiry }) {
  const [showInquiry, setShowInquiry] = useState(false);
  const [userDetails, setUserDetails] = useState({ profileImage: "" });

  const handleViewInquiry = () => {
    setShowInquiry(true);
  };

  return (
    <>
      <div className="py-2 rounded-lg transition-shadow border-b border-gray-200 flex items-center text-sm font-semibold">
        <div className="flex flex-row space-x-3 w-[25%] items-center">
          <Image
            src={userDetails?.profileImage || "/images/default-image.jpg"}
            alt="Profile Image"
            width={45}
            height={45}
            className="rounded-full shadow-lg"
          />
          <div>{inquiry.userName}</div>
        </div>
        <div className="py-1 font-semibold w-[20%] flex items-center">
          {inquiry.userRole}
        </div>
        <div className="py-1 font-semibold w-[20%] flex items-center">
          {new Date(inquiry.createdAt).toLocaleDateString()}
        </div>
        <div className="py-1 font-semibold w-[20%] flex items-center">
          {new Date(inquiry.createdAt).toLocaleTimeString()}
        </div>
        <div className="py-1 flex gap-2 ml-auto justify-end w-[15%] items-center">
          <button
            className="flex items-center justify-center w-full bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800"
            onClick={handleViewInquiry}
          >
            <span>View Now</span>
            <FaCircleChevronRight size={15} className="ml-2" />
          </button>
        </div>
      </div>

      {showInquiry && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
            <UpdateInquiryForm
              inquiry={inquiry}
              onClose={() => setShowInquiry(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}