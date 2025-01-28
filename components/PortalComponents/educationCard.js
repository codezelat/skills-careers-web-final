import React from "react";

export default function EducationCard({ education }) {

    // date and time
        const date = new Date(education.createdAt).getDate();
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
        const d = new Date(education.createdAt);
        let month = monthName[d.getMonth()];
        const year = new Date(education.createdAt).getFullYear();
        const postedDate = `${date} ${month} ${year}`;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between text-base font-bold">
                <h1>{education.educationName}</h1>
                <h1>{education.startDate} - {education.endDate}</h1>
            </div>
            <div className="text-base font-medium">{education.location}</div>
        </div>
    );
}
