"use client";
import { useEffect, useState } from "react";
import { PiCheckCircle } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";

function ViewAnnouncement({ announcement, onClose }) {
  const [announcementDetails, setAnnouncementDetails] = useState({
    _id: "",
    announcementTitle: "",
    announcementDescription: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAnnouncementDetails(announcement);
  }, [announcement]);

  // Handling input change
  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAnnouncementDetails((prev) => ({ ...prev, [name]: value }));
  };

  // form submitting to update.
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/announcement/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(announcementDetails),
      });
      if (response.ok) {
        alert("Details updated successfully!");
      } else {
        alert("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating announcement details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto rounded-xl shadow-md p-8 scrollbar-hide">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Edit Annoucement
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
            <label htmlFor="announcementTitle" className="block text-sm font-semibold text-[#001571]">
              Annoucement Title
            </label>
            <input
               type="text"
               name="announcementTitle"
               required
               value={announcementDetails.announcementTitle || ""}
               onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="announcementDescription" className="block text-sm font-semibold text-[#001571]">
            Annoucement Description
            </label>
            <textarea
               type="text"
               name="announcementDescription"
               required
               value={announcementDetails.announcementDescription || ""}
               onChange={handleInputChange}
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
              {isSubmitting ? "Updating..." : "Update"}
                <PiCheckCircle width={20} height={10} className="ml-2"/>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ViewAnnouncement;
