"use client"
// import JobCard from "@/components/jobCard";
import NavBar from "@/components/navBar";
import NewsLetter from "@/components/newsletter";
import Image from "next/image";
import { countries } from "../../lib/countries";
import JobCard from "@/components/jobCard";
import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io";
import { useEffect, useState } from "react";
import { Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import CategoryComponent from "@/components/CategoryComponent";
import PackageComponent from "@/components/PackageComponent";
import Footer from "@/components/Footer";
import StoryComponent from "@/components/StoryComponent";
import NewsComponent from "@/components/NewsComponent";
import FaqComponent from "@/components/FaqComponent";
import Loading from "../loading";
import JobLoading from "../jobLoading";
import { IoSearchSharp } from "react-icons/io5";
import JobApplicationForm from "../jobs/[jobid]/apply/JobApplicationForm";
import JobSearch from "@/components/jobSearch";

function StartingPage() {

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch jobs data    
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
              const recruiterResponse = await fetch(`/api/recruiterdetails/get?id=${job.recruiterId}`);
              if (!recruiterResponse.ok) {
                return { 
                  ...job,
                  industry: "Unknown",
                  recruiterName: "Unknown",
                  logo: "/images/default-image.jpg"
                };
              }
              const recruiterData = await recruiterResponse.json();
              return {
                ...job,
                industry: recruiterData.industry || "Unknown",
                recruiterName: recruiterData.recruiterName || "Unknown",
                logo: recruiterData.logo || "/images/default-image.jpg"
              };
            } catch (error) {
              return { 
                ...job,
                industry: "Unknown",
                recruiterName: "Unknown",
                logo: "/images/default-image.jpg"
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

  const handleApply = (jobId) => {
    setSelectedJobId(jobId);
    setShowApplicationForm(true);
  };

  return (
    <>

      {/* Hero section */}
      <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] flex justify-center">
        <div className="h-screen w-full absolute z-[-1]">
          <Image src="/images/bg.jpg" alt="Background Image"
            layout="fill"
            objectFit="contain"
            objectPosition="right top"
            quality={100}
            priority
            className="w-full h-full opacity-5 " />
        </div>

        <div className="pt-8 w-[1280px]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2">
              <div className="mb-8">
                <h1 className="text-4xl text-center lg:text-left md:text-left sm:text-left sm:text-5xl lg:text-6xl font-bold text-[#8A93BE] mt-12 md:mt-16 lg:mt-28">
                  Your Future{" "}
                  <span className="font-bold text-[#7d7d7d]">Start Here!</span>
                </h1>
                <p className="pt-4 text-center lg:text-left md:text-left sm:text-left text-base sm:text-lg text-[#001571]">
                  Explore personalized job opportunities, expert tools, and
                  connections with top companies to advance your career with
                  Skill Careers.
                </p>

                {/*<div className="relative w-full sm:w-2/3 md:w-1/2 lg:w-2/6 mb-5">
                  <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="border-2 border-[#B0B6D3] text-[#5462A0] py-4 px-3 mt-6 font-semibold rounded-md cursor-pointer sm:text-sm"
                  >
                    {selectedCountry ? (
                      <div className="flex items-center">
                        {selectedCountry.label}
                        <img
                          src={selectedCountry.flag}
                          className="w-5 h-5 ml-3"
                          alt=""
                        />
                      </div>
                    ) : (
                      "Select the Country"
                    )}
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5462A0]">
                      <IoMdArrowDropdown />
                    </span>
                  </div>

                  {isOpen && (
                    <div className="absolute z-10 bg-white border border-[#B0B6D3] rounded-md mt-1 w-full max-h-60 overflow-y-auto">
                      {countries.map((country) => (
                        <div
                          key={country.code}
                          onClick={() => handleSelect(country)}
                          className="flex items-center px-2 py-4 hover:bg-gray-200 cursor-pointer"
                        >
                          {country.label}
                          <img
                            src={country.flag}
                            className="w-5 h-5 ml-auto justify-end"
                            alt=""
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>*/}

                <JobSearch />
              </div>

              <div className="mt-24 mb-12">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex -space-x-4">
                      <Image
                        src="/images/user1.png"
                        width={50}
                        height={50}
                        alt="User 1"
                        className="rounded-full"
                      />
                      <Image
                        src="/images/user2.png"
                        width={50}
                        height={50}
                        alt="User 2"
                        className="rounded-full"
                      />
                      <Image
                        src="/images/user3.png"
                        width={50}
                        height={50}
                        alt="User 3"
                        className="rounded-full"
                      />
                    </div>
                    <div className="ml-4">
                      <h1 className="text-xl sm:text-2xl font-bold text-[#001571]">
                        6K+
                      </h1>
                      <p className="text-[#001571] font-semibold">
                        Active Daily Users
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col md:flex-row items-center gap-10 mt-10">
                  <div className="flex items-center">
                    <Image
                      src="/images/worldsearch.png"
                      width={20}
                      height={20}
                      alt="World Search"
                      className="rounded-full"
                    />
                    <p className="text-[#001571] ml-2 font-semibold">
                      Advanced Job Search
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Image
                      src="/images/reward.png"
                      width={20}
                      height={20}
                      alt="Reward"
                      className="rounded-full"
                    />
                    <p className="text-[#001571] ml-2 font-semibold">
                      Career Growth Resources
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Image
                      src="/images/attach.png"
                      width={20}
                      height={20}
                      alt="Attach"
                      className="rounded-full"
                    />
                    <p className="text-[#001571] ml-2 font-semibold">
                      Career Growth Resources
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image Section */}
            <div className="relative w-full h-[800px] md:h-auto lg:h-auto sm:h-[800px]">
              <Image
                src="/images/girlPic.png"
                alt="Illustration"
                quality={100}
                fill
                className="object-cover rounded-md"
              />
            </div>
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
            ) : Array.isArray(filteredJobs) && filteredJobs.length > 0 ? (

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
                  {filteredJobs.map((job, index) => (
                    <SwiperSlide key={index}>
                      <JobCard
                        job={job}
                        onApply={handleApply}
                      />
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

      {showApplicationForm && (
        <JobApplicationForm
          jobid={selectedJobId}
          onClose={() => setShowApplicationForm(false)}
        />
      )}


      <CategoryComponent />
      <PackageComponent />
      <div className="bg-[#F5F5F5] w-full flex items-center justify-center">
        <div className="w-full flex items-center justify-center" style={{
          backgroundImage: "url('/landing/bbg.png')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "10% 80%",
          backgroundBlendMode: "overlay",
          backgroundtransform: "rotate(45deg)",
        }}>
          <div
            className="w-full py-28 flex flex-col items-center justify-center gap-24">
            <StoryComponent />
            <NewsComponent />
            <FaqComponent />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default StartingPage;
