"use client";
import { useEffect, useState } from "react";
import RecruiterCard from "./recruiterCard";
import { useSession } from "next-auth/react";
import NavBar from "@/components/navBar";
import { IoSearchSharp } from "react-icons/io5";
import DropdownButton from "@/components/dropDownButton";
import RecruiterLoading from "@/components/RecruiterLoading";
import Footer from "@/components/Footer";
import Image from "next/image";

function Recruiters() {
  const { data: session, status } = useSession();

  const [recruiters, setRecruiters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredRecruiters, setFilteredRecruiters] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch recruiters data
  useEffect(() => {
    async function fetchRecruiters() {
      try {
        const response = await fetch("/api/recruiterdetails/all"); // Adjust endpoint as needed
        if (!response.ok) {
          throw new Error("Failed to fetch recruiters.");
          setIsLoading(false);
        }
        const data = await response.json();
        setRecruiters(data.recruiters);
        setFilteredRecruiters(data.recruiters);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetchRecruiters();
  }, []);

  // Handle search query change
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredRecruiters(
      recruiters.filter(
        (recruiter) =>
          recruiter.recruiterName.toLowerCase().includes(query) ||
          recruiter.industry.toLowerCase().includes(query) ||
          recruiter.location.toLowerCase().includes(query)
      )
    );
  };

  const handleSelect = (country) => {
    setSelectedCountry(country);
  };

  return (
    <>
      <NavBar />
      <div className="bg-[#F5F5F5] w-full flex justify-center z-0">
        <div className="h-screen w-full absolute bg-white z-[1]">
          <Image src="/images/bg.jpg" alt="Background Image"
            layout="fill"
            objectFit="contain"
            objectPosition="right top"
            quality={100}
            priority
            className="w-full h-full opacity-5 " />
        </div>
        <div className="z-[2] min-h-screen w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] space-y-5 py-16">
          <div className="mb-8 sm:justify-center">
            <h1 className="text-4xl font-bold text-[#8A93BE] mt-28">
              Find Your{" "}
              <span className="font-bold text-[#001571]">Perfect </span>
              Recruiter.
            </h1>
          </div>

          <div className="bg-[#e6e8f1] h-auto p-2 rounded-md">
            <div className="flex items-center gap-4 w-full">
              {/* Input Field */}
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by job title, keywords, or company."
                className="bg-gray-200 text-[14px] md:text-[18px] px-4 py-2 flex-grow rounded-md focus:outline-none font-semibold placeholder-[#5462A0]"
              />


              {/* Search Button */}
              <button className="flex w-wrap justify-center items-center lg:w-1/5 md:w-1/5 sm:w-1/5  bg-[#001571] text-[14px] md:text-[16px] text-white px-3 py-2 md:px-6 md:py-3 rounded-md font-semibold">
                <span className="mt-1 mr-2 md:mr-4 ">
                  <IoSearchSharp size={20} />
                </span>
                Search
              </button>
            </div>
          </div>


          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4 mb-8 text-[14px] md:text-[16px]">
            <div className="col-span-2 md:col-span-1">
              <DropdownButton
                buttonName="Industry"
                dropdownItems={["Industry 1", "Industry 2", "Industry 3"]}
                onSelect={handleSelect}
              />
            </div>
            <DropdownButton
              buttonName="Experience Level"
              dropdownItems={["Experience Level 1", "Experience Level 2", "Experience Level 3"]}
              onSelect={handleSelect}
            />
            <DropdownButton
              buttonName="Salary Range"
              dropdownItems={["Salary Range 1", "Salary Range 2", "Salary Range 3"]}
              onSelect={handleSelect}
            />
          </div>


          <div className="w-full pt-20">
            {isLoading ? (
              <RecruiterLoading />
            ) : filteredRecruiters.length > 0 ? (
              filteredRecruiters.map((recruiter, index) => (
                <RecruiterCard key={index} recruiter={recruiter} />
              ))
            ) : (
              <p className="text-lg text-center font-bold py-20">
                No recruiters found.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Recruiters;
