import React from "react";

export default function EducationCard({ education }) {

    // date and time
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
    const startD = new Date(education.startDate);
    const startMonth = monthName[startD.getMonth()];
    const startYear = startD.getFullYear();
    const postedStartDate = `${startMonth} ${startYear}`;
    const endD = new Date(education.endDate);
    const endMonth = monthName[endD.getMonth()];
    const endYear = endD.getFullYear();
    const postedEndDate = `${endMonth} ${endYear}`;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between text-base font-bold">
                <h1>{education.educationName}</h1>
                <h1>{postedStartDate} - {postedEndDate}</h1>
            </div>
            <div className="text-base font-medium">{education.location}</div>
        </div>
    );
}
