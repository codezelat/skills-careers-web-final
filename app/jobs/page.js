"use client"; 
import { useEffect, useState } from "react";
import JobCard from "@/components/jobCard";
import NavBar from "@/components/navBar";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch jobs data
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/job/all"); // Adjust endpoint as needed
        if (!response.ok) {
          throw new Error("Failed to fetch jobs.");
        }
        const data = await response.json();
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetchJobs();
  }, []);

  // Handle search query change
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredJobs(
      jobs.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="p-4">
      <div className="grid justify-center">
        <NavBar />
      </div>
      <div className="grid justify-items-center">
        <h1 className="text-2xl font-bold mb-4">Jobs</h1>
        <div className="mb-4">
          <input
            type="search"
            placeholder="Search by job name or Job location"
            className="px-2 py-1 w-96 text-center border-solid border-2 border-white outline-none"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="container mx-auto w-full">
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => <JobCard key={index} job={job} />)
          ) : (
            <p className="text-lg text-center font-bold text-red-500 py-20">No Jobs found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;
