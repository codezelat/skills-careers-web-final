"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NavBar from "@/components/navBar";
import SwiperComponent from "../../components/jobCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import JobApplicationForm from './[jobid]/apply/JobApplicationForm';
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import JobLoading from "../jobLoading";
import Footer from "@/components/Footer";
import JobCard from "../../components/jobCard";
import Loading from "../loading";

function JobProfile({ slug }) {
  const router = useRouter();
  const [jobDetails, setJobDetails] = useState({
    id: "",
    jobTitle: "",
    recruiterId: "",
    location: "",
    jobTypes: "",
    jobDescription: "",
    keyResponsibilities: "",
    requiredQualifications: "",
    perksAndBenefits: "",
    createdAt: "",
    postedDate: ""
  });

  const [recruiterDetails, setRecruiterDetails] = useState({
    id: "",
    recruiterName: "",
    email: "",
    logo: "",
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([])

  // Fetch jobs data
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/job/all");
        if (!response.ok) {
          throw new Error("Failed to fetch featured jobs details");
        }
        const data = await response.json();

        // Fetch recruiter details for each job
        const jobsWithRecruiterDetails = await Promise.all(
          data.jobs.map(async (job) => {
            const recruiterResponse = await fetch(
              `/api/recruiterdetails/get?id=${job.recruiterId}`
            );
            if (!recruiterResponse.ok) {
              throw new Error("Failed to fetch recruiter details");
            }
            const recruiterData = await recruiterResponse.json();
            return {
              ...job,
              recruiterName: recruiterData.recruiterName,
              logo: recruiterData.logo,
            };
          })
        );

        setJobs(jobsWithRecruiterDetails);
        setFeaturedJobs(jobsWithRecruiterDetails);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/job/get?id=${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch job details");
        }

        setJobDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchJobDetails();
    }
  }, [slug]);

  useEffect(() => {
    const fetchRecruiterDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/recruiterdetails/get?id=${jobDetails.recruiterId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch job details");
        }

        setRecruiterDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobDetails.recruiterId) {
      fetchRecruiterDetails();
    }
  }, [jobDetails.recruiterId]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Error: {error}</p>
        <Link
          href="/jobs"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Return to Jobs List
        </Link>
      </div>
    );
  }

  const handleViewRecruiter = () => {
    router.push(`/recruiters/${recruiterDetails.id}`);
  };

  // date
  const date = new Date(jobDetails.postedDate).getDate();
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date(jobDetails.postedDate);
  let month = monthName[d.getMonth()];
  const year = new Date(jobDetails.postedDate).getFullYear();
  const postedDate = `${date} ${month} ${year}`;

  return (
    <>
      <div className="w-full">
        <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] space-y-5 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 pt-5">
            <div className="flex justify-center lg:justify-start md:justify-start sm:justify-start gap-4 mb-8 text-[#33448D] font-semibold text-lg">
              <Image
                src={recruiterDetails.logo || "/images/default-image.jpg"}
                width={180}
                height={180}
                alt="detail logo"
                className="w-50 h-50 lg:w-auto lg:h-auto md:w-auto md:h-auto sm:w-auto sm:h-auto"
              />
            </div>
            <div className="flex justify-end gap-4 mb-8 text-black font-bold text-base lg:text-lg md:text-lg sm:text-lg">
              <p>{postedDate}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex flex-wrap items-center">
              <h1 className="text-2xl font-bold text-[#001571] mb-0 mr-4">
                {jobDetails.jobTitle}
              </h1>
              <div className="flex items-center">
                {jobDetails.jobTypes && jobDetails.jobTypes.map((type, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1/2 rounded-lg mr-2 text-white ${index % 2 === 0 ? 'bg-[#001571]' : 'bg-[#00B6B4]'
                      }`}
                  >
                    {type}
                  </span>
                ))}
              </div>

            </div>
            <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
              <button onClick={handleViewRecruiter} className="flex border border-2 border-[#001571] hover:bg-blue-700 text-[#001571] font-bold py-2 px-4 rounded mr-4">
                View Company Profile
                <span className="pl-3 mt-1">
                  <BsArrowUpRightCircleFill />
                </span>
              </button>
              <button
                onClick={() => {
                  setShowApplicationForm(true);
                }}
                className="bg-[#001571] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Apply Now
              </button>
            </div>
          </div>
          <h2 className="text-lg font-bold text-black mb-20">
            {recruiterDetails.recruiterName} | {jobDetails.location}
          </h2>

          <hr className="border-b-2 border-[#B0B6D3] mb-5" />

          <div className="bg-white">
            <h3 className="text-xl font-bold mb-2">Job Description</h3>
            <p className="font-Montserrat">
              {jobDetails.jobDescription}
            </p>

            <hr className="border-b-2 border-[#B0B6D3] mt-10 mb-5" />

            <h3 className="text-xl font-bold mb-2">Key Responsibilities</h3>
            <ul className="list-disc list-inside  space-y-3">
              {jobDetails.keyResponsibilities}
            </ul>

            <hr className="border-b-2 border-[#B0B6D3] mt-10 mb-5" />

            <h3 className="text-xl font-bold mb-2">Required Qualifications</h3>
            <ul className="list-disc list-inside space-y-3">
              {jobDetails.requiredQualifications}
            </ul>

            <hr className="border-b-2 border-[#B0B6D3] mt-10 mb-5" />

            <h3 className="text-xl font-bold mb-2">Perks & Benefits</h3>
            <ul className="list-disc list-inside space-y-3">
              {jobDetails.perksAndBenefits}
            </ul>
          </div>
        </div>
      </div>

      {/* Featured jobs section */}
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
            ) : Array.isArray(featuredJobs) && featuredJobs.length > 0 ? (

              <div className="flex items-center justify-between relative w-full px-[20px] xl:px-[0px] ">

                <div className="swiper-button-prev-custom flex items-center justify-center">
                  <img src="/left.png" />
                </div>

                <Swiper
                  modules={[Pagination, Navigation]}
                  slidesPerView={1}
                  spaceBetween={10}
                  pagination={{
                    clickable: true,
                    el: ".custom-pagination",
                  }}
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
                  {featuredJobs.map((job, index) => (
                    <SwiperSlide key={index}>
                      <JobCard job={job}/>
                    </SwiperSlide>
                  ))}

                  <div className="custom-pagination mt-16" />
                </Swiper>

                <div className="swiper-button-next-custom flex items-center justify-center">
                  <img src="/right.png" />
                </div>

              </div>
            ) : (
              // Display "No Jobs found" if no jobs are available
              <p className="text-lg text-center font-bold text-red-500 py-20">
                No Jobs found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Job Application Form Popup */}
      {showApplicationForm && (
        <JobApplicationForm
          jobid={jobDetails.id}
          onClose={() => setShowApplicationForm(false)}
        />
      )}
    </>
  );
}

export default JobProfile;
