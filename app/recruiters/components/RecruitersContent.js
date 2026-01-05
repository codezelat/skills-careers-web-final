"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import NavBar from "@/components/navBar";
import { IoSearchSharp } from "react-icons/io5";
import Image from "next/image";
import RecruiterSearch from "@/components/RecruiterSearch";
import DropdownButton from "@/components/dropDownButton";
import RecruiterCard from "../recruiterCard";
import RecruiterLoading from "@/components/RecruiterLoading";
import jobCategories from "@/data/jobCategories.json";

export default function RecruitersContent() {
  const { data: session, status } = useSession();
  const [recruiters, setRecruiters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredRecruiters, setFilteredRecruiters] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    async function fetchRecruiters() {
      try {
        const response = await fetch("/api/recruiterdetails/all");
        if (!response.ok) throw new Error("Failed to fetch recruiters.");

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

  useEffect(() => {
    // If we have search results, use those
    if (searchResults !== null) {
      setFilteredRecruiters(searchResults);
      return;
    }

    // Otherwise, filter based on dropdowns
    let filtered = recruiters;

    if (selectedCategory) {
      filtered = filtered.filter((recruiter) => {
        const recruiterCategory =
          (recruiter.category || recruiter.industry)?.toLowerCase().trim() ||
          "";
        const selected = selectedCategory.toLowerCase().trim();
        // Exact match or partial match for better compatibility
        return (
          recruiterCategory === selected ||
          recruiterCategory.includes(selected) ||
          selected.includes(recruiterCategory)
        );
      });
    }

    if (selectedLocation) {
      filtered = filtered.filter((recruiter) => {
        const selectedLower = selectedLocation.toLowerCase().trim();

        // Match by full location string (for backward compatibility)
        if (recruiter.location?.toLowerCase().trim() === selectedLower) {
          return true;
        }
        // Match by district or province
        if (
          recruiter.district?.toLowerCase().trim() === selectedLower ||
          recruiter.province?.toLowerCase().trim() === selectedLower
        ) {
          return true;
        }
        // Match by country
        if (recruiter.country?.toLowerCase().trim() === selectedLower) {
          return true;
        }
        return false;
      });
    }

    setFilteredRecruiters(filtered);
  }, [selectedCategory, selectedLocation, recruiters, searchResults]);

  // Extract unique locations - include districts, provinces, and countries
  const getUniqueLocations = () => {
    const locationSet = new Set();
    recruiters.forEach((r) => {
      if (r.district) locationSet.add(r.district);
      if (r.province) locationSet.add(r.province);
      if (r.country && r.country !== "Sri Lanka") locationSet.add(r.country);
      if (r.location && !r.district && !r.province) locationSet.add(r.location);
    });
    return Array.from(locationSet).filter(Boolean).sort();
  };

  const locations = getUniqueLocations();

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div className="bg-[#F5F5F5] w-full flex justify-center z-0">
      <div className="h-screen w-full absolute bg-white z-[1]">
        <Image
          src="/images/bg.jpg"
          alt="Background Image"
          fill
          style={{ objectFit: "contain", objectPosition: "right top" }}
          quality={100}
          priority
          className="w-full h-full opacity-5"
        />
      </div>
      <div className="z-[2] min-h-screen w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] space-y-5 py-16">
        <div className="mb-8 sm:justify-center">
          <h1 className="text-4xl font-bold text-[#8A93BE] mt-28">
            Find Your <span className="font-bold text-[#001571]">Perfect </span>
            Recruiter.
          </h1>
        </div>

        <div className="bg-[#e6e8f1] p-2 md:p-0 rounded-md z-10">
          <RecruiterSearch onSearchResults={handleSearchResults} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-8">
          <DropdownButton
            buttonName="Category"
            selected={selectedCategory || "Category"}
            dropdownItems={[
              "All Categories",
              ...jobCategories.map((cat) => cat.name),
            ]}
            onSelect={(category) => {
              setSelectedCategory(
                category === "All Categories" ? null : category
              );
              setSearchResults(null); // Reset search results when changing filters
            }}
          />
          <DropdownButton
            buttonName="Location"
            selected={selectedLocation || "Location"}
            dropdownItems={["All Locations", ...locations]}
            onSelect={(location) => {
              setSelectedLocation(
                location === "All Locations" ? null : location
              );
              setSearchResults(null); // Reset search results when changing filters
            }}
          />
        </div>

        {/* Active Filters Display */}
        {(selectedCategory || selectedLocation) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 mr-2">
                <svg
                  className="w-4 h-4 text-[#001571]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="text-sm font-semibold text-[#001571]">
                  Filters:
                </span>
              </div>
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-[#001571]/20 text-[#001571] shadow-sm hover:shadow-md transition-all duration-200">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className="max-w-[200px] truncate">
                    {selectedCategory}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchResults(null);
                    }}
                    className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                    title="Remove filter"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              )}
              {selectedLocation && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-[#001571]/20 text-[#001571] shadow-sm hover:shadow-md transition-all duration-200">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="max-w-[200px] truncate">
                    {selectedLocation}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedLocation(null);
                      setSearchResults(null);
                    }}
                    className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                    title="Remove filter"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedLocation(null);
                  setSearchResults(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all duration-200 ml-auto"
                title="Clear all filters"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Clear All
              </button>
            </div>
          </div>
        )}

        <div className="w-full pt-8">
          {/* Results Count */}
          {!isLoading && (
            <div className="mb-4">
              <p className="text-[#001571] font-semibold">
                {filteredRecruiters.length}{" "}
                {filteredRecruiters.length === 1 ? "Recruiter" : "Recruiters"}{" "}
                Found
                {(selectedCategory || selectedLocation) && (
                  <span className="text-gray-600 font-normal"> (filtered)</span>
                )}
              </p>
            </div>
          )}

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
  );
}
