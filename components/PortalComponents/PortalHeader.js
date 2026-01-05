import Image from "next/image";
import { IoSearchSharp } from "react-icons/io5";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function HeaderSection() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchRef = useRef(null);
  const debounceTimerRef = useRef(null);
  
  console.log("Session Data:", session);
  console.log("Profile Image URL:", session?.user?.profileImage);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch job suggestions based on search query
  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(`/api/job/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");
      
      const data = await response.json();
      const jobs = data.jobs || [];
      
      // Fetch recruiter details for each job
      const jobsWithDetails = await Promise.all(
        jobs.slice(0, 5).map(async (job) => {
          try {
            const recruiterResponse = await fetch(`/api/recruiterdetails/get?id=${job.recruiterId}`);
            const recruiterData = await recruiterResponse.json();
            return {
              ...job,
              recruiterName: recruiterData.recruiterName || "Unknown Company",
              logo: recruiterData.logo || "/images/default-image.jpg",
            };
          } catch {
            return {
              ...job,
              recruiterName: "Unknown Company",
              logo: "/images/default-image.jpg",
            };
          }
        })
      );

      setSuggestions(jobsWithDetails);
      setShowSuggestions(jobsWithDetails.length > 0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle search submission
  const handleSearch = useCallback(async () => {
    const trimmedQuery = searchQuery.trim();
    
    // Don't search if query is empty or too short
    if (!trimmedQuery || trimmedQuery.length < 2) {
      return;
    }

    setIsSearching(true);
    
    try {
      const userRole = session?.user?.role?.toLowerCase();
      let targetPage;
      
      // Route based on user role
      if (userRole === "admin") {
        targetPage = "/Portal/jobsAdmin";
      } else if (userRole === "recruiter") {
        targetPage = "/Portal/jobsRecruiter";
      } else {
        // Job seeker or any other role goes to public jobs page
        targetPage = "/jobs";
      }
      
      // Navigate to appropriate page with search query parameter
      router.push(`${targetPage}?search=${encodeURIComponent(trimmedQuery)}`);
    } catch (error) {
      console.error("Search navigation error:", error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, router, session?.user?.role]);

  // Handle suggestion selection
  const handleSuggestionClick = (job) => {
    setShowSuggestions(false);
    setSearchQuery("");
    setSuggestions([]);
    
    // Navigate to job detail page
    const userRole = session?.user?.role?.toLowerCase();
    if (userRole === "admin") {
      router.push(`/Portal/jobsAdmin/JobProfile?id=${job._id || job.jobId}`);
    } else if (userRole === "recruiter") {
      router.push(`/Portal/jobsRecruiter/JobProfile?id=${job._id || job.jobId}`);
    } else {
      router.push(`/jobs/${job._id || job.jobId}`);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 h-[60px] ">
        {/* Left Section */}
        <Link
          href={baseUrl || "/"}
          className="bg-[#001571] flex items-center justify-center text-white h-full px-8 rounded-2xl font-semibold text-[18px]"
        >
          <h1>SKILLS CAREERS</h1>
        </Link>

        {/* Middle Section */}
        <div className="flex-grow mx-8 h-full relative" ref={searchRef}>
          <div className="bg-white flex items-center pl-8 pr-4 h-full rounded-2xl shadow-sm w-full">
            <button 
              onClick={handleSearch}
              disabled={isSearching || searchQuery.trim().length < 2}
              className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Search"
              type="button"
            >
              <IoSearchSharp size={25} className="text-gray-600" />
            </button>
            <input
              type="text"
              placeholder="Search Job Listings..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              disabled={isSearching}
              className="ml-2 text-gray-500 outline-none w-full text-[16px] disabled:opacity-50"
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-lg max-h-[400px] overflow-y-auto z-50 border border-gray-200">
              {isLoadingSuggestions ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-pulse">Loading...</div>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="py-2">
                  {suggestions.map((job, index) => (
                    <div
                      key={job._id || job.jobId || index}
                      onClick={() => handleSuggestionClick(job)}
                      className="px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-4 border-b border-gray-100 last:border-b-0"
                    >
                      <Image
                        src={job.logo}
                        alt={job.recruiterName}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#001571] text-[14px]">
                          {job.jobTitle}
                        </h3>
                        <p className="text-gray-500 text-[12px]">
                          {job.recruiterName} • {job.location}
                        </p>
                      </div>
                      <div className="text-[12px] text-gray-400">
                        {job.jobTypes?.[0] || "Full-Time"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No jobs found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center bg-white px-8 h-full rounded-2xl shadow-sm gap-4">
          <div className="text-left">
            <p className="font-bold text-[#001571] text-[16px]">
              {session?.user?.firstName} {session?.user?.lastName}
            </p>
            <p className="text-sm font-bold text-gray-400">
              {session?.user?.role}
            </p>
          </div>
          {session?.user?.profileImage ? (
            <Image
              src={session?.user?.profileImage}
              alt={`${session?.user?.role || "User"} Profile`}
              width={50}
              height={50}
              className="rounded-full border-2 border-[#001571]"
            />
          ) : (
            <Image
              src="/default-avatar.jpg"
              alt={`${session?.user?.role || "User"} Profile`}
              width={50}
              height={50}
              className="rounded-full border-2 border-[#001571]"
            />
          )}
        </div>
      </div>
    </>
  );
}
