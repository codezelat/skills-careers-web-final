"use client";

import { useState, useRef, useCallback } from "react";
import { IoSearchSharp } from "react-icons/io5";

export default function RecruiterSearch({ onSearchResults }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recruiterLoading, setRecruiterLoading] = useState(false);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const fetchRecruiters = useCallback(async (searchTerm) => {
    if (searchTerm.length < 2) {
      onSearchResults(null);
      setRecruiterLoading(false);
      return;
    }

    const currentId = ++requestIdRef.current;
    setRecruiterLoading(true);

    try {
      const recruitersResponse = await fetch(
        `/api/recruiterdetails/search?query=${encodeURIComponent(searchTerm)}`
      );
      if (!recruitersResponse.ok) throw new Error("Recruiter search failed");
      const recruitersData = await recruitersResponse.json();

      if (currentId !== requestIdRef.current) return;

      onSearchResults(recruitersData.recruiters);
    } catch (error) {
      if (currentId === requestIdRef.current) {
        onSearchResults([]);
      }
    } finally {
      if (currentId === requestIdRef.current) {
        setRecruiterLoading(false);
      }
    }
  }, [onSearchResults]);

  const handleRecruiterChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length === 0) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      onSearchResults(null);
      setRecruiterLoading(false);
      return;
    }

    setRecruiterLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchRecruiters(value);
    }, 300);
  };

  const handleSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchRecruiters(searchQuery);
  };

  return (
    <div className="flex flex-col relative">
      <div className="bg-gray-200 rounded-md">
        <div className="flex flex-col sm:flex-row items-center gap-4 rounded-md py-4 sm:py-2 px-4">
          <input
            type="text"
            placeholder="Search by recruiter name"
            value={searchQuery}
            onChange={handleRecruiterChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="bg-gray-200 w-full text-base lg:text-lg md:text-lg sm:text-lg py-3 pl-3 focus:outline-none rounded-md font-semibold placeholder-[#5462A0]"
          />
          <button
            onClick={handleSearch}
            disabled={recruiterLoading}
            className="flex w-full sm:w-auto justify-center items-center lg:w-1/5 bg-[#001571] text-[14px] md:text-[16px] text-white px-3 py-3 rounded-md font-semibold disabled:opacity-60 transition-opacity"
          >
            <span className="mt-1 mr-2 md:mr-4">
              <IoSearchSharp size={20} />
            </span>
            {recruiterLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
    </div>
  );
}
