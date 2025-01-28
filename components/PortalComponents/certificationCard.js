import React from "react";

export default function CertificationCard({ certification }) {

    // date and time
        const date = new Date(certification.createdAt).getDate();
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
        const d = new Date(certification.createdAt);
        let month = monthName[d.getMonth()];
        const year = new Date(certification.createdAt).getFullYear();
        const postedDate = `${date} ${month} ${year}`;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between text-base font-bold">
                <h1>{certification.certificateName}</h1>
                <h1>{certification.receivedDate}</h1>
            </div>
            <div className="text-base font-medium">{certification.organizationName}</div>
        </div>
    );
}
