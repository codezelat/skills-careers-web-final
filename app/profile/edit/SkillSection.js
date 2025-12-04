"use client";
import { useState, useEffect } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";

export default function SkillSection({ title, initialSkills, onSave }) {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");

    useEffect(() => {
        if (initialSkills) {
            // Split by comma and trim, filtering out empty strings
            setSkills(initialSkills.split(",").map(s => s.trim()).filter(s => s));
        } else {
            setSkills([]);
        }
    }, [initialSkills]);

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim()) {
            const updatedSkills = [...skills, newSkill.trim()];
            setSkills(updatedSkills);
            setNewSkill("");
            onSave(updatedSkills.join(", "));
        }
    };

    const handleRemoveSkill = (indexToRemove) => {
        const updatedSkills = skills.filter((_, index) => index !== indexToRemove);
        setSkills(updatedSkills);
        onSave(updatedSkills.join(", "));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleAddSkill(e);
        }
    };

    return (
        <div className="mb-6">
            <h2 className="text-base font-bold text-black mb-2">{title}</h2>

            <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Add ${title}...`}
                    className="px-3 py-2 border-2 border-gray-300 rounded-lg flex-grow outline-none focus:border-blue-500"
                />
                <button
                    onClick={handleAddSkill}
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <FaPlus /> Add
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <div
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 border border-blue-200"
                    >
                        <span>{skill}</span>
                        <button
                            onClick={() => handleRemoveSkill(index)}
                            type="button"
                            className="text-blue-600 hover:text-red-500 focus:outline-none"
                        >
                            <FaTimes size={12} />
                        </button>
                    </div>
                ))}
                {skills.length === 0 && (
                    <p className="text-gray-400 italic text-sm">No skills added yet.</p>
                )}
            </div>
        </div>
    );
}
