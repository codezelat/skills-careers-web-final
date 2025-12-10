// components/PressReleaseSection.js
"use client";
import Link from "next/link";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function PressReleaseSection() {
  const [pressreleases, setPressreleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPressReleases() {
      try {
        const response = await fetch("/api/pressrelease/all");
        if (!response.ok) {
          console.error(
            "Response not OK:",
            response.status,
            response.statusText
          );
          throw new Error("Failed to fetch press releases");
        }
        const data = await response.json();
        console.log("Fetched press releases:", data);
        setPressreleases(data.pressreleases || []);
      } catch (error) {
        console.error("Error fetching press releases:", error);
        setPressreleases([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPressReleases();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 xl:px-0 py-12">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:h-[600px]">
          <div className="lg:col-span-3 bg-gray-200 animate-pulse rounded-2xl h-[400px] lg:h-full"></div>
          <div className="lg:col-span-2 flex flex-col gap-6 h-full">
            <div className="flex-1 bg-gray-200 animate-pulse rounded-2xl h-[200px] lg:h-auto"></div>
            <div className="flex-1 bg-gray-200 animate-pulse rounded-2xl h-[200px] lg:h-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure there are at least 3 press releases to match the layout
  const featuredPressRelease = pressreleases[0] || null;
  const smallerPressReleases = pressreleases.slice(1, 3);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 xl:px-0 py-12">
      <div className="flex justify-between items-end mb-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-[#33448D] font-bold text-3xl">Latest Press Releases</h2>
          <div className="h-1 w-20 bg-[#33448D] rounded-full"></div>
        </div>

        <Link href="/pressRelease" className="group flex items-center gap-2 text-[#001571] font-bold text-lg hover:text-[#33448D] transition-colors">
          View All
          <BsArrowUpRightCircleFill className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:h-[600px]">
        {/* Featured Press Release (Large Section) */}
        <Link
          href={featuredPressRelease ? `/pressRelease/${featuredPressRelease._id}` : "#"}
          className="lg:col-span-3 flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group h-full"
        >
          <div className="relative w-full h-64 lg:h-[60%] overflow-hidden">
            <Image
              src={featuredPressRelease?.image || "/newsImage.png"}
              alt="Featured Press Release"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
          <div className="p-6 lg:p-8 flex flex-col flex-1">
            <div className="flex-1">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#33448D] transition-colors">
                {featuredPressRelease?.title || "No Featured Press Release"}
              </h3>
              <p className="text-gray-600 text-base lg:text-lg line-clamp-3 lg:line-clamp-4">
                {featuredPressRelease?.description || "No description available."}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-gray-500 text-sm font-medium">
              <span>{new Date(featuredPressRelease?.createdAt || Date.now()).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="text-[#33448D] group-hover:translate-x-2 transition-transform">Read article &rarr;</span>
            </div>
          </div>
        </Link>

        {/* Smaller Press Releases */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          {smallerPressReleases.map((pressrelease, index) => (
            <Link
              key={index}
              href={`/pressRelease/${pressrelease?._id || ""}`}
              className="flex-1 flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative w-full h-40 overflow-hidden shrink-0">
                <Image
                  src={pressrelease?.image || "/newsImage.png"}
                  alt="Press Release"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#33448D] transition-colors">
                    {pressrelease?.title || "No Title"}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {pressrelease?.description || "No description available."}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-gray-400 text-xs font-medium">
                  <span>{new Date(pressrelease?.createdAt || Date.now()).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </Link>
          ))}

          {/* Fallback if less than 2 items in small list but we want to maintain grid? 
                (Optional: If pressreleases.length < 3, the layout handles it gracefully by just rendering what's there) 
            */}
        </div>
      </div>
    </div>
  );
}
