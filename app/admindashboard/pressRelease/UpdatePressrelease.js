"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

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

  const handleImageChange = (e) => {
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
    <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-[90vh] w-3/4 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold">Update Press Release</h2>
        <button
          onClick={onClose}
          className="px-2 py-1 h-12 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          Close ✕
        </button>
      </div>

      <form onSubmit={submitHandler}>
        <div>
          <p className="text-base font-bold text-black mb-1">Title</p>
          <input
            type="text"
            name="title"
            required
            value={pressreleaseDetails.title || ""}
            onChange={handleInputChange}
            className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div>
          <p className="text-base font-bold text-black mb-1">Description</p>
          <textarea
            name="description"
            required
            value={pressreleaseDetails.description || ""}
            onChange={handleInputChange}
            className="px-2 py-1 h-56 w-full border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div>
          <p className="text-base font-bold text-black mb-1">Image</p>
          {pressreleaseDetails.image && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Current Image:</p>
              <Image
                src={pressreleaseDetails.image}
                alt="Current"
                width={100}
                height={100}
                className="w-64 h-auto rounded"
              />
            </div>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mb-4"
          />
          {selectedImage && (
            <p className="text-sm text-gray-600 mb-4">
              New image selected: {selectedImage.name}
            </p>
          )}
        </div>

        <div>
          <button className="w-full px-4 py-2 mt-5 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors">
            {isSubmitting ? "Updating..." : "Update Press Release"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdatePressrelease;