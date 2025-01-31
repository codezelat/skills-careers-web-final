"use client";
import { useEffect, useState } from "react";
import JobCard from "@/components/jobCard";
import Countries from "@/components/Countries";
import NavBar from "@/components/navBar";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { countries } from "../../lib/countries";
import { IoSearchSharp } from "react-icons/io5";
import Image from "next/image";
import DropdownButton from "../../components/dropDownButton";
import JobLoading from "../jobLoading";
import Footer from "@/components/Footer";
import JobApplicationForm from "./[jobid]/apply/JobApplicationForm";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Fetch jobs data
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/job/all"); // Adjust endpoint as needed
        if (!response.ok) {
          throw new Error("Failed to fetch jobs.");
        }
        const data = await response.json();
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, []);

  // Handle search query change
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

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  const handleApply = (jobId) => {
    setSelectedJobId(jobId);
    setShowApplicationForm(true);
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

          <div className="bg-[#e6e8f1] p-2 md:p-0 rounded-md">
            <div className="flex flex-col md:flex-row gap-1 md:gap-4 items-center">
              <input
                type="search"
                placeholder="Search by job title, keywords, or company."
                className="bg-[#e6e8f1] text-[#8A93BE] text-[14px] lg:text-lg md:text-lg sm:text-base flex-grow px-4 py-2 focus:outline-none w-full rounded-md sm:w-auto font-bold placeholder-[#5462A0]"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Countries />

              <button className="flex items-center justify-center w-full md:w-wrap lg:w-1/5 md:w-1/5 sm:w-1/5  bg-[#001571] text-white px-6 py-3 rounded-md font-semibold text-[12px] md:text-[16px]">
                <span className="md:mt-1 mr-2 md:mr-4">
                  <IoSearchSharp size={15} />
                </span>
                Search
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-8">
            <div className="col-span-1">
              <DropdownButton
                buttonName="Industry"
                dropdownItems={["Industry 1", "Industry 2", "Industry 3"]}
                onSelect={handleSelect}
              />
            </div>

            <div className="col-span-1">
              <DropdownButton
                buttonName="Experience Level"
                dropdownItems={[
                  "Experience Level 1",
                  "Experience Level 2",
                  "Experience Level 3",
                ]}
                onSelect={handleSelect}
              />
            </div>

            <div className="col-span-1 sm:col-span-1 flex sm:flex-none gap-2 md:gap-0">
              <DropdownButton
                buttonName="Salary Range"
                dropdownItems={[
                  "Salary Range 1",
                  "Salary Range 2",
                  "Salary Range 3",
                ]}
                onSelect={handleSelect}
              />
            </div>

            <div className="col-span-1 sm:col-span-1 flex sm:flex-none">
              <DropdownButton
                buttonName="Job Type"
                dropdownItems={["Job Type 1", "Job Type 2", "Job Type 3"]}
                onSelect={handleSelect}
              />
            </div>
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
                  onApply={handleApply}
                  job={job} />
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
      <Footer />
    </>
  );
}

export default Jobs;
