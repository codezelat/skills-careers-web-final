"use client";
import React, { useState } from "react";
import { RiDeleteBinFill, RiEdit2Fill } from "react-icons/ri";
import { PiCheckCircle } from "react-icons/pi";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

export default function ExperienceCardEdit({ experience, onDelete }) {
    const [isHoveredDelete, setIsHoveredDelete] = useState(false);
    const [isHoveredEdit, setIsHoveredEdit] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        position: experience.position || "",
        companyName: experience.companyName || "",
        description: experience.description || "",
        country: experience.country || "",
        city: experience.city || "",
        startDate: experience.startDate || "",
        endDate: experience.endDate || "",
    });

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You want to delete this experience?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(
                `/api/jobseekerdetails/experience/delete?id=${experience._id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete experience");
            }

            if (onDelete) {
                onDelete(experience._id);
            } else {
                window.location.reload();
            }

            Swal.fire(
                'Deleted!',
                'Experience has been deleted.',
                'success'
            );
        } catch (error) {
            console.error("Delete error:", error);
            Swal.fire(
                'Error!',
                error.message || "Failed to delete experience",
                'error'
            );
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/jobseekerdetails/experience/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, _id: experience._id }),
            });

            if (!response.ok) throw new Error("Failed to update experience");

            setIsEditing(false);
            window.location.reload(); // Refresh to show changes
        } catch (error) {
            console.error("Update error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || "Failed to update experience",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const monthName = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];
    const startD = new Date(experience.startDate);
    const startMonth = monthName[startD.getMonth()];
    const startYear = startD.getFullYear();
    const postedStartDate = `${startMonth} ${startYear}`;
    const endD = new Date(experience.endDate);
    const endMonth = monthName[endD.getMonth()];
    const endYear = endD.getFullYear();
    const postedEndDate = `${endMonth} ${endYear}`;

    if (isEditing) {
        return (
            <form onSubmit={handleUpdate} className="py-4 border-b-2 space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-[#001571]">Position</label>
                    <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-[#001571]">Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-[#001571]">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        rows={3}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#001571]">Country</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#001571]">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#001571]">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#001571]">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
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
                        {isSubmitting ? "Saving..." : "Save"} <PiCheckCircle />
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="flex flex-row gap-2 py-4 border-b-2 justify-between">
            <div className="flex flex-col justify-between text-base font-bold">
                <h1>
                    {experience.position} - {experience.companyName}
                </h1>
                <h1>
                    {postedStartDate} - {postedEndDate}
                </h1>
                <div className="text-base font-medium mt-2">
                    {experience.city}, {experience.country}
                </div>
            </div>
            <div className="flex flex-row items-center mr-6 gap-2">
                <button
                    onClick={() => setIsEditing(true)}
                    onMouseEnter={() => setIsHoveredEdit(true)}
                    onMouseLeave={() => setIsHoveredEdit(false)}
                    className="flex items-center justify-center bg-[#E8E8E8] text-white p-3 rounded-full shadow hover:bg-blue-600 transition-colors"
                    aria-label="Edit experience"
                >
                    <RiEdit2Fill
                        size={20}
                        color={isHoveredEdit ? "#ffffff" : "#001571"} />
                </button>
                <button
                    onClick={handleDelete}
                    onMouseEnter={() => setIsHoveredDelete(true)}
                    onMouseLeave={() => setIsHoveredDelete(false)}
                    className="flex items-center justify-center bg-[#E8E8E8] text-white p-3 rounded-full shadow hover:bg-red-600 transition-colors"
                    aria-label="Delete experience"
                >
                    <RiDeleteBinFill
                        size={20}
                        color={isHoveredDelete ? "#ffffff" : "#001571"} />
                </button>
            </div>
        </div>
    );
}
