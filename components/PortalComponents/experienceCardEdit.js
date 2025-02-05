"use client";
import React, { useState } from "react";
import { RiDeleteBinFill } from "react-icons/ri";

export default function ExperienceCardEdit({ experience, onDelete }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleDelete = async () => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this experience?"
        );
    
        if (!isConfirmed) return;
    
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
        } catch (error) {
            console.error("Delete error:", error);
            alert(error.message || "Failed to delete experience");
        }
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
    const startD = new Date(experience.startDate);
    const startMonth = monthName[startD.getMonth()];
    const startYear = startD.getFullYear();
    const postedStartDate = `${startMonth} ${startYear}`;
    const endD = new Date(experience.endDate);
    const endMonth = monthName[endD.getMonth()];
    const endYear = endD.getFullYear();
    const postedEndDate = `${endMonth} ${endYear}`;

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
            <div className="flex flex-row items-center mr-6">
                <button
                    onClick={handleDelete}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="flex items-center justify-center bg-[#E8E8E8] text-white p-3 rounded-full shadow hover:bg-red-600 transition-colors"
                    aria-label="Delete experience"
                >
                    <RiDeleteBinFill
                        size={20}
                        color={isHovered ? "#ffffff" : "#001571"} />
                </button>
            </div>
            {/* <div className="text-sm text-gray-500">Posted on: {postedDate}</div> */}
        </div>
    );
}
