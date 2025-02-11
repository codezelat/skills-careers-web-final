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

export default function Jobs() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [recruiterDetails, setRecruiterDetails] = useState([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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
          fetch("/api/recruiterdetails/all")
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

  useEffect(() => {
    const filterJobs = () => {
      const filtered = jobs.filter(job => {
        const matchesSearch = job.jobTitle.toLowerCase().includes(searchQuery) ||
          job.location.toLowerCase().includes(searchQuery);
        const matchesTab = activeTab === "all" ? true : !job.isPublished;
        return matchesSearch && matchesTab;
      });
      setFilteredJobs(filtered);
    };
    filterJobs();
  }, [searchQuery, activeTab, jobs]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Rest of your existing form handling functions remain the same...

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
            activeTab === "restricted" ? "bg-[#001571] text-white" : "text-[#B0B6D3]"
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

      {/* Job List */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[#8A93BE] text-base font-semibold text-left">
              <th className="px-4 py-3 w-[24.25%]">Position</th>
              {session?.user?.role === "admin" && (
                <th className="px-4 py-3 w-[24.25%]">Recruiter Name</th>
              )}
              <th className="px-4 py-3 w-[24.25%]">Posted Date</th>
              {session?.user?.role === "recruiter" && (
                <th className="px-4 py-3 w-[24.25%]">Applications</th>
              )}
              <th className="px-4 py-3 w-[24.25%]">Actions</th>
            </tr>
          </thead>
        </table>
      </div>

      <div className="grid gap-4 grid-cols-1">
        {currentJobs.length > 0 ? (
          currentJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onViewJob={() => handleJobSelect(job._id)}
              onJobStatusChanged={(jobId, newStatus) => {
                setJobs(prev => prev.map(j => 
                  j._id === jobId ? { ...j, isPublished: newStatus } : j
                ));
              }}
              onJobDeleted={(jobId) => {
                setJobs(prev => prev.filter(j => j._id !== jobId));
                setFilteredJobs(prev => prev.filter(j => j._id !== jobId));
              }}
            />
          ))
        ) : (
          <p className="text-lg text-center font-bold text-red-500 py-20">
            No jobs found.
          </p>
        )}
      </div>

      {/* Pagination and Create Job Form (remain the same as before) */}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <nav className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-[10px] py-2 rounded-lg ${
              currentPage === 1 ? "bg-gray-300" : "bg-gray-200 hover:bg-gray-400"
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

      {/* Create Job Form (keep your existing form implementation here) */}
    </div>
  );
}