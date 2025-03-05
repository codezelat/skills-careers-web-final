"use client"
import PortalLoading from "@/app/Portal/loading";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HighDemandJobCard() {

    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMostDemandedJobs = async () => {
            try {
                const response = await fetch("/api/job/topJobsGet");
                const data = await response.json();
                if (data.success) {
                    setJobs(data.jobs);
                }
            } catch (error) {
                console.error("Failed to fetch most demanded jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMostDemandedJobs();
    }, []);
    
      if (isLoading) {
        return <PortalLoading />;
      }

    return (
        <>
            {jobs.map((job, index) => (
                <div key={index} className="flex flex-row w-full items-center justify-between py-3 border-b-2 text-sm font-semibold">
                    <div className="flex flex-row items-center gap-4">
                        <Image
                            src={"/images/default-image.jpg"}
                            alt="Profile"
                            width={35}
                            height={35}
                            className="rounded-full shadow-lg"
                        />
                        <p>{job.jobTitle}</p>
                    </div>
                    <p>{job.applicationCount} applicants</p>
                </div>
            ))}
        </>
    )
}