"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

export default function SolveInquiryForm({ inquiry, onClose, onSuccess }) {
  const [inquiryDetails, setInquiryDetails] = useState(inquiry);
  const [error, setError] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInquiryDetails((prev) => ({ ...prev, [name]: value }));
  };

  // SolveInquiryForm.js
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/inquiry/update?id=${inquiryDetails._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inquiryDetails),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Inquiry updated successfully!",
          timer: 2000, // Auto-close after 2 seconds
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          if (onSuccess) onSuccess(inquiryDetails);
          onClose(); // Close the form after the alert
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to update inquiry.",
          timer: 2000, // Auto-close after 2 seconds
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        timer: 2000, // Auto-close after 2 seconds
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-md p-6 sm:p-8 scrollbar-hide flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Solve Inquiry
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
              Inquiry Title
            </label>
            <input
              type="text"
              name="inquiryTitle"
              value={inquiryDetails.inquiryTitle}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571] mb-5">
              Message
            </label>
            <textarea
              name="reply"
              rows={4}
              value={inquiryDetails.reply}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571] mb-5">
              Inquiry Status
            </label>
            <select
              name="status"
              value={inquiryDetails.status}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 bg-white"
            >
              <option value="Pending">Pending</option>
              <option value="Solved">Solved</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#001571] text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
