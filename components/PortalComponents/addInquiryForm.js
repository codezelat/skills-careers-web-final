"use client";
import { useState, useEffect } from "react";
import { PiCheckCircle } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

function AddInquiry({ onClose, onInquiryAdded }) {
  const { data: session } = useSession(); // Get session data
  const [inquiryTitle, setInquiryTitle] = useState("");
  const [inquiryDescription, setInquiryDescription] = useState("");
  // const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userName = session?.user?.firstName
    ? `${session.user.firstName} ${session.user.lastName}`
    : "";

  // Fetch job seeker details
  useEffect(() => {
    const fetchJobseekers = async () => {
      try {
        const response = await fetch("/api/jobseekerdetails/all");
        const data = await response.json();

        // Find the current user's details from the fetched job seekers
        const currentUserDetails = data.jobseekers.find(
          (jobseeker) => jobseeker.userId === session?.user?.id
        );

        // if (currentUserDetails) {
        //   setUserName(currentUserDetails.userName); // Set userName from fetched data
        // }
      } catch (error) {
        console.error("Error fetching Job Seekers:", error);
      }
    };

    if (session?.user?.id) {
      fetchJobseekers();
    }
  }, [session]);

  const clearForm = () => {
    setInquiryTitle("");
    setInquiryDescription("");
  };

  // Function to create an inquiry
  const createInquiry = async (inquiryTitle, inquiryDescription, userName, userRole) => {
    const response = await fetch("/api/inquiry/add", {
      method: "POST",
      body: JSON.stringify({
        userId: session.user.id,
        userName: userName,
        userRole: userRole,
        inquiryTitle,
        inquiryDescription,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }

    return data;
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Get userRole from session
      const userRole = session?.user?.role;

      // Call createInquiry with all required fields
      const result = await createInquiry(
        inquiryTitle,
        inquiryDescription,
        userName,
        userRole
      );

      // Success SweetAlert popup with 2-second timer
      Swal.fire({
        icon: "success",
        title: "Inquiry created successfully!",
        showConfirmButton: false,
        timer: 2000, // 2-second timer
      }).then(() => {
        clearForm(); // Clear the form
        if (onInquiryAdded) onInquiryAdded(); // Trigger refresh
        onClose(); // Close the form
      });
    } catch (error) {
      // Error SweetAlert popup with 2-second timer
      Swal.fire({
        icon: "error",
        title: "Failed to create Inquiry.",
        text: error.message || "Something went wrong!",
        showConfirmButton: false,
        timer: 2000, // 2-second timer
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto rounded-xl shadow-md p-8 scrollbar-hide">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Create Inquiry
          </h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <IoCloseSharp size={24} />
          </button>
        </div>
        <div className="border-2 border-gray-200 mb-4" />

        <form className="space-y-6" onSubmit={submitHandler}>
          {/* User Name (Read-only) */}
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-semibold text-[#001571]"
            >
              User Name
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              readOnly // Make the field read-only
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 bg-gray-100"
            />
          </div>

          {/* User Role (Read-only) */}
          <div>
            <label
              htmlFor="userRole"
              className="block text-sm font-semibold text-[#001571]"
            >
              User Role
            </label>
            <input
              type="text"
              id="userRole"
              value={session?.user?.role || ""}
              readOnly // Make the field read-only
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Inquiry Title (Editable) */}
          <div>
            <label
              htmlFor="inquiryTitle"
              className="block text-sm font-semibold text-[#001571]"
            >
              Inquiry Title
            </label>
            <input
              type="text"
              id="inquiryTitle"
              required
              value={inquiryTitle}
              onChange={(e) => setInquiryTitle(e.target.value)}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>

          {/* Inquiry Description (Editable) */}
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Inquiry Description
            </label>
            <textarea
              type="text"
              id="inquiryDescription"
              required
              value={inquiryDescription}
              onChange={(e) => setInquiryDescription(e.target.value)}
              rows="5"
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#001571] text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            >
              <div className="flex items-center space-x-3">
                {isSubmitting ? "Creating..." : "Save"}
                <PiCheckCircle width={20} height={10} className="ml-2" />
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddInquiry;