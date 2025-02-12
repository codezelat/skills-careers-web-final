"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RiEdit2Fill } from "react-icons/ri";
import { BsFillEyeFill } from "react-icons/bs";

export default function PortalCandidateCard({ jobseeker, onUpdate }) {
  const router = useRouter();
  const { _id, userId, email, contactNumber, isRestricted } = jobseeker;
  const [userDetails, setUserDetails] = useState({});
  const [localRestricted, setLocalRestricted] = useState(isRestricted);
  const [isRestricting, setIsRestricting] = useState(false);

  useEffect(() => {
    setLocalRestricted(isRestricted);
  }, [isRestricted]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/users/get?id=${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserDetails(data.user || {});
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserDetails({});
      }
    };
    
    if (userId) fetchUserDetails();
  }, [userId]);

  const handleRestrictToggle = async () => {
    setIsRestricting(true);
    try {
      const response = await fetch(`/api/jobseekerdetails/${_id}/restrict`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRestricted: !localRestricted })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result || typeof result.isRestricted === 'undefined') {
        throw new Error('Invalid API response structure');
      }

      setLocalRestricted(result.isRestricted);
      onUpdate(result);
      
    } catch (error) {
      //console.error("Error updating restriction status:", error);
     // alert(`Error updating candidate: ${error.message}`);
    } finally {
      setIsRestricting(false);
    }
  };

  return (
    <div className="py-4 rounded-lg transition-shadow border-b border-gray-200 flex items-center text-sm font-semibold">
      <div className="flex items-center px-4 py-3 w-[3%]">
        <input
          type="checkbox"
          className="form-checkbox text-[#001571] border-gray-300 rounded"
        />
      </div>
      <div className="flex items-center pl-4 w-[24.25%]">
        <Image
          src={userDetails.profileImage || "/images/default-image.jpg"}
          alt="Candidate"
          width={40}
          height={40}
          className="rounded-full shadow-lg"
        />
        <span className="ml-3">
          {userDetails.firstName || 'Unknown'} {userDetails.lastName || 'User'}
        </span>
      </div>
      <div className="px-4 py-3 w-[24.25%]">{email}</div>
      <div className="px-4 py-3 w-[24.25%]">{contactNumber || 'N/A'}</div>
      <div className="py-3 flex gap-2 ml-auto justify-end w-[24.25%] items-center">
        <button
          className="flex items-center justify-center w-1/2 bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800"
          onClick={() => router.push(`/Portal/candidates/${_id}`)}
        >
          <RiEdit2Fill size={20} className="mr-2" />
          Edit
        </button>
        <button
          className={`flex items-center justify-center w-1/2 text-white px-4 py-2 rounded-lg shadow ${
            localRestricted ? "bg-[#EC221F] hover:bg-red-700" : "bg-[#001571] hover:bg-blue-700"
          }`}
          onClick={handleRestrictToggle}
          disabled={isRestricting}
        >
          {isRestricting ? (
            "Processing..."
          ) : localRestricted ? (
            <>
              <BsFillEyeFill size={15} className="mr-2" />
              Unrestrict
            </>
          ) : (
            <>
              <BsFillEyeFill size={15} className="mr-2" />
              Restrict
            </>
          )}
        </button>
      </div>
    </div>
  );
}