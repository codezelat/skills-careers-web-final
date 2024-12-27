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

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <>
      <NavBar />
      <section className="">
        <Image
          src="/landing/bg.jpg"
          alt="line"
          width={100}
          height={30}
          className="absolute top-0 right-0 w-fit h-full object-cover z-[-1] opacity-5 items-end translate-y-[5px]"
        />
        <div className="mx-auto max-w-screen-xl space-y-5 px-4 pb-8 pt-16 sm:px-6">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-6xl font-bold text-[#8A93BE] mt-20 text-center sm:text-left">
              Find Your{" "}
              <span className="font-bold text-[#001571]">Perfect </span>
              Job.
            </h1>
          </div>

          <div className="bg-[#e6e8f1] lg:p-2 md:p-2 sm:p-2 rounded-md">
            <div className="flex flex-wrap gap-4 items-center">
              <input
                type="search"
                placeholder="Search by job title, keywords, or company."
                className="bg-[#e6e8f1] text-[#8A93BE] text-base lg:text-lg md:text-lg sm:text-base flex-grow px-4 py-2 focus:outline-none w-full rounded-md sm:w-auto font-bold placeholder-[#5462A0]"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Countries />

              <button className="flex bg-[#001571] text-white px-4 py-3 w-full justify-center lg:justify-end md:justify-end sm:justify-end mt-1 sm:w-auto rounded-md font-semibold text-base sm:text-lg">
                <span className="mt-1 mr-4">
                  <IoSearchSharp size={20} />
                </span>
                Search
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 md:frid-cols-4 sm:grid-cols-4 gap-4 mb-8">
            <DropdownButton
              buttonName="Industry"
              dropdownItems={["Industry 1", "Industry 2", "Industry 3"]}
              onSelect={handleSelect}
            />
            <DropdownButton
              buttonName="Experience Level"
              dropdownItems={[
                "Experience Level 1",
                "Experience Level 2",
                "Experience Level 3",
              ]}
              onSelect={handleSelect}
            />
            <DropdownButton
              buttonName="Salary Range"
              dropdownItems={[
                "Salary Range 1",
                "Salary Range 2",
                "Salary Range 3",
              ]}
              onSelect={handleSelect}
            />
            <DropdownButton
              buttonName="Job Type"
              dropdownItems={["Job Type 1", "Job Type 2", "Job Type 3"]}
              onSelect={handleSelect}
            />
          </div>
        </div>
        <div className="container mx-auto w-full">
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => <JobCard key={index} job={job} />)
            ) : (
              <p className="text-lg text-center font-bold text-red-500 py-20">No Jobs found.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Jobs;
