"use client";
import { useState } from "react";
import { PiCheckCircle } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";
import Swal from "sweetalert2"; // Import SweetAlert

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

      // Display success popup with a 2-second timer
      Swal.fire({
        icon: "success",
        title: "Announcement added successfully!",
        showConfirmButton: false,
        timer: 2000, // 2-second timer
      }).then(() => {
        // Refresh the page after closing the form
        clearForm();
        onClose();
        window.location.reload(); // Refresh the page
      });

      console.log(result);
    } catch (error) {
      console.error(error.message);
      // Display error popup with a 2-second timer
      Swal.fire({
        icon: "error",
        title: "Failed to add announcement.",
        text: error.message,
        showConfirmButton: false,
        timer: 2000, // 2-second timer
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto rounded-xl shadow-md p-8 scrollbar-hide">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Create Announcement
          </h4>
          <button
            onClick={onClose} // Manual close functionality
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
              Announcement Title
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
            <label
              htmlFor="announcementDescription"
              className="block text-sm font-semibold text-[#001571]"
            >
              Announcement Description
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
              disabled={isSubmitting}
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
