"use client";
import { useState, useEffect } from "react";
import { handleCloseForm, handleOpenForm } from "@/handlers";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import AdminNavBar from "../AdminNav";
import JobseekerCard from "./JobseekerCard";
import JobseekerProfile from "./JobseekerProfile";
import AddJobseeker from "./AddJobseeker";

function JobseekersPanel() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [activeSection, setActiveSection] = useState("jobseekers");

  const [jobseekers, setJobseekers] = useState([]);
  const [filteredJobseekers, setFilteredJobseekers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedJobseekerId, setSelectedJobseekerId] = useState(null);

  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  });

  useEffect(() => {
    const fetchJobseekers = async () => {
      try {
        const response = await fetch("/api/jobseekerdetails");
        const data = await response.json();
        setJobseekers(data.jobseekers);
        setFilteredJobseekers(data.jobseekers);
      } catch (error) {
        console.error("Error fetching Job Seekers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobseekers();
  }, []);

  // Handle search query change
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredJobseekers(
      jobseekers.filter(
        (jobseeker) =>
          jobseeker.firstName.toLowerCase().includes(query) ||
          jobseeker.lastName.toLowerCase().includes(query) ||
          jobseeker.position.toLowerCase().includes(query) ||
          jobseeker.address.toLowerCase().includes(query)
      )
    );
  };

  const handleJobseekerSelect = (id) => {
    setSelectedJobseekerId(id);
  };

  const handleCloseProfile = () => {
    setSelectedJobseekerId(null);
  };

  if (loading) {
    return (
      <div className="text-sm text-purple-600">Loading Job Seekers...</div>
    );
  }

  return (
    <div className="p-4">
      {/* Title Bar */}
      <div className="h-[10vh] flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Seekers</h1>
        <input
          type="search"
          placeholder="Search by job name"
          className="px-2 py-2 w-96 text-center bg-slate-100 border-solid border-2 border-slate-100 outline-none rounded-lg"
        />
        <p className="text-purple-600 font-semibold">
          {session?.user?.name} | {session?.user?.email}
        </p>
      </div>

      {/* Content */}
      <div className="h-[90vh] space-y-6">
        <div className="h-full grid lg:grid-cols-5 md:grid-cols-5 sm:grid-cols-1 lg:gap-4 md:gap-4 sm:gap-0">
          <div className="bg-slate-100 mb-4 p-6 rounded-lg shadow-md">
            <AdminNavBar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>
          <div className="lg:col-span-4 md:col-span-4 sm:col-span-1 bg-slate-100 mb-4 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-purple-600 font-semibold">
                Jobseekers
              </h2>
              <button
                onClick={handleOpenForm(setIsFormVisible)}
                className="px-4 py-2 bg-purple-600 border-2 border-purple-600 text-white font-semibold hover:border-purple-600 hover:bg-white hover:text-purple-600 rounded transition-colors"
              >
                Add New
              </button>
              {isFormVisible && (
                <AddJobseeker onClose={handleCloseForm(setIsFormVisible)} />
              )}
            </div>
            <input
              type="search"
              placeholder="Search by name, position, location"
              className="px-10 py-2 mb-6 w-full text-left bg-white outline-none rounded-lg"
              value={searchQuery}
              onChange={handleSearchChange}
            />

            {selectedJobseekerId && (
              <JobseekerProfile
                jobseekerId={selectedJobseekerId}
                Close={handleCloseProfile}
              />
            )}

            <div className="grid gap-4 grid-cols-1">
              {filteredJobseekers.length > 0 ? (
                filteredJobseekers.map((jobseeker) => (
                  <JobseekerCard
                    key={jobseeker._id}
                    jobseeker={jobseeker}
                    onViewJobSeeker={() => handleJobseekerSelect(jobseeker._id)}
                  />
                ))
              ) : (
                <p className="text-lg text-center font-bold text-red-500 py-20">
                  No jobseekers found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobseekersPanel;
