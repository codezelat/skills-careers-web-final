

import Image from "next/image";
import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

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
              return { ...job, recruiter: recruiterData };
            } catch (error) {
              console.error(
                `Error fetching recruiter for job ${job.jobId}:`,
                error
              );
              return { ...job, recruiter: null };
            }
          })
        );

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

  const handleSelectedJob = (job) => {
    window.open(`/jobs/${job.jobId}`, "_blank");
    setSearchQuery("");
    setJobSuggestions([]);
  };

  return (
    <div className="flex flex-col relative mt-10">
      <div className="bg-gray-200 rounded-md">
        <div className="flex flex-row sm:flex-nowrap sm:flex-row justify-between items-center gap-4 rounded-md py-1 md:py-2 px-1 md:px-4">
          <input
            type="text"
            placeholder="Search by job title, keywords, or company."
            value={searchQuery}
            onChange={handleJobChange}
            className="bg-gray-200 w-full text-base lg:text-lg md:text-lg sm:text-lg py-3 pl-3 focus:outline-none rounded-md font-semibold placeholder-[#5462A0]"
          />
          {/* <button className="flex w-auto justify-center items-center lg:w-1/5 md:w-1/5 sm:w-1/5  bg-[#001571] text-[14px] md:text-[16px] text-white px-3 py-2 md:px-6 md:py-3 rounded-md font-semibold">
                        <span className="mt-1 mr-2 md:mr-4 ">
                            <IoSearchSharp size={20} />
                        </span>
                        Search
                    </button> */}
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
