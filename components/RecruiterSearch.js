"use client";

import Image from "next/image";
import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

export default function RecruiterSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recruiterSuggestions, setRecruiterSuggestions] = useState([]);
  const [recruiterLoading, setRecruiterLoading] = useState(false);

  const fetchRecruiters = async (searchTerm) => {
    if (searchTerm.length >= 2) {
      setRecruiterLoading(true);
      try {
        // First fetch recruiters
        const recruitersResponse = await fetch(
          `/api/recruiterdetails/search?query=${encodeURIComponent(searchTerm)}`
        );
        if (!recruitersResponse.ok) throw new Error("Recruiter search failed");
        const recruitersData = await recruitersResponse.json();
        console.log("searched recruiter data --- ", recruitersData);
        setRecruiterSuggestions(recruitersData.recruiters);
      } catch (error) {
        console.error("Error fetching data:", error);
        setRecruiterSuggestions([]);
      } finally {
        setRecruiterLoading(false);
      }
    } else {
      setRecruiterSuggestions([]);
    }
  };

  const handleRecruiterChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchRecruiters(value);
  };

  const handleSelectedRecruiter = (recruiter) => {
    window.open(`/recruiters/${recruiter.recruiterId}`, "_blank");
    setSearchQuery("");
    setRecruiterSuggestions([]);
  };

  return (
    <div className="flex flex-col relative">
      <div className="bg-gray-200 rounded-md">
        <div className="flex flex-row sm:flex-nowrap sm:flex-row justify-between items-center gap-4 rounded-md py-1 md:py-2 px-1 md:px-4">
          <input
            type="text"
            placeholder="Search by recruiter title, keywords, or company."
            value={searchQuery}
            onChange={handleRecruiterChange}
            className="bg-gray-200 w-full text-base lg:text-lg md:text-lg sm:text-lg py-3 pl-3 focus:outline-none rounded-md font-semibold placeholder-[#5462A0]"
          />
          <button className="flex w-auto justify-center items-center lg:w-1/5 md:w-1/5 sm:w-1/5  bg-[#001571] text-[14px] md:text-[16px] text-white px-3 py-2 md:px-6 md:py-3 rounded-md font-semibold">
            <span className="mt-1 mr-2 md:mr-4 ">
              <IoSearchSharp size={20} />
            </span>
            Search
          </button>
        </div>
      </div>

      <div className="absolute top-full left-0 right-0 z-20">
        {recruiterLoading && (
          <div className="z-10 w-full bg-gray-200 rounded-md shadow-lg p-4 mt-2 pl-6 text-base font-semibold">
            Loading Recruiters...
          </div>
        )}

        {recruiterSuggestions.length > 0 && (
          <ul className="gap-2 z-20 w-full shadow-lg my-2 bg-white rounded-md  max-h-[50vh] overflow-auto">
            {recruiterSuggestions.map((recruiter, index) => (
              <li
                key={index}
                onClick={() => handleSelectedRecruiter(recruiter)}
                className="flex flex-row px-4 py-5 cursor-pointer bg-white hover:bg-slate-200 gap-4 border-b-2"
              >
                <Image
                  src={recruiter.logo || "/images/default-image.jpg"}
                  alt="Logo"
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
                <div className="flex flex-col border-l-2 pl-6 gap-1">
                  <h1 className="text-base font-semibold">
                    {recruiter.recruiterName}
                  </h1>
                  <p className="text-sm font-semibold">{recruiter.email}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!recruiterLoading &&
          searchQuery.length >= 2 &&
          recruiterSuggestions.length === 0 && (
            <div className="z-10 w-full rounded-md shadow-lg my-2 bg-white px-4 py-5 text-base font-semibold">
              Nothing found
            </div>
          )}
      </div>
    </div>
  );
}
