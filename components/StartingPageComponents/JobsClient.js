"use client";

import { useEffect, useState } from "react";
import JobCard from "@/components/jobCard";
import Image from "next/image";
import DropdownButton from "@/components/dropDownButton";
import JobLoading from "./jobLoading";
import { useSearchParams } from "next/navigation";
import JobSearch from "@/components/jobSearch";
import JobApplicationForm from "@/app/jobs/[jobid]/apply/JobApplicationForm";
import jobCategories from "@/data/jobCategories.json";

function JobsClient() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedJobType, setSelectedJobType] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  const searchParams = useSearchParams();
  const industryQueryParam = searchParams.get("industry");
  const searchQueryParam = searchParams.get("search");
  const jobTypeQueryParam = searchParams.get("jobType");

  useEffect(() => {
    if (industryQueryParam) {
      setSelectedIndustry(industryQueryParam);
    }
  }, [industryQueryParam]);

  // Handle job type query from URL parameter
  useEffect(() => {
    if (jobTypeQueryParam) {
      setSelectedJobType(jobTypeQueryParam);
    }
  }, [jobTypeQueryParam]);

  // Handle search query from URL parameter
  useEffect(() => {
    const performSearch = async (searchTerm) => {
      try {
        const jobsResponse = await fetch(
          `/api/job/search?query=${encodeURIComponent(searchTerm)}`
        );
        if (!jobsResponse.ok) throw new Error("Job search failed");
        const jobsData = await jobsResponse.json();

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
          const recruiterData = recruiterMap[job.recruiterId] || {};
          return {
            ...job,
            industry:
              recruiterData.industry || recruiterData.category || "Unknown",
            recruiterName: recruiterData.recruiterName || "Unknown",
            logo: recruiterData.logo || "/images/default-image.jpg",
          };
        });

        setSearchResults(jobsWithRecruiters);
      } catch (error) {
        console.error("Error performing search:", error);
        setSearchResults([]);
      }
    };

    if (searchQueryParam && searchQueryParam.length >= 2) {
      performSearch(searchQueryParam);
    }
  }, [searchQueryParam]);

  useEffect(() => {
    async function fetchJobsAndRecruiters() {
      try {
        const jobsResponse = await fetch("/api/job/all", { cache: "no-store" });
        if (!jobsResponse.ok) throw new Error("Failed to fetch jobs.");
        const jobsData = await jobsResponse.json();
        const jobs = jobsData.jobs;

        // Get unique recruiter IDs
        const recruiterIds = [
          ...new Set(jobs.map((job) => job.recruiterId).filter(Boolean)),
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
        const jobsWithRecruiterDetails = jobs.map((job) => {
          const recruiterData = recruiterMap[job.recruiterId] || {};
          return {
            ...job,
            industry:
              recruiterData.industry || recruiterData.category || "Unknown",
            recruiterName: recruiterData.recruiterName || "Unknown",
            logo: recruiterData.logo || "/images/default-image.jpg",
          };
        });

        setJobs(jobsWithRecruiterDetails);
        setFilteredJobs(jobsWithRecruiterDetails);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetchJobsAndRecruiters();
  }, []);

  useEffect(() => {
    // Start with search results if available, otherwise use all jobs
    let filtered = searchResults !== null ? searchResults : jobs;

    if (selectedLocation) {
      filtered = filtered.filter(
        (job) =>
          job.location?.toLowerCase().trim() ===
          selectedLocation.toLowerCase().trim()
      );
    }

    if (selectedIndustry) {
      filtered = filtered.filter((job) => {
        if (!job.industry || job.industry === "Unknown") return false;

        const jobIndustry = job.industry.toLowerCase().trim();
        const selected = selectedIndustry.toLowerCase().trim();

        // Direct exact match (case-insensitive)
        if (jobIndustry === selected) return true;

        // Normalize & and 'and' for comparison
        const normalizeText = (text) => {
          return text
            .replace(/\s*&\s*/g, " and ")
            .replace(/\s+/g, " ")
            .trim();
        };

        const normalizedJobIndustry = normalizeText(jobIndustry);
        const normalizedSelected = normalizeText(selected);

        if (normalizedJobIndustry === normalizedSelected) return true;

        // Check if either contains the other (for partial matches)
        if (normalizedJobIndustry.includes(normalizedSelected)) return true;
        if (normalizedSelected.includes(normalizedJobIndustry)) return true;

        return false;
      });
    }

    if (selectedJobType) {
      const normalize = (str) =>
        str ? str.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
      const normalizedSelected = normalize(selectedJobType);

      filtered = filtered.filter((job) => {
        if (Array.isArray(job.jobTypes)) {
          return job.jobTypes.some(
            (type) => normalize(type) === normalizedSelected
          );
        }
        return normalize(job.jobTypes) === normalizedSelected;
      });
    }

    setFilteredJobs(filtered);
  }, [
    selectedLocation,
    selectedIndustry,
    selectedJobType,
    jobs,
    searchResults,
  ]);

  const industries = [...new Set(jobs.map((job) => job.industry))].filter(
    Boolean
  );
  const locations = [...new Set(jobs.map((job) => job.location))].filter(
    Boolean
  );

  // Combine predefined categories with actual industries from jobs
  // This ensures we show both standard categories and any custom ones
  const allIndustries = [
    ...new Set([
      ...jobCategories.map((cat) => cat.name),
      ...industries.filter((ind) => ind !== "Unknown"),
    ]),
  ].sort();

  // Extract unique job types from all jobs
  const jobTypes = [
    ...new Set(
      jobs.flatMap((job) => {
        if (Array.isArray(job.jobTypes)) {
          return job.jobTypes;
        }
        return job.jobTypes ? [job.jobTypes] : [];
      })
    ),
  ].filter(Boolean);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <>
      <section className="bg-[#F5F5F5] w-full flex flex-col items-center pb-24">
        <div className="h-screen w-full absolute bg-white">
          <Image
            src="/images/bg.jpg"
            alt="Background Image"
            fill
            style={{ objectFit: "contain", objectPosition: "right top" }}
            quality={100}
            priority
            className="w-full h-full opacity-5 "
          />
        </div>
        <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] space-y-5 pb-8 pt-16 z-[2]">
          <div className="mb-8 sm:justify-center">
            <h1 className="text-4xl font-bold text-[#8A93BE] mt-28">
              Find Your{" "}
              <span className="font-bold text-[#001571]">Perfect </span>
              Job.
            </h1>
          </div>

          <div className="bg-[#e6e8f1] p-2 md:p-0 rounded-md z-10">
            <JobSearch onSearchResults={handleSearchResults} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 mb-8">
            <DropdownButton
              buttonName="Location"
              selected={selectedLocation || "Location"}
              dropdownItems={["All Locations", ...locations]}
              onSelect={(location) => {
                setSelectedLocation(
                  location === "All Locations" ? null : location
                );
                setSearchResults(null); // Reset search results when changing filters
              }}
            />
            <DropdownButton
              buttonName="Industry"
              selected={selectedIndustry || "Industry"}
              dropdownItems={["All Industries", ...allIndustries]}
              onSelect={(industry) => {
                setSelectedIndustry(
                  industry === "All Industries" ? null : industry
                );
                setSearchResults(null); // Reset search results when changing filters
              }}
            />
            <DropdownButton
              buttonName="Job Type"
              selected={selectedJobType || "Job Type"}
              dropdownItems={["All Job Types", ...jobTypes]}
              onSelect={(jobType) => {
                setSelectedJobType(
                  jobType === "All Job Types" ? null : jobType
                );
                setSearchResults(null); // Reset search results when changing filters
              }}
            />
          </div>

          {/* Active Filters Display */}
          {(selectedLocation || selectedIndustry || selectedJobType) && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 mr-2">
                  <svg
                    className="w-4 h-4 text-[#001571]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-[#001571]">
                    Filters:
                  </span>
                </div>
                {selectedLocation && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-[#001571]/20 text-[#001571] shadow-sm hover:shadow-md transition-all duration-200">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="max-w-[200px] truncate">
                      {selectedLocation}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedLocation(null);
                        setSearchResults(null);
                      }}
                      className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                      title="Remove filter"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedIndustry && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-[#001571]/20 text-[#001571] shadow-sm hover:shadow-md transition-all duration-200">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="max-w-[200px] truncate">
                      {selectedIndustry}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedIndustry(null);
                        setSearchResults(null);
                      }}
                      className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                      title="Remove filter"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedJobType && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-[#001571]/20 text-[#001571] shadow-sm hover:shadow-md transition-all duration-200">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="max-w-[200px] truncate">
                      {selectedJobType}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedJobType(null);
                        setSearchResults(null);
                      }}
                      className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                      title="Remove filter"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedLocation(null);
                    setSelectedIndustry(null);
                    setSelectedJobType(null);
                    setSearchResults(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all duration-200 ml-auto"
                  title="Clear all filters"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="grid w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] mt-20 z-[1]">
          {/* Results Count */}
          {!isLoading && (
            <div className="mb-4">
              <p className="text-[#001571] font-semibold">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
                {(selectedLocation || selectedIndustry || selectedJobType) && (
                  <span className="text-gray-600 font-normal"> (filtered)</span>
                )}
              </p>
            </div>
          )}

          {isLoading ? (
            <JobLoading />
          ) : filteredJobs.length > 0 ? (
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
              {filteredJobs.map((job, index) => (
                <JobCard
                  key={index}
                  onApply={(jobId) => {
                    setSelectedJobId(jobId);
                    setShowApplicationForm(true);
                  }}
                  job={job}
                />
              ))}
            </div>
          ) : (
            <div className="w-full text-center py-20">
              <p className="text-lg font-bold">No jobs found.</p>
            </div>
          )}
        </div>
      </section>
      {showApplicationForm && (
        <JobApplicationForm
          jobid={selectedJobId}
          onClose={() => setShowApplicationForm(false)}
        />
      )}
    </>
  );
}

export default JobsClient;
