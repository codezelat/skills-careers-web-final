"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { IoSearchSharp, IoClose } from "react-icons/io5";

export default function JobSearchDropdown() {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [jobLoading, setJobLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const fetchJobsWithRecruiters = useCallback(async (searchTerm) => {
    if (searchTerm.length < 2) {
      setJobSuggestions([]);
      setShowDropdown(false);
      setJobLoading(false);
      return;
    }

    const currentId = ++requestIdRef.current;
    setJobLoading(true);
    setShowDropdown(true);

    try {
      const jobsResponse = await fetch(
        `/api/job/search?query=${encodeURIComponent(searchTerm)}`
      );
      if (!jobsResponse.ok) throw new Error("Job search failed");
      const jobsData = await jobsResponse.json();

      // Abort if a newer request has started
      if (currentId !== requestIdRef.current) return;

      const recruiterIds = [
        ...new Set(
          jobsData.jobs.map((job) => job.recruiterId).filter(Boolean)
        ),
      ];

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
          // Ignore batch fetch errors, continue without recruiter data
        }
      }

      // Abort if a newer request has started
      if (currentId !== requestIdRef.current) return;

      const jobsWithRecruiters = jobsData.jobs.map((job) => {
        const recruiterData = recruiterMap[job.recruiterId];
        return { ...job, recruiter: recruiterData || null };
      });

      setJobSuggestions(jobsWithRecruiters);
      setShowDropdown(true);
    } catch (error) {
      if (currentId === requestIdRef.current) {
        setJobSuggestions([]);
      }
    } finally {
      if (currentId === requestIdRef.current) {
        setJobLoading(false);
      }
    }
  }, []);

  const handleJobChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length < 2) {
      setJobSuggestions([]);
      setShowDropdown(false);
      setJobLoading(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    setJobLoading(true);
    setShowDropdown(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchJobsWithRecruiters(value);
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setJobSuggestions([]);
    setShowDropdown(false);
    setJobLoading(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    requestIdRef.current++;
  };

  const handleSelectedJob = (job) => {
    window.open(`/jobs/${job.jobId}`, "_blank");
    setSearchQuery("");
    setJobSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="flex flex-col relative mt-10">
      <div className="bg-gray-200 rounded-md">
        <div className="flex flex-row items-center rounded-md py-1 md:py-2 px-1 md:px-4 relative">
          <input
            type="text"
            placeholder="Search by job title, keywords, or company."
            value={searchQuery}
            onChange={handleJobChange}
            onFocus={() => {
              if (jobSuggestions.length > 0) setShowDropdown(true);
            }}
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

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-20">
          {jobLoading && (
            <div className="w-full bg-white rounded-md shadow-lg p-4 mt-2 text-base font-semibold text-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#001571] animate-bounce"></div>
                <div className="w-4 h-4 rounded-full bg-[#001571] animate-bounce [animation-delay:-.2s]"></div>
                <div className="w-4 h-4 rounded-full bg-[#001571] animate-bounce [animation-delay:-.4s]"></div>
                <span className="ml-2">Searching...</span>
              </div>
            </div>
          )}

          {!jobLoading && jobSuggestions.length > 0 && (
            <ul className="w-full shadow-lg mt-2 bg-white rounded-md max-h-[50vh] overflow-auto border border-gray-100">
              {jobSuggestions.map((job, index) => (
                <li
                  key={job._id || index}
                  onClick={() => handleSelectedJob(job)}
                  className="flex flex-row items-center px-4 py-4 cursor-pointer bg-white hover:bg-gray-50 gap-4 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    {job.recruiter && (
                      <Image
                        src={job.recruiter.logo || "/images/default-image.jpg"}
                        alt="Logo"
                        width={48}
                        height={48}
                        className="rounded-full object-cover w-12 h-12"
                      />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <h1 className="text-base font-semibold text-gray-900 truncate">
                      {job.jobTitle}
                    </h1>
                    <p className="text-sm text-gray-500 truncate">
                      {job.recruiter?.recruiterName || "Unknown"} &bull;{" "}
                      {job.location}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!jobLoading &&
            searchQuery.length >= 2 &&
            jobSuggestions.length === 0 && (
              <div className="w-full rounded-md shadow-lg mt-2 bg-white px-4 py-5 text-base font-semibold text-gray-500 text-center">
                No jobs found for &quot;{searchQuery}&quot;
              </div>
            )}
        </div>
      )}
    </div>
  );
}
