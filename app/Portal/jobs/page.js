"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { PiCheckCircle } from "react-icons/pi";
import { RiDeleteBinFill } from "react-icons/ri";
import { BsFillEyeFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import JobCard from "@/components/PortalComponents/portalJobCard";

export default function Recruiters() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [activeSection, setActiveSection] = useState("jobs");

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/job/all?showAll=true");
        const data = await response.json();
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
      } catch (error) {
        console.error("Error fetching Jobs:", error);
      } finally {
      }
    };
    fetchJobs();
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredJobs(
      jobs.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
      )
    );
  };

  const handleJobSelect = (jobId) => {
    setSelectedJobId(jobId);
  };

  const handleCloseProfile = () => {
    setSelectedJobId(null);
  };

  return (
    <div className="min-h-screen bg-white rounded-lg p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#001571]">Job Posts</h1>
        <button
          className="bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800"
          onClick={() => setShowApplicationForm(true)}
        >
          + Add New
        </button>
      </div>

      <div className="flex items-center justify-center p-2 mb-5 bg-[#E6E8F1] rounded-2xl w-max">
        {/* All Recruiters Button */}
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 flex rounded-xl text-sm font-semibold ${activeTab === "all"
            ? "bg-[#001571] text-white"
            : "text-[#B0B6D3] bg-[#E6E8F1]"
            }`}
        >
          All Job Posts
          {activeTab === "all" && (
            <span className="ml-2">
              <PiCheckCircle size={20} />
            </span>
          )}
        </button>

        {/* Restricted Recruiters Button */}
        <button
          onClick={() => setActiveTab("restricted")}
          className={`px-4 py-2 flex rounded-xl text-sm font-semibold ${activeTab === "restricted"
            ? "bg-[#001571] text-white"
            : "text-[#B0B6D3] bg-[#E6E8F1]"
            }`}
        >
          Restricted Job Posts
          {activeTab === "restricted" && (
            <span className="ml-2">
              <PiCheckCircle size={20} />
            </span>
          )}
        </button>
      </div>

      {activeTab === "all" ? (
        <>
          <div className="flex-grow ">
            <div className="bg-[#E6E8F1] flex items-center pl-4 pr-4 mb-5 py-4 rounded-lg shadow-sm w-full">
              <IoSearchSharp size={25} className="text-[#001571]" />
              <input
                type="text"
                placeholder="Search Job Posts..."
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
                      <th className="px-4 py-3 w-[5%]"></th>
                      <th className="px-4 py-3 w-[23.75%]">Position</th>
                      <th className="px-4 py-3 w-[23.75%]">Recruiter Name</th>
                      <th className=" px-4 py-3 w-[23.75%]">Posted Date</th>
                      <th className="px-4 py-3 w-[23.75%]">Actions</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div className="grid gap-4 grid-cols-1">
                  {filteredJobs
                    .map((job, index) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        onViewJob={() => handleJobSelect(job._id)}
                      />
                    ))
                    .reverse()}
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
          
        </>
      )}
    </div>
  );
}
