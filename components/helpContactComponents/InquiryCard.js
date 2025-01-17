"use client";
import { useEffect, useState } from "react";
import { formatDate, formatTime } from "@/handlers";
import Image from "next/image";

function InquiryCard({ inquiry, onViewInquiry }) {
  const [jobseekerDetails, setJobseekerDetails] = useState({
    profileImage: "",
  });

  const [recruiterDetails, setRecruiterDetails] = useState({
    email: "",
    logo: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (inquiry.userRole === "jobseeker") {
          const response = await fetch(
            `/api/jobseeker/get?id=${inquiry.userId}`
          );
          if (response.ok) {
            const data = await response.json();
            setJobseekerDetails(data);
          } else {
            console.error("Failed to fetch jobseeker details");
          }
        } else if (inquiry.userRole === "recruiter") {
          const response = await fetch(
            `/api/recruiter/get?id=${inquiry.userId}`
          );
          if (response.ok) {
            const data = await response.json();
            setRecruiterDetails(data);
          } else {
            console.error("Failed to fetch recruiter details");
          }
        }
      } catch (error) {
        console.error("Error occurred while fetching details:", error);
      }
    };

    fetchDetails();
  }, [inquiry]);

  const handleViewInquiry = () => {
    onViewInquiry?.();
  };

  const date = formatDate(inquiry.createdAt);
  const time = formatTime(inquiry.createdAt);

  return (
<div className="p-4 rounded-lg transition-shadow border-b border-gray-200 flex items-center">
  <div className="w-1/3 flex items-center space-x-4">
    <Image
      src={
        inquiry.userRole === "jobseeker"
          ? jobseekerDetails.profileImage || "/images/default-image.jpg"
          : recruiterDetails.logo || "/images/default-image.jpg"
      }
      alt="user Image"
      width={50}
      height={50}
      className="rounded-full shadow-lg"
    />
    <div className="font-semibold">{inquiry.userName}</div>
  </div>
  <div className="w-1/4 text-center font-semibold">{inquiry.userRole}</div>
  <div className="w-1/4 text-center font-semibold">{date}</div>
  <div className="w-1/4 text-center font-semibold">{time}</div>
  <div className="w-1/4 text-center font-semibold">{inquiry.status}</div>
  <div className="w-1/3 flex justify-center gap-2">
    <button
      className="bg-[#001571] text-white px-5 py-2 rounded-lg text-sm flex items-center space-x-2"
      onClick={handleViewInquiry}
    >
      <Image
        src="/images/miyuri_img/edit.png"
        alt="Edit"
        width={20}
        height={20}
      />
      <span className="font-semibold">View</span>
    </button>
  </div>
</div>
  );
}

export default InquiryCard;
