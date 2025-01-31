"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RiDeleteBinFill, RiEdit2Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";

export default function PortalApplicationCard({ application, isSelected }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewCandidateProfile = () => {
    router.push(`/Portal/candidates/${application.id}`);
  };


  return (
    <div className="py-4 rounded-lg transition-shadow border-b border-gray-200 flex items-center text-sm font-semibold">
      <div className="flex items-center pl-4 w-[20%]">
        {application.candidateName}
      </div>

      <div className="px-4 py-3 w-[20%]">{application.jobTitle}</div>
      <div className="px-4 py-3 w-[20%]">{application.date}</div>
      <div className="px-4 py-3 w-[20%]">{application.email}</div>

      <div className="py-3 flex gap-2 ml-auto justify-end w-[20%] items-center">
        <button
          className="flex items-center justify-center bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800"
          onClick={handleViewCandidateProfile}
        >
          <RiEdit2Fill size={20} className="mr-2" />
          View Application
        </button>
      </div>
    </div>
  );
}