"use client";

import { useState } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { PiCheckCircle } from "react-icons/pi";
import Swal from "sweetalert2";

function UpdatePressrelease({ pressreleaseDetails, onClose, onSubmit }) {
  const [updatedDetails, setUpdatedDetails] = useState(pressreleaseDetails);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call your API or function to update the press release here
      await onSubmit(updatedDetails, selectedImage);

      // Show success SweetAlert
      Swal.fire({
        title: "Success!",
        text: "Press release updated successfully!",
        icon: "success",
        timer: 2000, // 2 seconds
        showConfirmButton: false, // Hide the OK button
        willClose: () => {
          onClose();
        },
      });
    } catch (error) {
      console.log(error.message);

      // Show error SweetAlert
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong!",
        icon: "error",
        timer: 2000, // 2 seconds
        showConfirmButton: false, // Hide the OK button
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh] p-5 overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Edit Press Release
          </h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={updatedDetails.title || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Description
            </label>
            <textarea
              name="description"
              value={updatedDetails.description || ""}
              onChange={handleInputChange}
              rows="6"
              className="mt-1 block w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div className="mb-4 mt-4">
            <label className="block text-sm font-semibold text-blue-900">
              Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-3 text-center">
                {/* File upload UI */}
                <div className="flex justify-center items-center">
                  <Image
                    src={pressreleaseDetails.image}
                    alt="Current"
                    width={40}
                    height={40}
                    className=""
                  />
                </div>
                <div className="text-sm text-blue-900">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer rounded-md font-semibold text-[#8A93BE]"
                  >
                    <span>
                      Click or drag file to this area to upload your Image
                    </span>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      className="sr-only"
                      accept="image/jpeg, image/png, image/jpg"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-[#8A93BE]">
                  Please make sure to upload a JPEG, PNG & JPG
                </p>
              </div>
            </div>
            {selectedImage && (
              <div className="mt-4">
                <p className="text-sm text-blue-900">Selected File:</p>
                <p className="text-sm text-gray-600">{selectedImage.name}</p>
              </div>
            )}
          </div>
          .
          <div className="border-t-2 border-gray-200 mb-4" />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#001571] text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            >
              <div className="flex items-center space-x-5">
                {isSubmitting ? "Updating..." : "Update Press Release"}
                <PiCheckCircle size={20} />
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePressrelease;
