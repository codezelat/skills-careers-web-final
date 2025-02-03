"use client";
import React from "react";
import { RiDeleteBinFill } from "react-icons/ri";

export default function ExperienceCard({ experience, onDelete }) {
  const date = new Date(experience.createdAt).getDate();
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
  const d = new Date(experience.createdAt);
  const month = monthName[d.getMonth()];
  const year = d.getFullYear();
  const postedDate = `${date} ${month} ${year}`;

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

  return (
    <div className="flex flex-col gap-2 p-4 mb-4 rounded-lg shadow-sm">
      <div className="flex flex-row justify-between text-base font-bold">
        <h1>
          {experience.position} - {experience.companyName}
        </h1>
        <h1>
          {experience.startDate} - {experience.endDate}
        </h1>
      </div>
      <div className="text-base font-medium">
        {experience.city}, {experience.country}
      </div>
      <div className="flex flex-row justify-between text-base">
        <p className="text-gray-600">{experience.description}</p>
        <button
          onClick={handleDelete}
          className="flex items-center justify-center bg-[#EC221F] text-white p-2 rounded-full shadow hover:bg-red-600 transition-colors"
          aria-label="Delete experience"
        >
          <RiDeleteBinFill size={20} />
        </button>
      </div>
      <div className="text-sm text-gray-500">Posted on: {postedDate}</div>
    </div>
  );
}
