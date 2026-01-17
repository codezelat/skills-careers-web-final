"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RiEdit2Fill, RiDeleteBin6Line } from "react-icons/ri";
import { BsFillEyeFill } from "react-icons/bs";
import { useSession } from "next-auth/react";

export default function PortalCandidateCard({
  jobseeker,
  onUpdate,
  isSelected,
  onSelect,
  onDelete,
}) {
  const router = useRouter();
  const { _id, userId, email, contactNumber, isRestricted } = jobseeker;
  const [userDetails, setUserDetails] = useState({});
  const [localRestricted, setLocalRestricted] = useState(isRestricted);
  const [isRestricting, setIsRestricting] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setLocalRestricted(isRestricted);
  }, [isRestricted]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Ensure userId is properly formatted
        const userIdString = userId?._id || userId?.toString() || userId;

        if (!userIdString) {
          console.warn("No valid userId provided");
          setUserDetails({});
          return;
        }

        const response = await fetch(`/api/users/get?id=${userIdString}`);
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
        body: JSON.stringify({ isRestricted: !localRestricted }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result || typeof result.isRestricted === "undefined") {
        throw new Error("Invalid API response structure");
      }

      setLocalRestricted(result.isRestricted);
      onUpdate(result);
    } catch (error) {
      //console.error("Error updating restriction status:", error);
      //console.error("Error updating restriction status:", error);
    } finally {
      setIsRestricting(false);
    }
  };

  return (
    <div className="py-3 sm:py-4 rounded-lg transition-shadow border-b border-gray-200">
      {/* Desktop Layout - Hidden on mobile */}
      <div className="hidden lg:flex items-center text-xs lg:text-sm font-semibold">
        <div className="flex items-center px-2 lg:px-4 py-3 w-[3%]">
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={() => onSelect && onSelect(_id)}
            className="form-checkbox text-[#001571] border-gray-300 rounded cursor-pointer"
          />
        </div>
        <div className="flex items-center pl-2 lg:pl-4 w-[24.25%]">
          <Image
            src={userDetails.profileImage || "/images/default-image.jpg"}
            alt="Candidate"
            width={40}
            height={40}
            className="rounded-full shadow-lg flex-shrink-0"
          />
          <div className="ml-3 flex flex-col">
            <span className="truncate">
              {userDetails.firstName || "Unknown"}{" "}
              {userDetails.lastName || "User"}
            </span>
            {localRestricted && (
              <span className="text-xs text-red-500 font-semibold italic mt-1">
                ⚠ Restricted
              </span>
            )}
          </div>
        </div>
        <div className="px-2 lg:px-4 py-3 w-[24.25%] truncate">{email}</div>
        <div className="px-2 lg:px-4 py-3 w-[24.25%]">
          {contactNumber || "N/A"}
        </div>
        {session?.user?.role === "recruiter" && (
          <div className="py-3 flex gap-2 ml-auto justify-start w-[24.25%] items-center">
            <button
              className="flex items-center justify-center bg-[#001571] text-white px-3 lg:px-4 py-2 rounded-lg shadow hover:bg-blue-800 text-xs whitespace-nowrap"
              onClick={() => router.push(`/Portal/candidates/${_id}`)}
            >
              View Profile
            </button>
          </div>
        )}
        {session?.user?.role === "admin" && (
          <div className="py-3 flex gap-1 lg:gap-2 ml-auto justify-end w-[24.25%] items-center text-xs">
            <button
              className="flex items-center justify-center bg-[#001571] text-white px-2 lg:px-3 py-2 rounded-lg shadow hover:bg-blue-800 whitespace-nowrap"
              onClick={() => router.push(`/Portal/candidates/${_id}`)}
            >
              <RiEdit2Fill size={14} className="lg:mr-1" />
              <span className="hidden lg:inline">Edit</span>
            </button>

            <button
              className={`flex items-center justify-center text-white px-2 lg:px-3 py-2 rounded-lg shadow whitespace-nowrap ${
                localRestricted
                  ? "bg-[#EC221F] hover:bg-red-700"
                  : "bg-[#001571] hover:bg-blue-700"
              }`}
              onClick={handleRestrictToggle}
              disabled={isRestricting}
            >
              {isRestricting ? (
                "..."
              ) : localRestricted ? (
                <>
                  <BsFillEyeFill size={14} className="lg:mr-1" />
                  <span className="hidden lg:inline">Unrestrict</span>
                </>
              ) : (
                <>
                  <BsFillEyeFill size={14} className="lg:mr-1" />
                  <span className="hidden lg:inline">Restrict</span>
                </>
              )}
            </button>

            <button
              className="flex items-center justify-center bg-[#EC221F] text-white px-2 lg:px-3 py-2 rounded-lg shadow hover:bg-red-700 whitespace-nowrap"
              onClick={() => onDelete && onDelete(_id)}
            >
              <RiDeleteBin6Line size={14} className="lg:mr-1" />
              <span className="hidden lg:inline">Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Layout - Card Style */}
      <div className="lg:hidden bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-start gap-3 mb-3">
          {session?.user?.role === "admin" && (
            <input
              type="checkbox"
              checked={isSelected || false}
              onChange={() => onSelect && onSelect(_id)}
              className="form-checkbox text-[#001571] border-gray-300 rounded cursor-pointer mt-1 flex-shrink-0"
            />
          )}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Image
              src={userDetails.profileImage || "/images/default-image.jpg"}
              alt="Candidate"
              width={50}
              height={50}
              className="rounded-full shadow-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#001571] text-sm truncate">
                {userDetails.firstName || "Unknown"}{" "}
                {userDetails.lastName || "User"}
              </h3>
              <p className="text-xs text-gray-600 truncate">{email}</p>
              <p className="text-xs text-gray-500">{contactNumber || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Actions for Mobile */}
        {session?.user?.role === "recruiter" && (
          <div className="flex gap-2 mt-3">
            <button
              className="flex-1 bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 text-xs font-semibold"
              onClick={() => router.push(`/Portal/candidates/${_id}`)}
            >
              View Profile
            </button>
          </div>
        )}
        {session?.user?.role === "admin" && (
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              className="flex items-center justify-center bg-[#001571] text-white px-3 py-2 rounded-lg shadow hover:bg-blue-800 text-xs font-semibold flex-1 min-w-[80px]"
              onClick={() => router.push(`/Portal/candidates/${_id}`)}
            >
              <RiEdit2Fill size={14} className="mr-1" />
              Edit
            </button>

            <button
              className={`flex items-center justify-center text-white px-3 py-2 rounded-lg shadow text-xs font-semibold flex-1 min-w-[100px] ${
                localRestricted
                  ? "bg-[#EC221F] hover:bg-red-700"
                  : "bg-[#001571] hover:bg-blue-700"
              }`}
              onClick={handleRestrictToggle}
              disabled={isRestricting}
            >
              {isRestricting ? (
                "..."
              ) : localRestricted ? (
                <>
                  <BsFillEyeFill size={14} className="mr-1" />
                  Unrestrict
                </>
              ) : (
                <>
                  <BsFillEyeFill size={14} className="mr-1" />
                  Restrict
                </>
              )}
            </button>

            <button
              className="flex items-center justify-center bg-[#EC221F] text-white px-3 py-2 rounded-lg shadow hover:bg-red-700 text-xs font-semibold flex-1 min-w-[80px]"
              onClick={() => onDelete && onDelete(_id)}
            >
              <RiDeleteBin6Line size={14} className="mr-1" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
