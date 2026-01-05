"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import JobCard from "@/components/jobCard";
import { useSearchParams } from "next/navigation";

export default function JobSearch({ onSearchResults }) {
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get("search");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [jobResults, setJobResults] = useState([]);
  const [jobLoading, setJobLoading] = useState(false);

  // Initialize search query from URL parameter
  useEffect(() => {
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [urlSearchQuery]);

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

        // Then fetch recruiter details for each job
        const jobsWithRecruiters = await Promise.all(
          jobsData.jobs.map(async (job) => {
            try {
              const recruiterResponse = await fetch(
                `/api/recruiterdetails/get?id=${job.recruiterId}`
              );
              if (!recruiterResponse.ok)
                throw new Error("Recruiter fetch failed");
              const recruiterData = await recruiterResponse.json();
              return {
                ...job,
                industry: recruiterData.industry || "Unknown",
                recruiterName: recruiterData.recruiterName || "Unknown",
                logo: recruiterData.logo || "/images/default-image.jpg",
              };
            } catch (error) {
              console.error(
                `Error fetching recruiter for job ${job.jobId}:`,
                error
              );
              return {
                ...job,
                industry: "Unknown",
                recruiterName: "Unknown",
                logo: "/images/default-image.jpg",
              };
            }
          })
        );

        setJobResults(jobsWithRecruiters);
        // Pass the results up to the parent component
        onSearchResults(jobsWithRecruiters);
      } catch (error) {
        console.error("Error fetching data:", error);
        setJobResults([]);
        onSearchResults([]);
      } finally {
        setJobLoading(false);
      }
    } else if (searchTerm.length === 0) {
      setJobResults([]);
      onSearchResults(null); // Reset to show all jobs when search is cleared
    }
  };

  const handleJobChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchJobsWithRecruiters(value);
  };

  const handleSearch = () => {
    fetchJobsWithRecruiters(searchQuery);
  };

  return (
    <div className="flex flex-col relative">
      <div className="bg-gray-200 rounded-md">
        <div className="flex flex-row sm:flex-nowrap sm:flex-row justify-between items-center gap-4 rounded-md py-1 md:py-2 px-1 md:px-4">
          <input
            type="text"
            placeholder="Search by job title, keywords, or company."
            value={searchQuery}
            onChange={handleJobChange}
            className="bg-gray-200 w-full text-base lg:text-lg md:text-lg sm:text-lg py-3 pl-3 focus:outline-none rounded-md font-semibold placeholder-[#5462A0]"
          />
          <button
            onClick={handleSearch}
            className="flex w-auto justify-center items-center lg:w-1/5 md:w-1/5 sm:w-1/5 bg-[#001571] text-[14px] md:text-[16px] text-white px-3 py-2 md:px-6 md:py-3 rounded-md font-semibold"
          >
            <span className="mt-1 mr-2 md:mr-4">
              <IoSearchSharp size={20} />
            </span>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
