"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaCircleChevronRight } from "react-icons/fa6";
import UpdateInquiryForm from "./updateInquiryForm";
import { useSession } from "next-auth/react";

export default function InquiryCard({ inquiry }) {
  const { data: session, status: sessionStatus } = useSession();
  const [status, setStatus] = useState(inquiry.status || "Pending");
  const [isUpdating, setIsUpdating] = useState(false);
  const [userDetails, setUserDetails] = useState({ profileImage: "" });
  const [error, setError] = useState();
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status || "Pending");
    }
  }, [inquiry]);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchData = async () => {
        try {
          const userResponse = await fetch(
            `/api/users/get?id=${inquiry.userId}`
          );
          // if (!userResponse.ok) throw new Error("Failed to fetch user data");
          const userData = await userResponse.json();

          setUserDetails(userData.user);
        } catch (err) {
          setError(err.message);
          console.error("Fetch error:", err);
        } finally {
        }
      };
      fetchData();
    }
  }, [session, inquiry.userId]);

  const handleViewInquiry = () => {
    setShowInquiry(true);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/inquiry/update?id=${inquiry._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inquiry, status: newStatus }),
      });

      if (response.ok) {
        // Optional: Show success toast
      } else {
        // Revert on failure or show error
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="py-2 rounded-lg transition-shadow border-b border-gray-200 flex items-center text-sm font-semibold">
        <div className="flex flex-row space-x-3 w-[20%] items-center">
          <Image
            src={userDetails?.profileImage || "/images/default-image.jpg"}
            alt="Profile Image"
            width={45}
            height={45}
            className="rounded-full shadow-lg"
          />
          <div>{inquiry.userName}</div>
        </div>
        <div className="py-1 font-semibold w-[15%] flex items-center">
          {inquiry.userRole}
        </div>
        <div className="py-1 font-semibold w-[15%] flex items-center">
          {new Date(inquiry.createdAt).toLocaleDateString()}
        </div>
        <div className="py-1 font-semibold w-[15%] flex items-center">
          {new Date(inquiry.createdAt).toLocaleTimeString()}
        </div>
        <div className="py-1 font-semibold w-[15%] flex items-center">
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              status === "Solved"
                ? "bg-green-100 text-green-700"
                : status === "Declined"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {status}
          </span>
        </div>
        <div className="py-1 flex gap-2 ml-auto justify-end w-[20%] items-center">
          <button
            className="flex items-center justify-center bg-[#001571] text-white px-3 py-2 rounded-lg shadow hover:bg-blue-800 text-xs"
            onClick={handleViewInquiry}
          >
            <span>View</span>
            <FaCircleChevronRight size={12} className="ml-1" />
          </button>
          {session?.user?.role === "admin" && (
            <select
              value={status}
              onChange={handleStatusChange}
              disabled={isUpdating}
              className="bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            >
              <option value="Pending">Pending</option>
              <option value="Solved">Solved</option>
              <option value="Declined">Declined</option>
            </select>
          )}
        </div>
      </div>

      {showInquiry && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
            <UpdateInquiryForm
              inquiry={{ ...inquiry, status }} // Pass updated status
              onClose={() => setShowInquiry(false)}
              onUpdate={(updatedInquiry) => {
                setStatus(updatedInquiry.status);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
