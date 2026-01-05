"use client";

import { useEffect, useState } from "react";
import JobCard from "@/components/jobCard";
import Image from "next/image";
import DropdownButton from "../../components/dropDownButton";
import JobLoading from "./jobLoading";
import { useSearchParams } from "next/navigation";
import JobSearch from "@/components/jobSearch";
import JobApplicationForm from "@/app/jobs/[jobid]/apply/JobApplicationForm";

function JobsClient() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  const searchParams = useSearchParams();
  const industryQueryParam = searchParams.get("industry");
  const searchQueryParam = searchParams.get("search");

  useEffect(() => {
    if (industryQueryParam) {
      setSelectedIndustry(industryQueryParam);
    }
  }, [industryQueryParam]);

  // Handle search query from URL parameter
  useEffect(() => {
    const performSearch = async (searchTerm) => {
      try {
        const jobsResponse = await fetch(
          `/api/job/search?query=${encodeURIComponent(searchTerm)}`
        );
        if (!jobsResponse.ok) throw new Error("Job search failed");
        const jobsData = await jobsResponse.json();

        // Fetch recruiter details for each job
        const jobsWithRecruiters = await Promise.all(
          jobsData.jobs.map(async (job) => {
            try {
              const recruiterResponse = await fetch(
                `/api/recruiterdetails/get?id=${job.recruiterId}`
              );
              if (!recruiterResponse.ok) {
                return {
                  ...job,
                  industry: "Unknown",
                  recruiterName: "Unknown",
                  logo: "/images/default-image.jpg",
                };
              }
              const recruiterData = await recruiterResponse.json();
              return {
                ...job,
                industry: recruiterData.industry || "Unknown",
                recruiterName: recruiterData.recruiterName || "Unknown",
                logo: recruiterData.logo || "/images/default-image.jpg",
              };
            } catch (error) {
              return {
                ...job,
                industry: "Unknown",
                recruiterName: "Unknown",
                logo: "/images/default-image.jpg",
              };
            }
          })
        );

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

        const jobsWithRecruiterDetails = await Promise.all(
          jobs.map(async (job) => {
            try {
              const recruiterResponse = await fetch(
                `/api/recruiterdetails/get?id=${job.recruiterId}`
              );
              if (!recruiterResponse.ok) {
                return {
                  ...job,
                  industry: "Unknown",
                  recruiterName: "Unknown",
                  logo: "/images/default-image.jpg",
                };
              }
              const recruiterData = await recruiterResponse.json();
              return {
                ...job,
                industry: recruiterData.industry || "Unknown",
                recruiterName: recruiterData.recruiterName || "Unknown",
                logo: recruiterData.logo || "/images/default-image.jpg",
              };
            } catch (error) {
              return {
                ...job,
                industry: "Unknown",
                recruiterName: "Unknown",
                logo: "/images/default-image.jpg",
              };
            }
          })
        );

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
        (job) => job.location.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    if (selectedIndustry) {
      filtered = filtered.filter(
        (job) => job.industry.toLowerCase() === selectedIndustry.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
  }, [selectedLocation, selectedIndustry, jobs, searchResults]);

  const industries = [...new Set(jobs.map((job) => job.industry))].filter(
    Boolean
  );
  const locations = [...new Set(jobs.map((job) => job.location))].filter(
    Boolean
  );

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
            layout="fill"
            objectFit="contain"
            objectPosition="right top"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-8">
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
                "Creative & Design",
                "Education & Training",
                "Technology & Development",
                "Operations & Logistics",
                "Marketing & Sales",
              ]}
              onSelect={(industry) => {
                setSelectedIndustry(
                  industry === "All Industries" ? null : industry
                );
                setSearchResults(null); // Reset search results when changing filters
              }}
            />
          </div>
        </div>
        <div className="grid w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] mt-20 z-[1]">
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
