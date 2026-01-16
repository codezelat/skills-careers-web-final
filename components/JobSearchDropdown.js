"use client";

import Image from "next/image";
import { useState } from "react";
import { IoSearchSharp, IoClose } from "react-icons/io5";

export default function JobSearchDropdown() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [jobLoading, setJobLoading] = useState(false);

  const fetchJobsWithRecruiters = async (searchTerm) => {
    if (searchTerm.length >= 2) {
      setJobLoading(true);
      try {
        // First fetch jobs
        const jobsResponse = await fetch(
          `/api/job/search?query=${encodeURIComponent(searchTerm)}`
        );
        if (!jobsResponse.ok) throw new Error("Job search failed");
        const jobsData = await jobsResponse.json();
        console.log("searched job data --- ", jobsData);

        // Get unique recruiter IDs
        const recruiterIds = [
          ...new Set(
            jobsData.jobs.map((job) => job.recruiterId).filter(Boolean)
          ),
        ];

        // Batch fetch all recruiter details in one request
        const recruiterMap = {};
        if (recruiterIds.length > 0) {
          try {
            const recruiterResponse = await fetch(
              "/api/recruiterdetails/batch",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: recruiterIds }),
              }
            );

            if (recruiterResponse.ok) {
              const { recruiters } = await recruiterResponse.json();
              Object.assign(recruiterMap, recruiters);
            }
          } catch (err) {
            console.error("Error fetching recruiters:", err);
          }
        }

        // Map jobs with recruiter details
        const jobsWithRecruiters = jobsData.jobs.map((job) => {
          const recruiterData = recruiterMap[job.recruiterId];
          return { ...job, recruiter: recruiterData || null };
        });

        setJobSuggestions(jobsWithRecruiters);
        console.log("Jobs with recruiter details:", jobsWithRecruiters);
      } catch (error) {
        console.error("Error fetching data:", error);
        setJobSuggestions([]);
      } finally {
        setJobLoading(false);
      }
    } else {
      setJobSuggestions([]);
    }
  };

  const handleJobChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchJobsWithRecruiters(value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setJobSuggestions([]);
  };

  const handleSelectedJob = (job) => {
    window.open(`/jobs/${job.jobId}`, "_blank");
    setSearchQuery("");
    setJobSuggestions([]);
  };

  return (
    <div className="flex flex-col relative mt-10">
      <div className="bg-gray-200 rounded-md">
        <div className="flex flex-row sm:flex-nowrap sm:flex-row justify-between items-center gap-4 rounded-md py-1 md:py-2 px-1 md:px-4 relative">
          <input
            type="text"
            placeholder="Search by job title, keywords, or company."
            value={searchQuery}
            onChange={handleJobChange}
            className="bg-gray-200 w-full text-base lg:text-lg md:text-lg sm:text-lg py-3 pl-3 pr-10 focus:outline-none rounded-md font-semibold placeholder-[#5462A0]"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 text-gray-500 hover:text-[#001571] transition-colors p-2"
              aria-label="Clear search"
            >
              <IoClose size={24} />
            </button>
          )}
        </div>
      </div>

      <div className="absolute top-full left-0 right-0 z-20">
        {jobLoading && (
          <div className="z-10 w-full bg-gray-200 rounded-md shadow-lg p-4 mt-2 pl-6 text-base font-semibold">
            Loading Jobs...
          </div>
        )}

        {jobSuggestions.length > 0 && (
          <ul className="gap-2 z-10 w-full shadow-lg my-2 bg-white rounded-md  max-h-[50vh] overflow-auto">
            {jobSuggestions.map((job, index) => (
              <li
                key={index}
                onClick={() => handleSelectedJob(job)}
                className="flex flex-row px-4 py-5 cursor-pointer bg-white hover:bg-slate-200 gap-4 border-b-2"
              >
                {job.recruiter && (
                  <Image
                    src={job.recruiter.logo || "/images/default-image.jpg"}
                    alt="Logo"
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                )}
                <div className="flex flex-col border-l-2 pl-6 gap-1">
                  <h1 className="text-base font-semibold">{job.jobTitle}</h1>
                  <p className="text-sm font-semibold">
                    {job.recruiter.recruiterName} | {job.location}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!jobLoading &&
          searchQuery.length >= 2 &&
          jobSuggestions.length === 0 && (
            <div className="z-10 w-full rounded-md shadow-lg my-2 bg-white px-4 py-5 text-base font-semibold">
              Nothing found
            </div>
          )}
      </div>
    </div>
  );
}
