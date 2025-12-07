"use client";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import SolveInquiryForm from "./solveInquiryForm";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

export default function UpdateInquiryForm({ inquiry, onClose, onUpdate }) {
  const { data: session, status } = useSession();

  const [showSolveInquire, setShowSolveInquire] = useState(false);
  const [error, setError] = useState();
  const [inquiryDetails, setInquiryDetails] = useState({
    _id: "",
    userName: "",
    userRole: "",
    inquiryTitle: "",
    inquiryDescription: "",
    createdAt: new Date(),
    status: "",
    reply: "",
  });
  useEffect(() => {
    if (session?.user?.id) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/user?id=${session.user.id}`);
          if (!response.ok) throw new Error("Failed to fetch user data.");
          const userData = await response.json();
          setUserName(`${userData.firstName}${userData.lastName}`);
        } catch (error) {
          setError(error.message);
        }
      };
      fetchUserData();
    }
  }, [session]);

  useEffect(() => {
    if (inquiry) {
      setInquiryDetails(inquiry);
    }
  }, [inquiry]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-8">
          <h4 className="text-2xl font-semibold text-[#001571]">View Inquiry</h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="border-t-2 border-gray-200" />

        {/* Scrollable Form Section */}
        <div className="overflow-y-auto flex-grow p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#001571] mb-5">
                Profile Name
              </label>
              <input
                type="text"
                name="userName"
                value={inquiryDetails.userName}
                readOnly
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571] mb-5">
                Inquiry Title
              </label>
              <input
                type="text"
                name="inquiryTitle"
                value={inquiryDetails.inquiryTitle}
                readOnly
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571] mb-5">
                Inquiry Description
              </label>
              <textarea
                name="inquiryDescription"
                rows={8}
                value={inquiryDetails.inquiryDescription}
                readOnly
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 bg-gray-100"
              />
            </div>

            <div className="border-t-2 border-gray-200 mt-4 mb-16" />

            {/* Footer Buttons */}
            <div className="flex justify-end">
              {session?.user?.role === "admin" && (
                <button
                  type="button"
                  onClick={() => setShowSolveInquire(true)}
                  className="bg-[#001571] text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                >
                  Solve Inquiry
                </button>
              )}
              {session?.user?.role === "jobseeker" && (
                <div className="w-full">
                  <div>
                    <label className="text-sm font-semibold text-[#001571] mb-5">
                      Reply
                    </label>
                    <textarea
                      name="reply"
                      rows={6}
                      value={inquiryDetails.reply}
                      readOnly
                      className="mt-1 w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 bg-gray-100"
                    />
                  </div>

                  <div className="border-t-2 border-gray-200 mb-4 mt-4" />

                  <button
                    type="button"
                    className="bg-[#001571] text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                  >
                    Done
                  </button>
                </div>
              )}
              {session?.user?.role === "recruiter" && (
                <div className="w-full">
                  <div className="w-full">
                    <label className="text-sm font-semibold text-[#001571] mb-5">
                      Reply
                    </label>
                    <textarea
                      name="reply"
                      rows={6}
                      value={inquiryDetails.reply}
                      readOnly
                      className="mt-1 w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 bg-gray-100"
                    />
                  </div>

                  <div className="border-t-2 border-gray-200 mb-4 mt-4" />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Solve Inquiry Form Popup */}
      {showSolveInquire && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
            <SolveInquiryForm
              inquiry={inquiryDetails}
              onClose={() => setShowSolveInquire(false)}
              onSuccess={(updatedInquiry) => {
                if (onUpdate) onUpdate(updatedInquiry);
                setShowSolveInquire(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
