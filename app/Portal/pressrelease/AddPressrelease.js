"use client";
import Image from "next/image";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

async function createPressrelease(formData) {
  const response = await fetch("/api/pressrelease/add", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
}

function AddPressrelease({ onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setSelectedImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  async function submitHandler(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const result = await createPressrelease(formData);
      console.log(result);

      Swal.fire({
        title: "Success!",
        text: result.message || "Press release created successfully!",
        icon: "success",
        timer: 1500, // Reduced timer
        showConfirmButton: false,
      }).then(() => {
        clearForm();
        if (onSuccess) {
          onSuccess();
        } else {
          onClose(); // Fallback if no onSuccess provided
        }
      });

    } catch (error) {
      console.log(error.message);
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong!",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-md p-6 sm:p-8 scrollbar-hide">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Create a Press Release
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
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Description
            </label>
            <textarea
              id="description"
              required
              rows={20}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                    src="/images/image-placeholder.jpg"
                    alt="upload"
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
          <div className="border-t-2 border-gray-200 mb-4" />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#001571] text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              <div className="flex items-center space-x-3 ">
                {isSubmitting ? "Creating..." : "Create Press Release"}
                <Image
                  src="/images/image-placeholder.jpg"
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

export default AddPressrelease;
