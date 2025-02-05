"use client";
import React from "react";
import { RiDeleteBinFill } from "react-icons/ri";

export default function ExperienceCard({ experience, onDelete }) {
  const StartDate = new Date(experience.startDate).getDate();
  const EndDate = new Date(experience.endDate).getDate();
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
    <div className="flex flex-col gap-2 ">
      <div className="flex flex-row justify-between text-base font-bold">
        <h1>
          {experience.position} - {experience.companyName}
        </h1>
        <h1>
          {postedStartDate} - {postedEndDate}
        </h1>
      </div>
      <div className="text-base font-medium">
        {experience.city}, {experience.country}
      </div>
      <div className="flex flex-row justify-between text-base">
        <p className="text-gray-600">{experience.description}</p>
      </div>
      {/* <div className="text-sm text-gray-500">Posted on: {postedDate}</div> */}
    </div>
  );
}
