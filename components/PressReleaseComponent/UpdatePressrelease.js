"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";


function UpdatePressrelease({ pressrelease, onClose }) {
  const [pressreleaseDetails, setPressreleaseDetails] = useState({
    _id: "",
    title: "",
    description: "",
    image: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPressreleaseDetails(pressrelease);
  }, [pressrelease]);

  // Handling input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPressreleaseDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setSelectedImage(file);
  };

  // form submitting to update
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let formData = new FormData();
      
      // Add basic details
      formData.append("_id", pressreleaseDetails._id);
      formData.append("title", pressreleaseDetails.title);
      formData.append("description", pressreleaseDetails.description);
      formData.append("currentImageUrl", pressreleaseDetails.image || "");
      
      // Only append new image if selected
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch(`/api/pressrelease/update`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Details updated successfully!");
        onClose();
        window.location.reload();
      } else {
        alert(data.message || "Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating pressrelease details:", error);
      alert("Error updating details: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-md p-8 scrollbar-hide">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Edit a Press Release
          </h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="border-t-2 border-gray-200 mb-4" />


      <form className="space-y-6" onSubmit={submitHandler}>
        <div>
        <label className="block text-sm font-semibold text-[#001571]">
              Title
            </label>
          <input
            type="text"
            name="title"
            required
            value={pressreleaseDetails.title || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
        </div>

        <div>
        <label className="block text-sm font-semibold text-[#001571]">
               Description
            </label>
          <textarea
            name="description"
            required
            rows={20}
            value={pressreleaseDetails.description || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
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
                      onChange={handleFileChange}
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
      
      
                <div className="border-t-2 border-gray-200 mb-4" />
      
                <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#001571] text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            >
              <div className="flex items-center space-x-5">
              {isSubmitting ? "Updating..." : "Update Press Release"}
              <Image
                  src="/images/miyuri_img/whitetick.png"
                  alt="tick"
                  width={20}
                  height={10}
                  className="ml-3"

                />
              </div>
            </button>
          </div>
      </form>
    </div>
    </div>
  );
}

export default UpdatePressrelease;