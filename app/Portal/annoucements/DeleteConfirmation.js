"use client";
import { useState } from "react";

function DeleteConfirmation({ announcement, onClose }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/announcement/delete?id=${announcement._id}`,
        {
          method: "DELETE",
        }
      );
      onClose();

      if (!response.ok) {
        alert("Failed to delete Announcement");
      }
    } catch (error) {
      console.error("Error deleting Announcement:", error);
      alert("Error deleting Announcement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 p-8 bg-white rounded-xl shadow-xl text-center">
      <h3 className="text-base uppercase font-bold text-red-500 mb-4">
        Delete {announcement.announcementTitle} Announcement
      </h3>
      <p className="text-base text-red-500 font-semibold">
        Are you sure you want to delete permanently?
      </p>
      <p className="text-sm text-black text-center">
        You cannot restore back
      </p>
      <div className="flex gap-2 my-4 w-64 md:w-96 lg:w-96">
        <button
          onClick={onClose}
          className="w-1/2 lg:w-1/2 px-8 py-2 md:px-8 lg:px-8 text-sm uppercase font-medium bg-white text-red-500 border-2 border-solid border-red-500 rounded-md hover:bg-red-500 hover:text-white hover:shadow-lg transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="w-1/2 lg:w-1/2 px-8 py-2 md:px-8 lg:px-8 text-sm uppercase font-medium bg-red-500 text-white border-2 border-solid border-red-500 rounded-md hover:bg-white hover:text-red-500 hover:shadow-md transition-all"
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
export default DeleteConfirmation;
