"use client";
import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

export default function CertificationSection({ certifications, jobseekerId, onRefresh }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCert, setCurrentCert] = useState(null);
    const [formData, setFormData] = useState({
        certificateName: "",
        organizationName: "",
        receivedDate: "",
    });

    const handleAddNew = () => {
        setCurrentCert(null);
        setFormData({
            certificateName: "",
            organizationName: "",
            receivedDate: "",
        });
        setIsModalOpen(true);
    };

    const handleEdit = (cert) => {
        setCurrentCert(cert);
        setFormData({
            certificateName: cert.certificateName || "",
            organizationName: cert.organizationName || "",
            receivedDate: cert.receivedDate || "",
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this certification?")) return;

        try {
            const response = await fetch(
                `/api/jobseekerdetails/certification/delete?id=${id}`,
                { method: "DELETE" }
            );
            if (response.ok) {
                onRefresh();
            } else {
                alert("Failed to delete certification.");
            }
        } catch (error) {
            console.error("Error deleting certification:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = currentCert
                ? `/api/jobseekerdetails/certification/update`
                : `/api/jobseekerdetails/certification/add`;

            const method = currentCert ? "PUT" : "POST";

            const body = currentCert
                ? { ...formData, _id: currentCert._id }
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
                alert("Failed to save certification.");
            }
        } catch (error) {
            console.error("Error saving certification:", error);
        }
    };

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#001571]">Licenses & Certifications</h2>
                <button
                    onClick={handleAddNew}
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <FaPlus /> Add Certification
                </button>
            </div>

            <div className="space-y-4">
                {certifications && certifications.length > 0 ? (
                    certifications.map((cert) => (
                        <div key={cert._id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-start bg-gray-50">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{cert.certificateName}</h3>
                                <p className="text-gray-600">{cert.organizationName}</p>
                                <p className="text-sm text-gray-500 mt-1">Received: {cert.receivedDate}</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleEdit(cert)}
                                    type="button"
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Edit"
                                >
                                    <FaEdit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(cert._id)}
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
                    <p className="text-gray-500 italic">No certifications added.</p>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800">
                                {currentCert ? "Edit Certification" : "Add Certification"}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={formData.certificateName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, certificateName: e.target.value })
                                        }
                                        required
                                        placeholder="e.g. AWS Certified Solutions Architect"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={formData.organizationName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, organizationName: e.target.value })
                                        }
                                        required
                                        placeholder="e.g. Amazon Web Services"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Received Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        value={formData.receivedDate}
                                        onChange={(e) =>
                                            setFormData({ ...formData, receivedDate: e.target.value })
                                        }
                                    />
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
