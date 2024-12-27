"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import JobCard from "@/components/jobCard";
import NavBar from "@/components/navBar";

function RecruiterProfile({ slug }) {
  const [recruiterDetails, setRecruiterDetails] = useState({
    id: "",
    recruiterName: "",
    employeeRange: "",
    email: "",
    contactNumber: "",
    website: "",
    companyDescription: "",
    industry: "",
    location: "",
    logo: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    x: "",
  });
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiterDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch recruiter details
        const recruiterResponse = await fetch(`/api/recruiterdetails/get?id=${slug}`);
        const recruiterData = await recruiterResponse.json();
        if (!recruiterResponse.ok) {
          throw new Error(recruiterData.message || "Failed to fetch recruiter details");
        }
        setRecruiterDetails(recruiterData);

        // Fetch jobs for this recruiter
        const jobsResponse = await fetch(`/api/job/all?recruiterId=${slug}`);
        const jobsData = await jobsResponse.json();
        if (!jobsResponse.ok) {
          throw new Error(jobsData.message || "Failed to fetch jobs");
        }
        setJobs(jobsData.jobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchRecruiterDetails();
    }
  }, [slug]);

  if (isLoading) {
    return <div className="text-center py-4">Loading Recruiter details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Error: {error}</p>
        <Link
          href="/recruiter"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Return to Recruiter List
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid justify-center">
        <NavBar />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <Image
          src={recruiterDetails.logo || "/images/default-image.jpg"}
          alt="Logo"
          width={100}
          height={100}
          className="rounded-full object-cover mb-4 shadow-lg"
        />
        <h1 className="text-3xl font-bold mb-6">
          {recruiterDetails.recruiterName}
        </h1>
        <div>
          <p className="text-sm text-gray-600">Website</p>
          <p className="text-base font-bold text-black mb-3">{recruiterDetails.website}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Industry</p>
          <p className="text-base font-bold text-black mb-3">{recruiterDetails.industry}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Employee Range</p>
          <p className="text-base font-bold text-black mb-3">{recruiterDetails.employeeRange}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Description</p>
          <p className="text-base font-bold text-black mb-3">{recruiterDetails.companyDescription}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Contact Number</p>
          <p className="text-base font-bold text-black mb-3">{recruiterDetails.contactNumber}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="text-base font-bold text-black mb-3">{recruiterDetails.email}</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 my-2">
        <h1 className="text-2xl font-bold mb-4">Open Jobs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {jobs.length > 0 ? (
            jobs.map((job, index) => <JobCard key={index} job={job} />)
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No open jobs available at this time.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecruiterProfile;