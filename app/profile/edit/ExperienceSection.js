"use client";
import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

export default function ExperienceSection({ experiences, jobseekerId, onRefresh }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentExperience, setCurrentExperience] = useState(null);
    const [formData, setFormData] = useState({
        position: "",
        companyName: "",
        description: "",
        country: "",
        city: "",
        startDate: "",
        endDate: "",
    });

    const handleAddNew = () => {
        setCurrentExperience(null);
        setFormData({
            position: "",
            companyName: "",
            description: "",
            country: "",
            city: "",
            startDate: "",
            endDate: "",
        });
        setIsModalOpen(true);
    };

    const handleEdit = (exp) => {
        setCurrentExperience(exp);
        setFormData({
            position: exp.position || "",
            companyName: exp.companyName || "",
            description: exp.description || "",
            country: exp.country || "",
            city: exp.city || "",
            startDate: exp.startDate || "",
            endDate: exp.endDate || "",
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`/api/jobseekerdetails/experience/delete?id=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                onRefresh();
                Swal.fire(
                    'Deleted!',
                    'Experience has been deleted.',
                    'success'
                );
            } else {
                Swal.fire(
                    'Error!',
                    'Failed to delete experience.',
                    'error'
                );
            }
        } catch (error) {
            console.error("Error deleting experience:", error);
            Swal.fire(
                'Error!',
                'Failed to delete experience.',
                'error'
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = currentExperience
                ? `/api/jobseekerdetails/experience/update`
                : `/api/jobseekerdetails/experience/add`;

            const method = currentExperience ? "PUT" : "POST";

            const body = currentExperience
                ? { ...formData, _id: currentExperience._id }
                : { ...formData, jobseekerId };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                setIsModalOpen(false);
                onRefresh();
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Experience saved successfully!',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to save experience.',
                });
            }
        }
        catch (error) {
            console.error("Error saving experience:", error);
        }
    };

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#001571]">Experience</h2>
                <button
                    onClick={handleAddNew}
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <FaPlus /> Add Experience
                </button>
            </div>

            <div className="space-y-4">
                {experiences && experiences.length > 0 ? (
                    experiences.map((exp) => (
                        <div key={exp._id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-start bg-gray-50">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{exp.position}</h3>
                                <p className="font-semibold text-gray-700">{exp.companyName}</p>
                                <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {exp.city}, {exp.country} | {exp.startDate} - {exp.endDate}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleEdit(exp)}
                                    type="button"
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Edit"
                                >
                                    <FaEdit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(exp._id)}
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
                    <p className="text-gray-500 italic">No experience details added.</p>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800">
                                {currentExperience ? "Edit Experience" : "Add Experience"}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={formData.position}
                                        onChange={(e) =>
                                            setFormData({ ...formData, position: e.target.value })
                                        }
                                        required
                                        placeholder="e.g. Senior Developer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={formData.companyName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, companyName: e.target.value })
                                        }
                                        required
                                        placeholder="e.g. Tech Corp"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        rows={3}
                                        placeholder="Describe your role and achievements..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            value={formData.country}
                                            onChange={(e) =>
                                                setFormData({ ...formData, country: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            value={formData.city}
                                            onChange={(e) =>
                                                setFormData({ ...formData, city: e.target.value })
                                            }
                                        />
                                    </div>
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
