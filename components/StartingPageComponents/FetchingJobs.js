"use client";

import { useEffect, useState } from "react";
import JobCard from "@/components/jobCard";
import JobLoading from "./jobLoading";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import JobApplicationForm from "@/app/jobs/[jobid]/apply/JobApplicationForm";

const FetchingJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/job/all");
        if (!response.ok) throw new Error("Failed to fetch jobs.");
        const data = await response.json();

        // Fetch recruiter details for each job
        const jobsWithRecruiterDetails = await Promise.all(
          data.jobs.map(async (job) => {
            try {
              const recruiterResponse = await fetch(
                `/api/recruiterdetails/get?id=${job.recruiterId}`
              );
              if (!recruiterResponse.ok) throw new Error();
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
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, []);

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

  const handleApply = (jobId) => {
    setSelectedJobId(jobId);
    setShowApplicationForm(true);
  };

  return (
    <div className="w-full bg-[#F5F5F5] h-auto flex items-center justify-center py-24">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] flex flex-row justify-between items-start md:items-center text-[#001571] text-lg md:text-xl font-bold">
          <button className="text-lg md:text-xl font-bold text-[#001571] cursor-pointer md:mb-0">
            Featured Jobs
          </button>
          <button className="flex items-center text-right text-[#001571] cursor-pointer">
            <a href="/jobs">View All</a>
            <ArrowOutwardIcon className="w-4 md:w-5 h-4 md:h-5 ml-1" />
          </button>
        </div>
        <div className="w-full flex items-center justify-center">
          {isLoading ? (
            <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px]">
              <JobLoading />
            </div>
          ) : Array.isArray(filteredJobs) && filteredJobs.length > 0 ? (
            <Swiper
              modules={[Pagination, Navigation]}
              slidesPerView={1}
              spaceBetween={10}
              pagination={{ clickable: true, el: ".custom-pagination" }}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              loop
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 15 },
                768: { slidesPerView: 2, spaceBetween: 10 },
                1024: { slidesPerView: 4, spaceBetween: 15 },
              }}
              className="swiper-container w-[1280px] mt-16 pb-16"
            >
              {filteredJobs.map((job, index) => (
                <SwiperSlide key={index}>
                  <JobCard job={job} onApply={handleApply} />
                </SwiperSlide>
              ))}
              <div className="custom-pagination mt-16" />
            </Swiper>
          ) : (
            <p className="text-lg text-center font-bold text-red-500 py-20">
              No Jobs found.
            </p>
          )}
        </div>
      </div>

      {showApplicationForm && (
        <JobApplicationForm
          jobid={selectedJobId}
          onClose={() => setShowApplicationForm(false)}
        />
      )}
    </div>
  );
};

export default FetchingJobs;
