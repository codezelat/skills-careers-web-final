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
      filtered = filtered.filter(
        (recruiter) =>
          (recruiter.category || recruiter.industry)?.toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter((recruiter) => {
        // Match by full location string (for backward compatibility)
        if (
          recruiter.location?.toLowerCase() === selectedLocation.toLowerCase()
        ) {
          return true;
        }
        // Match by district or province
        if (
          recruiter.district?.toLowerCase() ===
            selectedLocation.toLowerCase() ||
          recruiter.province?.toLowerCase() === selectedLocation.toLowerCase()
        ) {
          return true;
        }
        // Match by country
        if (
          recruiter.country?.toLowerCase() === selectedLocation.toLowerCase()
        ) {
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

  const categories = [
    ...new Set(recruiters.map((r) => r.category || r.industry)),
  ].filter(Boolean);
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
            dropdownItems={["All Categories", ...categories]}
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
  );
}
