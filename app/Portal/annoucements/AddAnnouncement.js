"use client";
import { useEffect, useState } from "react";
import { PiCheckCircle } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";
import Swal from "sweetalert2";

async function createAnnouncement(announcementTitle, announcementDescription) {
  const response = await fetch("/api/announcement/add", {
    method: "POST",
    body: JSON.stringify({
      announcementTitle,
      announcementDescription,
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
}

function AddAnnouncement({ onClose }) {
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementDescription, setAnnouncementDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearForm = () => {
    setAnnouncementTitle("");
    setAnnouncementDescription("");
  };

  async function submitHandler(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createAnnouncement(
        announcementTitle,
        announcementDescription
      );

      // Success SweetAlert popup with 1-second timer
      Swal.fire({
        icon: "success",
        title: "Annoucement created successfully!",
        showConfirmButton: false,
        timer: 2000, // 1-second timer
      }).then(() => {
        // Close the form automatically after the popup
        clearForm();
        onClose();
      });

      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to create Annoucement.",
        showConfirmButton: false,
        timer: 2000, // 1-second timer
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-md p-6 sm:p-8 scrollbar-hide">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Create Annoucement
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
          <div>
            <label
              htmlFor="announcementTitle"
              className="block text-sm font-semibold text-[#001571]"
            >
              Annoucement Title
            </label>
            <input
              type="text"
              id="announcementTitle"
              required
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Annoucement Description
            </label>
            <textarea
              type="text"
              id="announcementDescription"
              required
              value={announcementDescription}
              onChange={(e) => setAnnouncementDescription(e.target.value)}
              rows="5"
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
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

export default AddAnnouncement;
