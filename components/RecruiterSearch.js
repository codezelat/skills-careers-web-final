"use client";

import Image from "next/image";
import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

export default function RecruiterSearch({ onSearchResults }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recruiterLoading, setRecruiterLoading] = useState(false);

  const fetchRecruiters = async (searchTerm) => {
    if (searchTerm.length >= 2) {
      setRecruiterLoading(true);
      try {
        // Fetch recruiters
        const recruitersResponse = await fetch(
          `/api/recruiterdetails/search?query=${encodeURIComponent(searchTerm)}`
        );
        if (!recruitersResponse.ok) throw new Error("Recruiter search failed");
        const recruitersData = await recruitersResponse.json();
        
        // Pass the results up to the parent component
        onSearchResults(recruitersData.recruiters);
      } catch (error) {
        console.error("Error fetching data:", error);
        onSearchResults([]);
      } finally {
        setRecruiterLoading(false);
      }
    } else if (searchTerm.length === 0) {
      onSearchResults(null); // Reset to show all recruiters when search is cleared
    }
  };

  const handleRecruiterChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchRecruiters(value);
  };

  const handleSearch = () => {
    fetchRecruiters(searchQuery);
  };

  return (
    <div className="flex flex-col relative">
      <div className="bg-gray-200 rounded-md">
        <div className="flex flex-row sm:flex-nowrap sm:flex-row justify-between items-center gap-4 rounded-md py-1 md:py-2 px-1 md:px-4">
          <input
            type="text"
            placeholder="Search by recruiter name, industry, or location."
            value={searchQuery}
            onChange={handleRecruiterChange}
            className="bg-gray-200 w-full text-base lg:text-lg md:text-lg sm:text-lg py-3 pl-3 focus:outline-none rounded-md font-semibold placeholder-[#5462A0]"
          />
          <button 
            onClick={handleSearch}
            className="flex w-auto justify-center items-center lg:w-1/5 md:w-1/5 sm:w-1/5 bg-[#001571] text-[14px] md:text-[16px] text-white px-3 py-2 md:px-6 md:py-3 rounded-md font-semibold"
          >
            <span className="mt-1 mr-2 md:mr-4">
              <IoSearchSharp size={20} />
            </span>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}