// 'use client';
// import { useEffect, useState } from "react";
// import RecruiterCard from "./recruiterCard";
// import Link from "next/link";

// function Recruiters() {
//   const [recruiters, setRecruiters] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch recruiters data
//   useEffect(() => {
//     async function fetchRecruiters() {
//       try {
//         const response = await fetch("/api/recruiterdetails/all"); // Adjust endpoint as needed
//         if (!response.ok) {
//           throw new Error("Failed to fetch recruiters.");
//         }
//         const data = await response.json();
//         setRecruiters(data.recruiters);
//         setIsLoading(false);
//       } catch (error) {
//         setError(error.message);
//         setIsLoading(false);
//       }
//     }

//     fetchRecruiters();
//   }, []);

//   return (
//     <div>
//       <div>
//         <Link href="/" className="text-red-500">Go to Home</Link>
//       </div>
//       <div>
//         <Link href="/login" className="text-yellow-500">Go to Login</Link>
//       </div>
//       <h1 className="text-2xl font-bold mb-4">Recruiters</h1>

//       <div>
//       <input type="search" placeholder="Search by company name" className="border-solid border-2 border-red-500"/>
//       <button>Search</button>
//       </div>

//       {isLoading && <p>Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}
//       {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"> */}
//       <div className="container mx-auto w-full">
//         {recruiters.map((recruiter, index) => (
//           <RecruiterCard key={index} recruiter={recruiter} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Recruiters;

"use client";
import { useEffect, useState } from "react";
import RecruiterCard from "./recruiterCard";
import { useSession } from "next-auth/react";
import NavBar from "@/components/navBar";
import { IoSearchSharp } from "react-icons/io5";
import DropdownButton from "@/components/dropDownButton";
import Footer from "@/components/Footer";

function Recruiters() {
  const { data: session, status } = useSession();

  const [recruiters, setRecruiters] = useState([]);
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
        }
        const data = await response.json();
        setRecruiters(data.recruiters);
        setFilteredRecruiters(data.recruiters);
        // setIsLoading(false);
      } catch (error) {
        setError(error.message);
        // setIsLoading(false);
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
      <div className="bg-gray-50 w-full flex items-center justify-center">
        <div className="min-h-screen w-[1280px] space-y-5 py-16">
          <div className="mb-8 sm:justify-center">
            <h1 className="text-4xl font-bold text-[#8A93BE] mt-28">
              Find Your{" "}
              <span className="font-bold text-[#001571]">Perfect </span>
              Recruiter.
            </h1>
          </div>

          <div className="bg-[#e6e8f1] h-auto p-2">
            <div className="flex items-center gap-4 w-full flex-wrap">
              {/* Input Field */}
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by job title, keywords, or company."
                className="bg-gray-200 px-4 py-2 flex-grow rounded-md focus:outline-none font-semibold placeholder-[#5462A0]"
              />


              {/* Search Button */}
              <button className="flex w-full lg:w-1/5 md:w-1/5 sm:w-1/5  bg-[#001571] text-white px-6 py-3 rounded-md font-semibold">
                <span className="mt-1 mr-4 ">
                  <IoSearchSharp size={20} />
                </span>
                Search
              </button>
            </div>
          </div>


          <div className="grid grid-rows-1 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 flex-wrap justify-center gap-4 mb-8">
            <DropdownButton
              buttonName="Industry"
              dropdownItems={["Industry 1", "Industry 2", "Industry 3"]}
              onSelect={handleSelect}
            />
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

          <div className="w-full pt-20 ">
            {filteredRecruiters.length > 0 ? (
              filteredRecruiters.map((recruiter, index) => (
                <RecruiterCard key={index} recruiter={recruiter} />
              ))
            ) : (
              <p className="text-lg text-center font-bold  py-20">
                Loading recruiters...
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Recruiters;
