"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoAdd, IoSearchSharp } from "react-icons/io5";
import { PiCheckCircle } from "react-icons/pi";
import { RiDeleteBinFill } from "react-icons/ri";
import { BsChevronLeft, BsChevronRight, BsFillEyeFill, BsPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import JobCard from "@/components/PortalComponents/portalJobCard";
import PortalLoading from "../loading";
import { FaTimes } from "react-icons/fa";

export default function RecruiterPostedJobs(props) {
    const router = useRouter();
    const { data: session, status } = useSession();
    console.log(status);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
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

    // useEffect(() => {
    //     if (session?.user?.email) {
    //         const fetchRecruiterDetails = async () => {
    //             try {
    //                 console.log(session.user.id);
    //                 const response = await fetch(
    //                     `/api/recruiterdetails/get?userId=${session.user.id}`
    //                 );
    //                 if (response.ok) {
    //                     const data = await response.json();
    //                     setRecruiterDetails(data);
    //                 } else {
    //                     console.error("Failed to fetch recruiter details");
    //                 }
    //             } catch (error) {
    //                 console.error("Error fetching recruiter details:", error);
    //             }
    //         };
    //         fetchRecruiterDetails();
    //     }
    // }, [session]);

    useEffect(() => {
        if (session?.user?.email) {
            const fetchJobs = async () => {
                try {
                    const recruiterResponse = await fetch(`/api/recruiterdetails/get?userId=${session.user.id}`);
                    if (!recruiterResponse.ok) throw new Error("Failed to fetch recruiter");
                    const recruiterData = await recruiterResponse.json();
                    setRecruiterDetails(recruiterData);

                    const response = await fetch(
                        `/api/job/all?recruiterId=${recruiterData.id}&showAll=true`
                    );
                    if (!response.ok) {
                        throw new Error("Failed to fetch jobs.");
                    }
                    const data = await response.json();
                    setJobs(data.jobs);
                    console.log("jobs",data)
                } catch (err) {
                    setError(err.message);
                    console.error("Error fetching jobs:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchJobs();
        }
    },[session]);

    //create job functions
    const JOB_TYPE_OPTIONS = [
        'On Site',
        'Hybride',
        'Remote',
        'Full-Time',
        'Part-Time',
        'Freelance'
    ];
    const [formData, setFormData] = useState({
        jobTitle: '',
        location: '',
        jobTypes: [],
        jobDescription: '',
        keyResponsibilities: ''
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setFormErrors(prev => ({ ...prev, [name]: '' }));
    };
    const handleJobTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            jobTypes: prev.jobTypes.includes(type)
                ? prev.jobTypes.filter(t => t !== type)
                : [...prev.jobTypes, type]
        }));
        setFormErrors(prev => ({ ...prev, jobTypes: '' }));
    };
    const handleRecruiterChange = (e) => {
        setSelectedRecruiter(e.target.value);
        setFormErrors(prev => ({ ...prev, recruiterId: '' }));
    };
    const validateForm = () => {
        const errors = {};
        if (!formData.jobTitle.trim()) errors.jobTitle = 'Job title is required';
        if (!formData.location.trim()) errors.location = 'Location is required';
        if (formData.jobTypes.length === 0) errors.jobTypes = 'At least one job type is required';
        if (!formData.jobDescription.trim()) errors.jobDescription = 'Description is required';
        if (!formData.keyResponsibilities.trim()) errors.keyResponsibilities = 'Responsibilities are required';
        return errors;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/job/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    recruiterId: recruiterDetails.id
                }),
            });
            console.log("menna ", JSON.stringify({
                ...formData,
                recruiterId: session.user.id
            }));

            // Handle empty response
            if (response.status === 204) {
                throw new Error("Server returned empty response");
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `Error ${response.status}`);
            }

            // Refresh jobs list
            const refreshResponse = await fetch("/api/job/all?showAll=true");
            const refreshData = await refreshResponse.json();
            setJobs(refreshData.jobs);

            // Reset form
            setFormData({
                jobTitle: '',
                location: '',
                jobTypes: [],
                jobDescription: '',
                keyResponsibilities: ''
            });

        } catch (error) {
            console.error('Submission error:', error);
            alert(error.message || 'Failed to create job. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleJobSelect = (jobId) => {
        setSelectedJobId(jobId);
    };

    // pagination function
    const [currentPage, setCurrentPage] = useState(1);
    const recruitersPerPage = 6;

    const totalPages = Math.ceil(jobs.length / recruitersPerPage);

    const indexOfLastRecruiter = currentPage * recruitersPerPage;
    const indexOfFirstRecruiter = indexOfLastRecruiter - recruitersPerPage;
    const currentRecruiters = jobs.slice(indexOfFirstRecruiter, indexOfLastRecruiter);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

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
                    onClick={() => setIsFormVisible(true)}
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
                                    <th className="px-4 py-3 w-[24.25%]">Applications</th>
                                    <th className="px-4 py-3 w-[24.25%]">Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="grid gap-4 grid-cols-1">
                        {currentRecruiters.length > 0 ? (
                            currentRecruiters
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
                </>
            )}

            {isFormVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h4 className="text-2xl font-semibold text-[#001571]">Add Job Post</h4>
                            <button
                                onClick={() => setIsFormVisible(false)}
                                className="text-gray-500 hover:text-red-500 focus:outline-none"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Job Title */}
                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Job Title
                                    </label>
                                    <input
                                        type="text"
                                        name="jobTitle"
                                        value={formData.jobTitle}
                                        onChange={handleInputChange}
                                        className={`mt-2 block w-full border ${formErrors.jobTitle ? 'border-red-500' : 'border-[#B0B6D3]'} rounded-xl shadow-sm px-4 py-3`}
                                    />
                                    {formErrors.jobTitle && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.jobTitle}</p>
                                    )}
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className={`mt-2 block w-full border ${formErrors.location ? 'border-red-500' : 'border-[#B0B6D3]'} rounded-xl shadow-sm px-4 py-3`}
                                    />
                                    {formErrors.location && (
                                        <p className="text-red-500 text-base mt-1">{formErrors.location}</p>
                                    )}
                                </div>

                                {/* Job Types */}
                                <div>
                                    <label className="block text-base font-semibold text-[#001571] mb-2">
                                        Job Types
                                    </label>
                                    <div className="flex flex-row gap-2">
                                        {JOB_TYPE_OPTIONS.map((type) => (
                                            <label
                                                key={type}
                                                className={`flex items-center py-3 px-5 rounded-lg border-2 transition-all duration-300 ease-in-out
                    ${formData.jobTypes.includes(type) ? 'bg-[#001571] text-white border-[#001571]' : 'bg-white text-black border-gray-300'}
                  `}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.jobTypes.includes(type)}
                                                    onChange={() => handleJobTypeChange(type)}
                                                    className="hidden"
                                                />
                                                <span className="font-medium">{type}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {formErrors.jobTypes && (
                                        <p className="text-red-500 text-base mt-1">{formErrors.jobTypes}</p>
                                    )}
                                </div>

                                {/* Job Description */}
                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Job Description
                                    </label>
                                    <textarea
                                        name="jobDescription"
                                        value={formData.jobDescription}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className={`mt-2 block w-full border ${formErrors.jobDescription ? 'border-red-500' : 'border-[#B0B6D3]'} rounded-xl shadow-sm px-4 py-3`}
                                    />
                                    {formErrors.jobDescription && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.jobDescription}</p>
                                    )}
                                </div>

                                {/* Key Responsibilities */}
                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Key Responsibilities
                                    </label>
                                    <textarea
                                        name="keyResponsibilities"
                                        value={formData.keyResponsibilities}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className={`mt-2 block w-full border ${formErrors.keyResponsibilities ? 'border-red-500' : 'border-[#B0B6D3]'} rounded-xl shadow-sm px-4 py-3`}
                                    />
                                    {formErrors.keyResponsibilities && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.keyResponsibilities}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="border-t border-gray-200 pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`bg-[#001571] text-white px-6 py-3 rounded-xl shadow-sm text-sm font-semibold flex items-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                                            }`}
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create Job Post'}
                                        <PiCheckCircle className="ml-2" size={20} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <nav className="flex gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-[10px] py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-400'}`}
                    >
                        <BsChevronLeft size={15} />
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-400'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-[10px] py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-400'}`}
                    >
                        <BsChevronRight size={15} />
                    </button>
                </nav>
            </div>
        </div>
    );
}
