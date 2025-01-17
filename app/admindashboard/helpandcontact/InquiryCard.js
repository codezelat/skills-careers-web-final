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
    <div className="grid grid-cols-12 items-center gap-2 p-4 my-1 bg-white shadow-lg rounded-lg hover:cursor-pointer hover:shadow-2xl transition-all">
      <div className="col-span-1">
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
      </div>
      <div className="col-span-3">
        <p className="text-sm">{inquiry.userName}</p>
      </div>
      <div className="col-span-2">
        <p className="text-sm">{inquiry.userRole}</p>
      </div>
      <div className="col-span-2">
        <p className="text-sm">{date}</p>
      </div>
      <div className="col-span-2">
        <p className="text-sm">{time}</p>
      </div>
      <div className="col-span-1">
        <p className="text-sm">{inquiry.status}</p>
      </div>
      <div className="flex col-span-1 justify-end">
        <button
          onClick={handleViewInquiry}
          className="px-4 py-1 border-2 w-fit bg-blue-500 border-blue-500 text-white hover:border-black hover:bg-black rounded transition-colors"
        >
          View
        </button>
      </div>
    </div>
  );
}

export default InquiryCard;
