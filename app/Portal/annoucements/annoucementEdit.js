"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { PiCheckCircle } from "react-icons/pi";

export default function AnnoucementEdit({
  announcementDetails,
  onClose,
  onSubmit,
  onInputChange,
  isSubmitting
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto rounded-xl shadow-md p-8 scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Edit Annoucement
          </h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="announcementTitle"
                className="block text-sm font-semibold text-[#001571]"
              >
                Annoucement Title
              </label>
              <input
                type="text"
                name="announcementTitle"
                required
                value={announcementDetails?.announcementTitle || ""}
                onChange={onInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
              />
            </div>
            <div>
              <label
                htmlFor="announcementDescription"
                className="block text-sm font-semibold text-[#001571]"
              >
                Annoucement Description
              </label>
              <textarea
                name="announcementDescription"
                required
                value={announcementDetails?.announcementDescription || ""}
                onChange={onInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                rows="5"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Saving..." : "Update"}
            <span className="ml-2">
              <PiCheckCircle size={20} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}