"use client";
import React, { useState } from "react";
import { FaMedal, FaTimes } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { PiCheckCircle } from "react-icons/pi";

export default function ExpertiseCardEdit({ expertise, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedExpertise, setEditedExpertise] = useState(expertise);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async () => {
        if (editedExpertise.trim() === "" || editedExpertise === expertise) {
            setIsEditing(false);
            return;
        }

        setIsSubmitting(true);
        try {
            await onUpdate(expertise, editedExpertise);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update expertise", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isEditing) {
        return (
            <div className="flex flex-row items-center gap-2 bg-[#E6E8F1] px-4 py-2 rounded-md text-base font-semibold text-[#001571]">
                <input
                    type="text"
                    value={editedExpertise}
                    onChange={(e) => setEditedExpertise(e.target.value)}
                    className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                    autoFocus
                />
                <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="text-green-600 hover:text-green-800"
                >
                    <PiCheckCircle size={20} />
                </button>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setEditedExpertise(expertise);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <FaTimes size={16} />
                </button>
            </div>
        );
    }

    return (
        <div
            className="flex flex-row items-center gap-2 bg-[#E6E8F1] px-4 py-2 rounded-md text-base font-semibold text-[#001571] group"
        >
            <FaMedal />
            {expertise}
            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-800"
                >
                    <RiEdit2Fill size={18} />
                </button>
                <button
                    onClick={onDelete}
                    className="text-red-600 hover:text-red-800"
                >
                    <FaTimes size={18} />
                </button>
            </div>
        </div>
    );
}
