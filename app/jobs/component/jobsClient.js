// app/jobs/JobsClient.js
"use client";

import { useState, useEffect } from "react";
import JobCard from "@/components/jobCard";
import { IoSearchSharp } from "react-icons/io5";
import Image from "next/image";
import DropdownButton from "@/components/dropDownButton";
import Footer from "@/components/Footer";
import JobApplicationForm from "../[jobid]/apply/JobApplicationForm";

function JobsClient({ initialJobs }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [filteredJobs, setFilteredJobs] = useState(initialJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    let filtered = jobs;

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (job.recruiterName &&
            job.recruiterName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

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
  }, [searchQuery, selectedLocation, selectedIndustry, jobs]);

  // Get unique industries and locations
  const industries = [...new Set(jobs.map((job) => job.industry))].filter(
    Boolean
  );
  const locations = [...new Set(jobs.map((job) => job.location))].filter(
    Boolean
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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

          <div className="bg-[#e6e8f1] p-2 md:p-0 rounded-md">
            <div className="flex flex-col md:flex-row gap-1 md:gap-4 items-center">
              <input
                type="search"
                placeholder="Search by job title, keywords, or company."
                className="bg-[#e6e8f1] text-[#8A93BE] text-[14px] lg:text-lg md:text-lg sm:text-base flex-grow pl-6 py-4 focus:outline-none w-full rounded-md sm:w-auto font-bold placeholder-[#5462A0]"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className="flex items-center justify-center w-full md:w-wrap lg:w-1/5 md:w-1/5 sm:w-1/5  bg-[#001571] text-white px-6 py-3 mr-2 rounded-md font-semibold text-[12px] md:text-[16px]">
                <span className="md:mt-1 mr-2 md:mr-4">
                  <IoSearchSharp size={15} />
                </span>
                Search
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-8">
            <DropdownButton
              buttonName="Location"
              selected={selectedLocation || "Location"}
              dropdownItems={["All Locations", ...locations]}
              onSelect={(location) =>
                setSelectedLocation(
                  location === "All Locations" ? null : location
                )
              }
            />
            <DropdownButton
              buttonName="Industry"
              selected={selectedIndustry || "Industry"}
              dropdownItems={["All Industries", ...industries]}
              onSelect={(industry) =>
                setSelectedIndustry(
                  industry === "All Industries" ? null : industry
                )
              }
            />
          </div>
        </div>
        <div className="grid w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] mt-20 z-[1]">
          {filteredJobs.length > 0 ? (
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
