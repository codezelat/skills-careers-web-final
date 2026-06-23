"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useSearchParams } from "next/navigation";

export default function JobSearch({ onSearchResults }) {
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get("search");

  const [searchQuery, setSearchQuery] = useState("");
  const [jobLoading, setJobLoading] = useState(false);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [urlSearchQuery]);

  const fetchJobsWithRecruiters = useCallback(async (searchTerm) => {
    if (searchTerm.length < 2) {
      onSearchResults(null);
      setJobLoading(false);
      return;
    }

    const currentId = ++requestIdRef.current;
    setJobLoading(true);

    try {
      const jobsResponse = await fetch(
        `/api/job/search?query=${encodeURIComponent(searchTerm)}`
      );
      if (!jobsResponse.ok) throw new Error("Job search failed");
      const jobsData = await jobsResponse.json();

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
          // Continue without recruiter data
        }
      }

      if (currentId !== requestIdRef.current) return;

      const jobsWithRecruiters = jobsData.jobs.map((job) => {
        const recruiterData = recruiterMap[job.recruiterId] || {};
        return {
          ...job,
          industry: recruiterData.industry || "Unknown",
          recruiterName: recruiterData.recruiterName || "Unknown",
          logo: recruiterData.logo || "/images/default-image.jpg",
        };
      });

      onSearchResults(jobsWithRecruiters);
    } catch (error) {
      if (currentId === requestIdRef.current) {
        onSearchResults([]);
      }
    } finally {
      if (currentId === requestIdRef.current) {
        setJobLoading(false);
      }
    }
  }, [onSearchResults]);

  const handleJobChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length === 0) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      onSearchResults(null);
      setJobLoading(false);
      return;
    }

    setJobLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchJobsWithRecruiters(value);
    }, 300);
  };

  const handleSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchJobsWithRecruiters(searchQuery);
  };

  return (
    <div className="flex flex-col relative">
      <div className="bg-gray-200 rounded-md">
        <div className="flex flex-row items-center gap-4 rounded-md py-1 md:py-2 px-1 md:px-4">
          <input
            type="text"
            placeholder="Search by job title, keywords, or company."
            value={searchQuery}
            onChange={handleJobChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="bg-gray-200 w-full text-base lg:text-lg md:text-lg sm:text-lg py-3 pl-3 focus:outline-none rounded-md font-semibold placeholder-[#5462A0]"
          />
          <button
            onClick={handleSearch}
            disabled={jobLoading}
            className="flex w-auto justify-center items-center lg:w-1/5 md:w-1/5 sm:w-1/5 bg-[#001571] text-[14px] md:text-[16px] text-white px-3 py-2 md:px-6 md:py-3 rounded-md font-semibold disabled:opacity-60 transition-opacity"
          >
            <span className="mt-1 mr-2 md:mr-4">
              <IoSearchSharp size={20} />
            </span>
            {jobLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
    </div>
  );
}
