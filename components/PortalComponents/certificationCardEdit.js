"use client";
import React, { useState } from "react";
import { RiDeleteBinFill } from "react-icons/ri";

export default function CertificationCardEdit({ certification, onDelete }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleDelete = async () => {
        const isConfirmed = window.confirm(
            "Are you sure you want to delete this certification?"
        );
    
        if (!isConfirmed) return;
    
        try {
            const response = await fetch(
                `/api/jobseekerdetails/certification/delete?id=${certification._id}`,
                {
                    method: "DELETE",
                }
            );
    
            if (!response.ok) {
                throw new Error("Failed to delete certification");
            }
    
            if (onDelete) {
                onDelete(certification._id);
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert(error.message || "Failed to delete certification");
        }
    };

    const date = new Date(certification.receivedDate).getDate();
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

    return (
        <div className="flex flex-row gap-2 py-4 border-b-2 justify-between">
            <div className="flex flex-col justify-between text-base font-bold">
                <h1>
                    {certification.certificateName}
                </h1>
                <h1>
                    {postedDate}
                </h1>
                <div className="text-base font-medium mt-2">
                    {certification.organizationName}
                </div>
            </div>
            <div className="flex flex-row items-center mr-6">
                <button
                    onClick={handleDelete}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="flex items-center justify-center bg-[#E8E8E8] text-white p-3 rounded-full shadow hover:bg-red-600 transition-colors"
                    aria-label="Delete certification"
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
