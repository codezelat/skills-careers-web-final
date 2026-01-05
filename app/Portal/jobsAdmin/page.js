"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { PiCheckCircle } from "react-icons/pi";
import { RiDeleteBinFill } from "react-icons/ri";
import { BsChevronLeft, BsChevronRight, BsPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import JobCard from "@/components/PortalComponents/portalJobCard";
import PortalLoading from "../loading";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import sriLankaDistricts from "@/data/sriLankaDistricts.json";

export default function Jobs() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [recruiterDetails, setRecruiterDetails] = useState([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin");
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, recruitersRes] = await Promise.all([
          fetch("/api/job/all?showAll=true"),
          fetch("/api/recruiterdetails/all"),
        ]);

        const jobsData = await jobsRes.json();
        const recruitersData = await recruitersRes.json();

        setJobs(jobsData.jobs);
        setFilteredJobs(jobsData.jobs);
        setRecruiterDetails(recruitersData.recruiters);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleJobTypeToggle = (type) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedJobTypes([]);
  };

  useEffect(() => {
    const filterJobs = () => {
      const filtered = jobs.filter((job) => {
        const matchesSearch =
          job.jobTitle.toLowerCase().includes(searchQuery) ||
          job.location.toLowerCase().includes(searchQuery);
        const matchesTab = activeTab === "all" ? true : !job.isPublished;
        const matchesJobType =
          selectedJobTypes.length === 0
            ? true
            : selectedJobTypes.some((type) => job.jobTypes?.includes(type));
        return matchesSearch && matchesTab && matchesJobType;
      });
      setFilteredJobs(filtered);
    };
    filterJobs();
  }, [searchQuery, activeTab, jobs, selectedJobTypes]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const JOB_TYPE_OPTIONS = [
    "On Site",
    "Hybrid",
    "Remote",
    "Full-Time",
    "Part-Time",
    "Freelance",
  ];

  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    customLocation: "",
    jobTypes: [],
    jobDescription: "",
    keyResponsibilities: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "location" && value !== "Other"
        ? { customLocation: "" }
        : {}),
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleJobTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(type)
        ? prev.jobTypes.filter((t) => t !== type)
        : [...prev.jobTypes, type],
    }));
    setFormErrors((prev) => ({ ...prev, jobTypes: "" }));
  };

  const handleRecruiterChange = (e) => {
    setSelectedRecruiter(e.target.value);
    setFormErrors((prev) => ({ ...prev, recruiterId: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.jobTitle.trim()) errors.jobTitle = "Job title is required";
    if (!selectedRecruiter)
      errors.recruiterId = "Recruiter selection is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (formData.location === "Other" && !formData.customLocation.trim()) {
      errors.customLocation = "Please specify the location";
    }
    if (formData.jobTypes.length === 0)
      errors.jobTypes = "At least one job type is required";
    if (!formData.jobDescription.trim())
      errors.jobDescription = "Description is required";
    if (!formData.keyResponsibilities.trim())
      errors.keyResponsibilities = "Responsibilities are required";
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
      const finalLocation =
        formData.location === "Other"
          ? formData.customLocation
          : formData.location;

      const response = await fetch("/api/job/add/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          location: finalLocation,
          recruiterId: selectedRecruiter,
        }),
      });

      if (response.status === 204) {
        throw new Error("Server returned empty response");
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Error ${response.status}`);
      }

      const refreshResponse = await fetch("/api/job/all?showAll=true");
      const refreshData = await refreshResponse.json();
      setJobs(refreshData.jobs);
      setFilteredJobs(refreshData.jobs);

      setFormData({
        jobTitle: "",
        location: "",
        customLocation: "",
        jobTypes: [],
        jobDescription: "",
        keyResponsibilities: "",
      });
      setSelectedRecruiter("");
      setIsFormVisible(false);
      setCurrentPage(1); // Reset to first page after adding new job
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.message || "Failed to create job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId);
  };

  if (loading) return <PortalLoading />;

  return (
    <div className="min-h-screen bg-white rounded-3xl py-5 px-7">
      {/* Header and Add Job Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#001571]">Job Posts</h1>
        <button
          className="bg-[#001571] text-white px-6 py-2 rounded-2xl shadow hover:bg-blue-800 flex items-center text-sm font-semibold"
          onClick={() => setIsFormVisible(true)}
        >
          <BsPlus size={25} className="mr-1" />
          Add New
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center p-1 mb-5 bg-[#E6E8F1] rounded-2xl w-max text-sm font-medium">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-3 flex rounded-2xl ${
            activeTab === "all" ? "bg-[#001571] text-white" : "text-[#B0B6D3]"
          }`}
        >
          All Job Posts
          <PiCheckCircle size={20} className="ml-2" />
        </button>
        <button
          onClick={() => setActiveTab("restricted")}
          className={`px-6 py-3 flex rounded-2xl ${
            activeTab === "restricted"
              ? "bg-[#001571] text-white"
              : "text-[#B0B6D3]"
          }`}
        >
          Restricted Job Posts
          <PiCheckCircle size={20} className="ml-2" />
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#E6E8F1] flex items-center pl-10 pr-10 mb-5 py-4 rounded-2xl shadow-sm w-full">
        <IoSearchSharp size={25} className="text-[#001571]" />
        <input
          type="text"
          placeholder="Search Job Posts..."
          className="ml-4 text-[#8A93BE] bg-[#E6E8F1] font-bold outline-none w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
      </div>

      {/* Job Type Filters */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-[#001571]">
            Filter by Job Type
          </label>
          {(selectedJobTypes.length > 0 || searchQuery) && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-[#EC221F] hover:text-red-700 font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {JOB_TYPE_OPTIONS.map((type) => (
            <button
              key={type}
              onClick={() => handleJobTypeToggle(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedJobTypes.includes(type)
                  ? "bg-[#001571] text-white shadow-md"
                  : "bg-[#E6E8F1] text-[#8A93BE] hover:bg-[#d8dae8]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[#8A93BE] text-base font-semibold text-left">
              <th className="px-4 py-3 w-[24.25%]">Job Title</th>
              <th className="px-4 py-3 w-[24.25%]">Organization</th>
              <th className="px-4 py-3 w-[24.25%]">Posted Date</th>
              <th className="px-4 py-3 w-[24.25%]">Actions</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Job List */}
      <div className="grid gap-4 grid-cols-1">
        {currentJobs.length > 0 ? (
          currentJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onViewJob={() => handleJobSelect(job._id)}
              onJobStatusChanged={(jobId, newStatus) => {
                setJobs((prev) =>
                  prev.map((j) =>
                    j._id === jobId ? { ...j, isPublished: newStatus } : j
                  )
                );
              }}
              onJobDeleted={(jobId) => {
                setJobs((prev) => prev.filter((j) => j._id !== jobId));
                setFilteredJobs((prev) => prev.filter((j) => j._id !== jobId));
              }}
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
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-[10px] py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300"
                : "bg-gray-200 hover:bg-gray-400"
            }`}
          >
            <BsChevronLeft size={15} />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === index + 1
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 hover:bg-gray-400"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-[10px] py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-gray-200 hover:bg-gray-400"
            }`}
          >
            <BsChevronRight size={15} />
          </button>
        </nav>
      </div>

      {/* Create job form */}
      {isFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h4 className="text-2xl font-semibold text-[#001571]">
                Add Job Post
              </h4>
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
                    className={`mt-2 block w-full border ${
                      formErrors.jobTitle
                        ? "border-red-500"
                        : "border-[#B0B6D3]"
                    } rounded-xl shadow-sm px-4 py-3`}
                  />
                  {formErrors.jobTitle && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.jobTitle}
                    </p>
                  )}
                </div>

                {/* Recruiter Selection */}
                <div>
                  <label className="block text-base font-semibold text-[#001571]">
                    Select Recruiter
                  </label>
                  <select
                    name="recruiterId"
                    value={selectedRecruiter}
                    onChange={handleRecruiterChange}
                    className={`mt-2 w-full border ${
                      formErrors.recruiterId
                        ? "border-red-500"
                        : "border-gray-400"
                    } rounded-lg px-4 py-3 text-sm`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Recruiter</option>
                    {recruiterDetails.map((recruiter) => (
                      <option key={recruiter._id} value={recruiter._id}>
                        {recruiter.recruiterName} ({recruiter.email})
                      </option>
                    ))}
                  </select>
                  {formErrors.recruiterId && (
                    <p className="text-red-500 text-base mt-1">
                      {formErrors.recruiterId}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-base font-semibold text-[#001571]">
                    Location
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`mt-2 block w-full border ${
                      formErrors.location
                        ? "border-red-500"
                        : "border-[#B0B6D3]"
                    } rounded-xl shadow-sm px-4 py-3`}
                  >
                    <option value="">Select a location</option>
                    {sriLankaDistricts.map((district) => (
                      <option key={district.value} value={district.value}>
                        {district.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.location && (
                    <p className="text-red-500 text-base mt-1">
                      {formErrors.location}
                    </p>
                  )}
                  {formData.location === "Other" && (
                    <div className="mt-3">
                      <input
                        type="text"
                        name="customLocation"
                        placeholder="Please specify location"
                        value={formData.customLocation}
                        onChange={handleInputChange}
                        className={`block w-full border ${
                          formErrors.customLocation
                            ? "border-red-500"
                            : "border-[#B0B6D3]"
                        } rounded-xl shadow-sm px-4 py-3`}
                      />
                      {formErrors.customLocation && (
                        <p className="text-red-500 text-base mt-1">
                          {formErrors.customLocation}
                        </p>
                      )}
                    </div>
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
        ${
          formData.jobTypes.includes(type)
            ? "bg-[#001571] text-white border-[#001571]"
            : "bg-white text-black border-gray-300"
        }
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
                    <p className="text-red-500 text-base mt-1">
                      {formErrors.jobTypes}
                    </p>
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
                    className={`mt-2 block w-full border ${
                      formErrors.jobDescription
                        ? "border-red-500"
                        : "border-[#B0B6D3]"
                    } rounded-xl shadow-sm px-4 py-3`}
                  />
                  {formErrors.jobDescription && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.jobDescription}
                    </p>
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
                    className={`mt-2 block w-full border ${
                      formErrors.keyResponsibilities
                        ? "border-red-500"
                        : "border-[#B0B6D3]"
                    } rounded-xl shadow-sm px-4 py-3`}
                  />
                  {formErrors.keyResponsibilities && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.keyResponsibilities}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="border-t border-gray-200 pt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-[#001571] text-white px-6 py-3 rounded-xl shadow-sm text-sm font-semibold flex items-center ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? "Creating..." : "Create Job Post"}
                    <PiCheckCircle className="ml-2" size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
