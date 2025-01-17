"use client";
import { useEffect, useState } from "react";

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
      console.log(result);
      alert(result.message);

      clearForm();
      onClose();

      window.location.reload();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-[90vh] w-1/2 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold">Add Announcement</h2>
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
            id="announcementTitle"
            required
            value={announcementTitle}
            onChange={(e) => setAnnouncementTitle(e.target.value)}
            className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div>
          <p
            htmlFor="announcementDescription"
            className="text-base font-bold text-black mb-1"
          >
            Announcement Description
          </p>
          <textarea
            type="text"
            id="announcementDescription"
            required
            value={announcementDescription}
            onChange={(e) => setAnnouncementDescription(e.target.value)}
            className="px-2 py-1 h-56 w-full border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div>
          <button className="w-full px-4 py-2 mt-5 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors">
            {isSubmitting ? "Creating..." : "Create Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAnnouncement;
