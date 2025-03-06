"use client"
import Image from "next/image";
import { useEffect, useState } from "react";

export default function TopJobPostersCard() {

    const [recruiters, setRecruiters] = useState([]);

    useEffect(() => {
        const fetchTopRecruiters = async () => {
            try {
                const response = await fetch("/api/recruiterdetails/topPostersGet");
                const data = await response.json();
                if (data.success) {
                    setRecruiters(data.recruiters);
                }
            } catch (error) {
                console.error("Failed to fetch top recruiters:", error);
            }
        };

        fetchTopRecruiters();
    }, []);

    return (
        <>
            {recruiters.map((recruiter, index) => (
                <div key={index} className="flex flex-row w-full items-center justify-between py-3 border-b-2 text-sm font-semibold">
                    <div className="flex flex-row items-center gap-4">
                        <Image
                            src={recruiter.logo || "/images/default-image.jpg"}
                            alt="Profile"
                            width={35}
                            height={35}
                            className="rounded-full shadow-lg"
                        />
                        <p>{recruiter.recruiterName}</p>
                    </div>
                    <p>{recruiter.jobCount} jobs posted</p>
                </div>
            ))}
        </>
    )
}