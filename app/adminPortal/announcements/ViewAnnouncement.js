"use client";
import { useEffect, useState } from "react";

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
    <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-[90vh] w-3/4 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold">View Announcement</h2>

        <button
          onClick={onClose}
          className="px-2 py-1 h-12 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          Close ✕
        </button>
      </div>

      <form onSubmit={submitHandler}>
        <div>
          <p
            htmlFor="announcementTitle"
            className="text-base font-bold text-black mb-1"
          >
            Announcement Title
          </p>
          <input
            type="text"
            name="announcementTitle"
            required
            value={announcementDetails.announcementTitle || ""}
            onChange={handleInputChange}
            className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div>
          <p
            htmlFor="announcementDescription"
            className="text-base font-bold text-black mb-1"
          >
            Job Description
          </p>
          <textarea
            type="text"
            name="announcementDescription"
            required
            value={announcementDetails.announcementDescription || ""}
            onChange={handleInputChange}
            className="px-2 py-1 h-56 w-full border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div>
          <button className="w-full px-4 py-2 mt-5 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors">
            {isSubmitting ? "Updating..." : "Update Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
}
export default ViewAnnouncement;
