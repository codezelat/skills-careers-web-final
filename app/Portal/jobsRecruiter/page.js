"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoAdd, IoSearchSharp } from "react-icons/io5";
import { PiCheckCircle } from "react-icons/pi";
import { RiDeleteBinFill } from "react-icons/ri";
import { BsFillEyeFill, BsPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import JobCard from "@/components/PortalComponents/portalJobCard";
import PortalLoading from "../loading";

export default function RecruiterPostedJobs(props) {
    const router = useRouter();
    const { data: session, status } = useSession();
    console.log(status);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(true);
    const [recruiterDetails, setRecruiterDetails] = useState({
        id: "",
        recruiterName: "",
        employeeRange: "",
        email: "",
        contactNumber: "",
        website: "",
        companyDescription: "",
        industry: "",
        location: "",
        logo: "",
        facebook: "",
        instagram: "",
        linkedin: "",
        x: "",
    });
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login"); // Redirect to login if unauthenticated
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.email) {
            const fetchRecruiterDetails = async () => {
                try {
                    const response = await fetch(
                        `/api/recruiterdetails/get?userId=${session.user.id}`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setRecruiterDetails(data);
                    } else {
                        console.error("Failed to fetch recruiter details lol");
                    }
                } catch (error) {
                    console.error("Error fetching recruiter details:", error);
                }
            };
            fetchRecruiterDetails();
        }
    }, [session]);

    useEffect(() => {
        if (recruiterDetails.id) {
            const fetchJobs = async () => {
                try {
                    const response = await fetch(
                        `/api/job/all?recruiterId=${recruiterDetails.id}&showAll=true`
                    );
                    if (!response.ok) {
                        throw new Error("Failed to fetch jobs.");
                    }
                    const data = await response.json();
                    setJobs(data.jobs);
                } catch (err) {
                    setError(err.message);
                    console.error("Error fetching jobs:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchJobs();
        }
    }, [recruiterDetails.id]);

    if (loading) {
        return <PortalLoading />;
    }

    return (
        <div className="min-h-screen bg-white rounded-3xl py-5 px-7">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-[#001571]">Job Posts</h1>
                <button
                    className="bg-[#001571] text-white px-6 py-2 rounded-2xl shadow hover:bg-blue-800 flex items-center text-sm font-semibold"
                    onClick={() => setShowApplicationForm(true)}
                >
                    <BsPlus size={25} className="mr-1" />Add New
                </button>
            </div>

            <div className="flex items-center justify-center p-1 mb-5 bg-[#E6E8F1] rounded-2xl w-max text-sm font-medium">
                {/* All Recruiters Button */}
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-6 py-3 flex rounded-2xl ${activeTab === "all"
                        ? "bg-[#001571] text-white"
                        : "text-[#B0B6D3] bg-[#E6E8F1]"
                        }`}
                >
                    All Job Posts
                    <span className="ml-2">
                        <PiCheckCircle size={20} />
                    </span>
                </button>

                {/* Restricted Recruiters Button */}
                <button
                    onClick={() => setActiveTab("restricted")}
                    className={`px-6 py-3 flex rounded-2xl text-sm font-semibold ${activeTab === "restricted"
                        ? "bg-[#001571] text-white"
                        : "text-[#B0B6D3] bg-[#E6E8F1]"
                        }`}
                >
                    Restricted Job Posts
                    <span className="ml-2">
                        <PiCheckCircle size={20} />
                    </span>
                </button>
            </div>

            {activeTab === "all" ? (
                <>
                    <div className="flex-grow ">
                        <div className="bg-[#E6E8F1] flex items-center pl-10 pr-10 mb-5 py-4 rounded-2xl shadow-sm w-full">
                            <IoSearchSharp size={25} className="text-[#001571]" />
                            <input
                                type="text"
                                placeholder="Search Job Posts..."
                                className="ml-4 text-[#8A93BE] bg-[#E6E8F1] font-bold outline-none w-full"
                            />
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-4 mb-4 items-center bg-green">
                        <button className="flex items-center justify-center bg-[#001571] text-white px-6 py-3 rounded-2xl shadow hover:bg-blue-800">
                            <span className="mr-2 flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                            </span>
                            Select More
                        </button>

                        <button className="flex bg-[#EC221F] text-white px-6 py-3 rounded-2xl shadow hover:bg-red-600">
                            <span className="mr-2">
                                <RiDeleteBinFill size={20} />
                            </span>
                            Delete
                        </button>
                    </div>

                    {/* Table */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-[#8A93BE] text-base font-semibold text-left">
                                    <th className="px-4 py-3 w-[3%]"></th>
                                    <th className="px-4 py-3 w-[24.25%]">Position</th>
                                    <th className="px-4 py-3 w-[24.25%]">Published Date</th>
                                    <th className=" px-4 py-3 w-[24.25%]">Applications</th>
                                    <th className="px-4 py-3 w-[24.25%]">Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="grid gap-4 grid-cols-1">
                        {jobs.length > 0 ? (
                            jobs
                                .map((job, index) => (
                                    <JobCard
                                        key={index}
                                        job={job}
                                    />
                                ))
                        ) : (
                            <p className="text-lg text-center font-bold text-red-500 py-20">
                                No jobs found.
                            </p>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-4">
                        <nav className="flex gap-2">
                            <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                                &lt;
                            </button>
                            <button className="px-3 py-2 bg-blue-700 text-white rounded-lg">
                                1
                            </button>
                            <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                                2
                            </button>
                            <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                                3
                            </button>
                            <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                                ...
                            </button>
                            <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                                15
                            </button>
                            <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                                &gt;
                            </button>
                        </nav>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex-grow ">
                        <div className="bg-[#E6E8F1] flex items-center pl-4 pr-4 mb-5 py-4 rounded-lg shadow-sm w-full">
                            <IoSearchSharp size={25} className="text-[#001571]" />
                            <input
                                type="text"
                                placeholder="Search Recruiters..."
                                className="ml-2 text-[#8A93BE] bg-[#E6E8F1] font-bold outline-none w-full"
                            />
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-4 mb-4 items-center bg-green">
                        <button className="flex bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800">
                            <span className="mr-2">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                />
                            </span>
                            Select More
                        </button>

                        <button className="flex bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-600">
                            <span className="mr-2">
                                <BsFillEyeFill size={20} />
                            </span>
                            Unrestricted
                        </button>

                        <button className="flex bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-600">
                            <span className="mr-2">
                                <RiDeleteBinFill size={20} />
                            </span>
                            Delete
                        </button>
                    </div>

                    {/* Table */}
                    {/* <div className="overflow-x-auto bg-white shadow rounded-lg">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="text-[#8A93BE] text-base font-semibold text-left">
                                    <th className="px-4 py-3"></th>
                                    <th className="px-2 py-3"></th>
                                    <th className="px-4 py-3">Recruiter Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-24 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RecruitersList.filter(
                                    (recruiter) => recruiter.type === "Restricted"
                                ).map((recruiter, id) => (
                                    <tr
                                        key={id}
                                        className="text-gray-700 hover:bg-gray-50 border-b text-sm"
                                    >
                                        <td className="px-4 py-3">
                                            <input type="checkbox" />
                                        </td>
                                        <td className="px-2 py-3 flex items-left gap-3">
                                            <div className="w-8 h-8 text-white flex justify-center items-center rounded-full">
                                                <Image
                                                    src={recruiter.logo}
                                                    width={35}
                                                    height={35}
                                                    alt="logo"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-black font-semibold">
                                            {recruiter.name}
                                        </td>
                                        <td className="px-4 py-3 text-black font-semibold">
                                            {recruiter.email}
                                        </td>
                                        <td className="px-4 py-3 text-black font-semibold">
                                            {recruiter.phone}
                                        </td>
                                        <td className="px-4 py-3 flex gap-2 justify-end">
                                            <button className="flex bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800">
                                                <span className="mr-2">
                                                    <BsFillEyeFill size={15} />
                                                </span>
                                                Unrestricted
                                            </button>
                                            <button className="flex bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-600">
                                                <span className="mr-2">
                                                    <RiDeleteBinFill size={20} />
                                                </span>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div> */}

                    {/* Pagination */}
                    {/* <div className="flex justify-center mt-4">
                        <nav className="flex gap-2">
                            <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                                &lt;
                            </button>
                            <button className="px-3 py-2 bg-blue-700 text-white rounded-lg">
                                1
                            </button>
                            <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                                2
                            </button>
                            <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                                3
                            </button>
                            <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                                ...
                            </button>
                            <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                                15
                            </button>
                            <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                                &gt;
                            </button>
                        </nav>
                    </div> */}
                </>
            )}
        </div>
    );
}
