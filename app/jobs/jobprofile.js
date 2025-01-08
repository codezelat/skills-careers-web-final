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
import Footer from "@/components/Footer";
import JobCard from "../../components/jobCard";

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
    createdAt: "",
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
  const [filteredJobs, setFilteredJobs] = useState([]);

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
    return <div className="text-center py-4">Loading job details...</div>;
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

  const handleViewApplication = () => {
    router.push(`/jobs/${jobDetails.id}/apply`);
  };

  const handleViewRecruiter = () => {
    router.push(`/recruiters/${recruiterDetails.id}`);
  };



  return (
    <>
      <NavBar />
      <div className="min-h-screen p-8 mx-auto max-w-screen-xl space-y-5 px-4 py-8 sm:px-6">
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
            <p>{new Date(jobDetails.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex flex-wrap items-center">
            <h1 className="text-2xl font-bold text-[#001571] mb-0 mr-4">
              {jobDetails.jobTitle}
            </h1>
            <div className="flex items-center">
              <span className="bg-[#001571] text-white px-2 py-1/2 rounded-lg mr-2">
                {jobDetails.jobTypes}
              </span>
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
          <ul className="list-disc list-inside p-2 m-2 space-y-3">
            <li>
              Design engaging and user-friendly interfaces for web and mobile
              applications.
            </li>
            <li>
              Conduct user research, wireframing, prototyping, and usability
              testing to improve designs.
            </li>
            <li>
              Collaborate with cross-functional teams including developers,
              product managers, and marketers.
            </li>
            <li>
              Maintain and evolve design systems to ensure consistency across
              all platforms.
            </li>
            <li>
              Stay updated with the latest design trends, tools, and
              technologies.
            </li>
          </ul>

          <hr className="border-b-2 border-[#B0B6D3] mt-10 mb-5" />

          <h3 className="text-xl font-bold mb-2">Required Qualifications</h3>
          <ul className="list-disc list-inside p-2 m-2 space-y-3">
            <li>5+ years of experience in UX/UI design.</li>
            <li>
              Strong portfolio showcasing user-centered design and
              problem-solving skills.
            </li>
            <li>
              Proficiency in design tools like Figma, Sketch, and Adobe Creative
              Suite.
            </li>
            <li>
              Experience with HTML/CSS and front-end frameworks is a plus.
            </li>
            <li>
              Excellent communication skills and ability to work in a team
              environment.
            </li>
          </ul>

          <hr className="border-b-2 border-[#B0B6D3] mt-10 mb-5" />

          <h3 className="text-xl font-bold mb-2">Perks & Benefits</h3>
          <ul className="list-disc list-inside p-2 m-2 space-y-3">
            <li>Remote work flexibility.</li>
            <li>Health, dental, and vision insurance.</li>
            <li>401(k) plan with company match.</li>
            <li>Professional development opportunities.</li>
            <li>Flexible vacation policy.</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#e6e8f1]">

        <div className="w-full bg-[#EDF0FF] mt-20 h-auto py-10">
          <div className="container mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-[#001571] text-lg md:text-xl font-bold md:py-10">
              <button className="text-lg md:text-xl font-bold text-[#001571] cursor-pointer md:mb-0">
                Featured Jobs
              </button>
              <button className="flex items-center text-right text-[#001571] cursor-pointer">
                <a href="/jobs">View All</a>
                <ArrowOutwardIcon className="w-4 md:w-5 h-4 md:h-5 ml-1" />
              </button>
            </div>
            <div className="">
              {Array.isArray(filteredJobs) && filteredJobs.length > 0 ? (
                <Swiper
                  modules={[Pagination, Navigation]}
                  slidesPerView={4}
                  spaceBetween={0}
                  pagination={{ clickable: true }}
                  navigation
                  loop
                  breakpoints={{
                    640: { slidesPerView: 1, spaceBetween: 15 },
                    768: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 30 },
                  }}
                  className="w-full"
                >
                  {filteredJobs.map((job, index) => (
                    <SwiperSlide key={index}>
                      <JobCard job={job} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <p className="text-lg text-center font-bold text-red-500 py-20">No Jobs found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Job Application Form Popup */}
        {showApplicationForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="relative bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
              <button
                onClick={() => setShowApplicationForm(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <JobApplicationForm
                jobid={jobDetails.id}
                onClose={() => setShowApplicationForm(false)}
              />
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}

export default JobProfile;
