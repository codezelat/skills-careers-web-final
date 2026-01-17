"use client";
import React, { useState } from "react";
import { RiDeleteBinFill, RiEdit2Fill } from "react-icons/ri";
import { PiCheckCircle } from "react-icons/pi";
import { FiLoader } from "react-icons/fi";
import Swal from "sweetalert2";

export default function CertificationCardEdit({
  certification,
  onDelete,
  onUpdate,
}) {
  const [isHoveredDelete, setIsHoveredDelete] = useState(false);
  const [isHoveredEdit, setIsHoveredEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    certificateName: certification.certificateName || "",
    organizationName: certification.organizationName || "",
    receivedDate: certification.receivedDate
      ? new Date(certification.receivedDate).toISOString().split("T")[0]
      : "",
  });

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this certification?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `/api/jobseekerdetails/certification/delete?id=${certification._id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete certification");
      }

      if (onDelete) {
        onDelete(certification._id);
      } else {
        window.location.reload();
      }

      Swal.fire("Deleted!", "Certification has been deleted.", "success");
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire(
        "Error!",
        error.message || "Failed to delete certification",
        "error",
      );
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/jobseekerdetails/certification/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, _id: certification._id }),
        },
      );

      if (!response.ok) throw new Error("Failed to update certification");

      if (onUpdate) {
        onUpdate({ ...certification, ...formData });
      } else {
        window.location.reload(); // Fallback
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update certification",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date(certification.receivedDate);
  let month = monthName[d.getMonth()];
  const year = new Date(certification.receivedDate).getFullYear();
  const postedDate = `${month} ${year}`;

  if (isEditing) {
    return (
      <form onSubmit={handleUpdate} className="py-4 border-b-2 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#001571]">
            Certificate Name
          </label>
          <input
            type="text"
            name="certificateName"
            value={formData.certificateName}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#001571]">
            Organization Name
          </label>
          <input
            type="text"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#001571]">
            Received Date
          </label>
          <input
            type="date"
            name="receivedDate"
            value={formData.receivedDate}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-3 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#001571] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-800"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                Save <PiCheckCircle />
              </>
            )}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-row gap-2 py-4 border-b-2 justify-between">
      <div className="flex flex-col justify-between text-base font-bold">
        <h1>{certification.certificateName}</h1>
        <h1>{postedDate}</h1>
        <div className="text-base font-medium mt-2">
          {certification.organizationName}
        </div>
      </div>
      <div className="flex flex-row items-center mr-6 gap-2">
        <button
          onClick={() => setIsEditing(true)}
          onMouseEnter={() => setIsHoveredEdit(true)}
          onMouseLeave={() => setIsHoveredEdit(false)}
          className="flex items-center justify-center bg-[#E8E8E8] text-white p-3 rounded-full shadow hover:bg-blue-600 transition-colors"
          aria-label="Edit certification"
        >
          <RiEdit2Fill
            size={20}
            color={isHoveredEdit ? "#ffffff" : "#001571"}
          />
        </button>
        <button
          onClick={handleDelete}
          onMouseEnter={() => setIsHoveredDelete(true)}
          onMouseLeave={() => setIsHoveredDelete(false)}
          className="flex items-center justify-center bg-[#E8E8E8] text-white p-3 rounded-full shadow hover:bg-red-600 transition-colors"
          aria-label="Delete certification"
        >
          <RiDeleteBinFill
            size={20}
            color={isHoveredDelete ? "#ffffff" : "#001571"}
          />
        </button>
      </div>
    </div>
  );
}
