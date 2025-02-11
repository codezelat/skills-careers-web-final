"use client"

import { formatDate } from "@/handlers";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import SolveInquireForm from "./solveInquiryForm";


function UpdateInquiryForm({ inquiry, onClose }) {
  const [showSolveInquire, setShowSolveInquire] = useState(false);

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setInquiryDetails(inquiry);
  }, [inquiry]);

  // Handling input change
  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setInquiryDetails((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/inquiry/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryDetails),
      });
      if (response.ok) {
        alert("Replied successfully!");
      } else {
        alert("Failed to Reply.");
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onClose(); // Close the form on submit
  };

  const date = formatDate(inquiryDetails.createdAt);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl min-h-[90vh] overflow-y-auto rounded-xl shadow-md p-8 scrollbar-hide flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold text-[#001571]">
            View Inquire
          </h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="border-t-2 border-gray-200 mb-4" />

        <form className="space-y-6 flex-grow" onSubmit={submitHandler}>

      <div>
            <label className="block text-sm font-semibold text-[#001571] mb-5">
              Profile Name
            </label>
            <input
              type="text"
              name="title"
              value={inquiryDetails.userName}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571] mb-5">
              Inquire Title
            </label>
            <input
              type="text"
              name="title"
              value={inquiryDetails.inquiryTitle}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#001571] mb-5">
              Inquire Description
            </label>
            <textarea
              type="text"
              name="title"
              rows={8}
              value={inquiryDetails.inquiryDescription}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          </form>
                  {/* Footer Section */}
        <div className="border-t-2 border-gray-200 mb-4 mt-4" />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowSolveInquire(true)}

            className="bg-[#001571] text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
          >
            <div className="flex items-center space-x-3">
              <p>Solve Inquire</p>
              <Image
                src="/images/arrowforward.png"
                alt="tick"
                width={20}
                height={10}
              />
            </div>
          </button>
        </div>
      </div>

            {/* Solve Inquire Popup */}
            {showSolveInquire && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
            <SolveInquireForm onClose={() => setShowSolveInquire(false)} />
          </div>
        </div>
      )}


    </div>
  );
}
export default UpdateInquiryForm;
