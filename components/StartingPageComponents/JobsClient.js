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
            industry: recruiterData.industry || "Unknown",
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
            industry: recruiterData.industry || "Unknown",
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
    // If we have search results, use those
    if (searchResults !== null) {
      setFilteredJobs(searchResults);
      return;
    }

    // Otherwise, filter based on dropdowns
    let filtered = jobs;

    if (selectedLocation) {
      filtered = filtered.filter(
        (job) => job.location?.toLowerCase().trim() === selectedLocation.toLowerCase().trim()
      );
    }

    if (selectedIndustry) {
      filtered = filtered.filter((job) => {
        const jobIndustry = job.industry?.toLowerCase().trim() || '';
        const selected = selectedIndustry.toLowerCase().trim();
        // Exact match or partial match for better compatibility
        return jobIndustry === selected || jobIndustry.includes(selected) || selected.includes(jobIndustry);
      });
    }

    if (selectedJobType) {
      filtered = filtered.filter((job) => {
        if (Array.isArray(job.jobTypes)) {
          return job.jobTypes.some(
            (type) => type?.toLowerCase().trim() === selectedJobType.toLowerCase().trim()
          );
        }
        return job.jobTypes?.toLowerCase().trim() === selectedJobType.toLowerCase().trim();
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
              dropdownItems={[
                "All Industries",
                ...jobCategories.map((cat) => cat.name),
              ]}
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
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-[#001571]">Active Filters:</span>
              {selectedLocation && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#001571] text-white">
                  {selectedLocation}
                  <button
                    onClick={() => {
                      setSelectedLocation(null);
                      setSearchResults(null);
                    }}
                    className="ml-2 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedIndustry && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#001571] text-white">
                  {selectedIndustry}
                  <button
                    onClick={() => {
                      setSelectedIndustry(null);
                      setSearchResults(null);
                    }}
                    className="ml-2 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedJobType && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#001571] text-white">
                  {selectedJobType}
                  <button
                    onClick={() => {
                      setSelectedJobType(null);
                      setSearchResults(null);
                    }}
                    className="ml-2 hover:text-red-300"
                  >
                    ×
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
                className="text-sm font-medium text-red-600 hover:text-red-800 underline"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
        <div className="grid w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] mt-20 z-[1]">
          {/* Results Count */}
          {!isLoading && (
            <div className="mb-4">
              <p className="text-[#001571] font-semibold">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
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
