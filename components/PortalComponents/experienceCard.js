import React from "react";

export default function ExperienceCard({ experience }) {

    // date and time
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
    let month = monthName[d.getMonth()];
    const year = new Date(experience.createdAt).getFullYear();
    const postedDate = `${date} ${month} ${year}`;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between text-base font-bold">
                <h1>{experience.position} - {experience.companyName}</h1>
                <h1>{experience.startDate} - {experience.endDate}</h1>
            </div>
            <div className="text-base font-medium">{experience.city}, {experience.country}</div>
            <div className="text-base font-medium break-words">{experience.description}</div>
        </div>
    );
}
