"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NavBar from "@/components/navBar";

function JobProfile({ slug }) {
  const router = useRouter();
  const [jobDetails, setJobDetails] = useState({
    id: "",
    jobTitle: "",
    recruiterId: "",
    location: "",
    jobTypes: "",
    jobDescription: "",
    keyResponsibilities: "",
    createdAt: "",
  });

  const [recruiterDetails, setRecruiterDetails] = useState({
    id: "",
    recruiterName: "",
    email: "",
    logo: "",
  });

  const [error, setError] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/job/get?id=${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch job details");
        }

        setJobDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchJobDetails();
    }
  }, [slug]);

  useEffect(() => {
    const fetchRecruiterDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/recruiterdetails/get?id=${jobDetails.recruiterId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch job details");
        }

        setRecruiterDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobDetails.recruiterId) {
      fetchRecruiterDetails();
    }
  }, [jobDetails.recruiterId]);

  if (isLoading) {
    return <div className="text-center py-4">Loading job details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Error: {error}</p>
        <Link
          href="/jobs"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Return to Jobs List
        </Link>
      </div>
    );
  }

  const handleViewApplication = () => {
    router.push(`/jobs/${jobDetails.id}/apply`);
  };
  
  const handleViewRecruiter = () => {
    router.push(`/recruiters/${recruiterDetails.id}`);
  };

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
        
        <h1 className="text-3xl font-bold mb-1">{jobDetails.jobTitle}</h1>
        <h2 className="text-xl font-semibold mb-4">
          {recruiterDetails.recruiterName}
        </h2>
        <div className="flex">

        <button
          onClick={handleViewApplication}
          className="bg-blue-500 border-2 border-blue-500 hover:bg-blue-900 hover:border-blue-900 transition-colors rounded-md text-white px-5 py-2 mb-6"
        >
          Apply Now
        </button>
        <button
          onClick={handleViewRecruiter}
          className="bg-white border-2 border-blue-500 hover:border-blue-900 hover:text-blue-900 transition-colors rounded-md text-blue-500 px-5 py-2 mb-6 ml-2"
        >
          View Company Profile
        </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-gray-600">Location</h2>
              <p className="font-medium">{jobDetails.location}</p>
            </div>
            <div>
              <h2 className="text-gray-600">Job Type</h2>
              <p className="font-medium">{jobDetails.jobTypes}</p>
            </div>
          </div>

          {jobDetails.jobDescription && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Job Description</h2>
              <p className="whitespace-pre-wrap">{jobDetails.jobDescription}</p>
            </div>
          )}

          {jobDetails.keyResponsibilities && (
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Key Responsibilities
              </h2>
              <p className="whitespace-pre-wrap">
                {jobDetails.keyResponsibilities}
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t">
            <p className="text-gray-600">
              Posted by: {recruiterDetails.recruiterName} |{" "}
              {recruiterDetails.email}
            </p>
            {jobDetails.createdAt && (
              <p className="text-gray-600">
                Posted on: {new Date(jobDetails.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobProfile;
