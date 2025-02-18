"use client"

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { FaDribbble, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTimes, FaTwitter } from "react-icons/fa";
import PortalLoading from "../loading";

export default function JobProfile({ slug }) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [jobDetails, setJobDetails] = useState([]);
    const [recruiterDetails, setRecruiterDetails] = useState([]);

    useEffect(() => {
        if (session?.user?.email) {
            const fetchData = async () => {
                try {
                    const jobResponse = await fetch(`/api/job/get?id=${slug}`);
                    if (!jobResponse.ok) throw new Error("Failed to fetch job");
                    const jobData = await jobResponse.json();
                    setJobDetails(jobData);
                    console.log("hi", jobData);

                    const recruiterResponse = await fetch(`/api/recruiterdetails/get?id=${jobData.recruiterId}`);
                    if (!recruiterResponse.ok) throw new Error("Failed to fetch recruiter");
                    const recruiterData = await recruiterResponse.json();
                    setRecruiterDetails(recruiterData);

                    console.log(recruiterData);

                } catch (err) {
                    setError(err.message);
                    console.error("Fetch error:", err);
                } finally {
                    setIsLoading(false);
                }
            };

            if (slug) fetchData();
        }
    }, [session, slug]);

    // Date formatting
    const date = new Date(jobDetails.postedDate).getDate();
    const monthName = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const d = new Date(jobDetails.postedDate);
    let month = monthName[d.getMonth()];
    const year = new Date(jobDetails.postedDate).getFullYear();
    const postedDate = `${date} ${month} ${year}`;

    const viewRecruiterProfile = () => {
        router.push(`/Portal/recruiter/${jobDetails.recruiterId}`);
    }

    if (isLoading) {
        return (<PortalLoading />);
    }

    return (
        <div className="bg-white rounded-3xl py-7 px-7">
            <h1 className="flex justify-end font-semibold text-base">{postedDate || "Date not available"}</h1>
            <div className="flex flex-row items-center justify-between">
                <div className="relative flex flex-col w-[200px] h-[100px]">
                    {recruiterDetails.logo ? (
                        <Image
                            src={recruiterDetails.logo}
                            alt="Background"
                            layout="fill"
                            objectPosition="left-center"
                            priority
                            fill
                            objectFit="contain"
                            quality={100}
                        />
                    ) : (
                        <Image
                            src="/default-avatar.jpg"
                            alt="Background"
                            objectPosition="left-center"
                            priority
                            fill
                            objectFit="contain"
                            quality={100}
                        />
                    )}
                </div>
            </div>
            <div className="flex flex-row w-full items-center justify-between mt-10 pb-5 border-b-2 border-[#B0B6D3]">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-10">
                        <h1 className="text-[24px] font-bold text-[#001571]">{jobDetails.jobTitle}</h1>
                        <div>
                            {jobDetails.jobTypes && jobDetails.jobTypes.map((type, index) => (
                                <span
                                    key={index}
                                    className={`px-4 py-[6px] rounded-lg mr-2 text-white ${index % 2 === 0 ? 'bg-[#001571]' : 'bg-[#00B6B4]'
                                        }`}
                                >
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="text-base font-bold text-black">{recruiterDetails.recruiterName} | {jobDetails.location}</div>
                </div>
                <button
                    onClick={viewRecruiterProfile}
                    className="flex flex-row items-center justify-center gap-2 px-5 rounded-md border-[#001571] border-[3px] font-bold text-sm text-[#001571] leading-tight h-12">
                    View Company Profile
                    <span className="">
                        <BsArrowUpRightCircleFill size={20} color="#001571" />
                    </span>
                </button>
            </div>

            {/* Description */}
            <div className="flex flex-col w-full mt-10 pb-5 border-b-2 border-[#B0B6D3] gap-5">
                <div className="flex flex-row items-center justify-between w-full">
                    <h1 className="flex items-center text-lg font-bold">Job Description</h1>
                </div>
                <div className="text-base font-semibold">{jobDetails.jobDescription || "No description available"}</div>
            </div>

            {/* Short Description */}
            <div className="flex flex-col w-full mt-10 pb-5 gap-5">
                <div className="flex flex-row items-center justify-between w-full">
                    <h1 className="flex items-center text-lg font-bold">Short Description</h1>
                </div>
                <div className="text-base font-semibold">{jobDetails.shortDescription || "No perks & benefits available"}</div>
            </div>

            {/* Responsibilities */}
            <div className="flex flex-col w-full mt-10 pb-5 border-b-2 border-[#B0B6D3] gap-5">
                <div className="flex flex-row items-center justify-between w-full">
                    <h1 className="flex items-center text-lg font-bold">Key Responsibilities</h1>
                </div>
                <div className="text-base font-semibold">{jobDetails.keyResponsibilities || "No responsibilities available"}</div>
            </div>

            {/* Qualifications */}
            <div className="flex flex-col w-full mt-10 pb-5 border-b-2 border-[#B0B6D3] gap-5">
                <div className="flex flex-row items-center justify-between w-full">
                    <h1 className="flex items-center text-lg font-bold">Required Qualifications</h1>
                </div>
                <div className="text-base font-semibold">{jobDetails.requiredQualifications || "No qualifications available"}</div>
            </div>

            {/* Perks & Benefits */}
            <div className="flex flex-col w-full mt-10 pb-5 gap-5">
                <div className="flex flex-row items-center justify-between w-full">
                    <h1 className="flex items-center text-lg font-bold">Perks & Benefits</h1>
                </div>
                <div className="text-base font-semibold">{jobDetails.perksAndBenefits || "No perks & benefits available"}</div>
            </div>
        </div>
    );
}