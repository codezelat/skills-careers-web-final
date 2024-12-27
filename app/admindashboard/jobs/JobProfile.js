// JobProfile.js
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import JobEditForm from "./JobEdit";
import ApplicationCard from "./ApplicationCard";

function JobProfile({ jobId, Close }) {
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
    recruiterName: "",
    email: "",
    logo: "",
  });

  const [applications, setApplications] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/job/get?id=${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJobDetails(data);

          // Fetch recruiter details after getting job details
          if (data.recruiterId) {
            const recruiterResponse = await fetch(
              `/api/recruiterdetails/get?id=${data.recruiterId}`
            );
            if (recruiterResponse.ok) {
              const recruiterData = await recruiterResponse.json();
              setRecruiterDetails(recruiterData);
            }
          }

          if (data.recruiterId && jobId) {
            // Fetch applications after getting job details
            const applicationsResponse = await fetch(
              `/api/applications?jobId=${jobId}&recruiterId=${data.recruiterId}`
            );
            const applicationsData = await applicationsResponse.json();

            if (!applicationsResponse.ok) {
              throw new Error(
                applicationsData.message || "Failed to fetch applications"
              );
            }
            setApplications(applicationsData.applications);
          }
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const handleViewRecruiter = () => {
    // Open the recruiter profile in a new tab
    window.open(`/recruiters/${jobDetails.recruiterId}`, "_blank");
  };

  const handleJobSelect = () => {
    setSelectedJobId(jobDetails.id);
  };

  const handleCloseProfile = () => {
    setSelectedJobId(null);
  };

  return (
    <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-[90vh] w-3/4 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-lg p-6 mb-6">
      {selectedJobId && (
        <JobEditForm jobId={selectedJobId} Close={handleCloseProfile} />
      )}

      {isLoading && (
        <div className="text-center py-4">Loading job details...</div>
      )}

      <div className="flex justify-between">
        <Image
          src={recruiterDetails.logo || "/images/default-image.jpg"}
          alt="Logo"
          width={100}
          height={100}
          className="rounded-full object-cover mb-4 shadow-lg"
        />
        <button
          onClick={Close}
          className="px-2 py-1 h-12 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          Close ✕
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-1">{jobDetails.jobTitle}</h1>
      <h2 className="text-xl font-semibold mb-4">
        {recruiterDetails.recruiterName}
      </h2>
      <div className="flex">
        <button
          onClick={handleViewRecruiter}
          className="bg-white border-2 border-blue-500 hover:border-blue-900 hover:text-blue-900 transition-colors rounded-md text-blue-500 px-5 py-2 mb-6 ml-2"
        >
          View Company Profile
        </button>
      </div>
      <div className="flex">
        <button
          onClick={handleJobSelect}
          className="py-1 ml-auto w-24 bg-white border-2 border-green-500 text-green-500 hover:border-green-500 hover:bg-green-500 hover:text-white rounded transition-colors"
        >
          Edit
        </button>
      </div>
      <div className="space-y-4">
        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-4">
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
            <h2 className="text-xl font-semibold mb-2">Key Responsibilities</h2>
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
      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((application) => (
            <ApplicationCard key={application._id} application={application} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No applications found for this job.
          </div>
        )}
      </div>
    </div>
  );
}

export default JobProfile;
