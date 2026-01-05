"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import PressReleaseCard from "@/components/PressReleaseCard";
import { IoSearchSharp } from "react-icons/io5";
import JobLoading from "./jobLoading";

function PressReleaseClient({ initialPressreleases = [] }) {
  const [pressReleases, setPressReleases] = useState([]);
  const [pressreleases, setPressreleases] = useState(initialPressreleases);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredPressreleases, setFilteredPressreleases] =
    useState(initialPressreleases);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pressPerPage = 16;

  useEffect(() => {
    setFilteredPressreleases(
      pressreleases.filter((pressrelease) =>
        pressrelease.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, pressreleases]);

  useEffect(() => {
    async function fetchPressReleases() {
      try {
        const response = await fetch("/api/pressrelease/all");
        if (!response.ok) throw new Error("Failed to fetch press releases.");
        const data = await response.json();
        setPressReleases(data.pressreleases);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    }
    fetchPressReleases();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const totalPages = Math.ceil(
    (filteredPressreleases?.length || 0) / pressPerPage
  );
  const indexOfLastpress = currentPage * pressPerPage;
  const indexOfFirstpress = indexOfLastpress - pressPerPage;
  const currentpress = filteredPressreleases.slice(
    indexOfFirstpress,
    indexOfLastpress
  );

  return (
    <>
      <section className="bg-[#F5F5F5] w-full flex flex-col items-center pb-15">
        <div className="h-screen w-full absolute bg-white">
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
        <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] space-y-5 pb-8 pt-16 z-[2]">
          <div className="mb-8 sm:justify-center">
            <h1 className="text-4xl font-bold text-[#27282d] mt-28">
              Latest{" "}
              <span className="font-bold text-[#001571]">Press Releases</span>
            </h1>
          </div>
          <div className="flex-grow mt-16">
            <div className="bg-[#E6E8F1] flex items-center pl-10 pr-10 mb-5 py-4 rounded-2xl shadow-sm w-full">
              <IoSearchSharp size={25} className="text-[#001571]" />
              <input
                type="text"
                placeholder="Search Press Releases..."
                className="ml-4 text-[#8A93BE] bg-[#E6E8F1] font-bold outline-none w-full"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="grid w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] mt-20 z-[1]">
          {isLoading ? (
            <JobLoading />
          ) : error ? (
            <p className="text-lg font-bold text-red-500">{error}</p>
          ) : pressReleases.length > 0 ? (
            <div className="grid xl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-4 pb-5">
              {pressReleases.map((release, index) => (
                <PressReleaseCard key={index} release={release} />
              ))}
            </div>
          ) : (
            <div className="w-full text-center py-20">
              <p className="text-lg font-bold">No press releases found.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default PressReleaseClient;
