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

function Recruiters() {
  const { data: session, status } = useSession();

  const [recruiters, setRecruiters] = useState([]);
  const [filteredRecruiters, setFilteredRecruiters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  return (
    <>
      <NavBar />
      <div className="p-4">
        <div className="grid justify-items-center">
          <h1 className="text-2xl font-bold mb-4">Recruiters</h1>

          <div className="mb-4">
            <input
              type="search"
              placeholder="Search by company name, industry, location"
              className="px-2 py-1 w-96 text-center border-solid border-2 border-white outline-none"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="container mx-auto w-full">
          {filteredRecruiters.length > 0 ? (
            filteredRecruiters.map((recruiter, index) => (
              <RecruiterCard key={index} recruiter={recruiter} />
            ))
          ) : (
            <p className="text-lg text-center font-bold text-red-500 py-20">
              No recruiters found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Recruiters;
