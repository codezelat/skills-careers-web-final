"use client";
import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

export default function EducationSection({ educations, jobseekerId, onRefresh }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEducation, setCurrentEducation] = useState(null);
    const [formData, setFormData] = useState({
        educationName: "",
        location: "",
        startDate: "",
        endDate: "",
    });

    const handleAddNew = () => {
        setCurrentEducation(null);
        setFormData({
            educationName: "",
            location: "",
            startDate: "",
            endDate: "",
        });
        setIsModalOpen(true);
    };

    const handleEdit = (edu) => {
        setCurrentEducation(edu);
        setFormData({
            educationName: edu.educationName || "",
            location: edu.location || "",
            startDate: edu.startDate || "",
            endDate: edu.endDate || "",
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this education?")) return;

        try {
            const response = await fetch(
                `/api/jobseekerdetails/education/delete?id=${id}`,
                { method: "DELETE" }
            );
            if (response.ok) {
                onRefresh();
            } else {
                alert("Failed to delete education.");
            }
        } catch (error) {
            console.error("Error deleting education:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = currentEducation
                ? `/api/jobseekerdetails/education/update`
                : `/api/jobseekerdetails/education/add`;

            const method = currentEducation ? "PUT" : "POST";

            const body = currentEducation
                ? { ...formData, _id: currentEducation._id }
                : { ...formData, jobseekerId };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                setIsModalOpen(false);
                onRefresh();
            } else {
                alert("Failed to save education.");
            }
        } catch (error) {
            console.error("Error saving education:", error);
        }
    };

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#001571]">Education</h2>
                <button
                    onClick={handleAddNew}
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <FaPlus /> Add Education
                </button>
            </div>

            <div className="space-y-4">
                {educations && educations.length > 0 ? (
                    educations.map((edu) => (
                        <div key={edu._id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-start bg-gray-50">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{edu.educationName}</h3>
                                <p className="text-gray-600">{edu.location}</p>
                                <p className="text-sm text-gray-500">
                                    {edu.startDate} - {edu.endDate}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleEdit(edu)}
                                    type="button"
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Edit"
                                >
                                    <FaEdit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(edu._id)}
                                    type="button"
                                    className="text-red-500 hover:text-red-700"
                                    title="Delete"
                                >
                                    <FaTrash size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No education details added.</p>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800">
                                {currentEducation ? "Edit Education" : "Add Education"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">School / University</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={formData.educationName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, educationName: e.target.value })
                                        }
                                        required
                                        placeholder="e.g. Harvard University"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree / Location</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={formData.location}
                                        onChange={(e) =>
                                            setFormData({ ...formData, location: e.target.value })
                                        }
                                        placeholder="e.g. Bachelor of Science"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            value={formData.startDate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, startDate: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            value={formData.endDate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, endDate: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
