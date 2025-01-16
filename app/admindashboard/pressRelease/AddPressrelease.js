"use client";
import { useEffect, useState } from "react";

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

function AddPressrelease({ onClose }) {
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
        <h2 className="text-xl font-bold">Add Press Release</h2>
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
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div>
          <p className="text-base font-bold text-black mb-1">Description</p>
          <textarea
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-2 py-1 h-56 w-full border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div>
          <p className="text-base font-bold text-black mb-1">Image</p>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mb-4"
          />
          {selectedImage && (
            <p className="text-sm text-gray-600 mb-4">
              Selected: {selectedImage.name}
            </p>
          )}
        </div>

        <div>
          <button className="w-full px-4 py-2 mt-5 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors">
            {isSubmitting ? "Creating..." : "Create Press Release"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPressrelease;