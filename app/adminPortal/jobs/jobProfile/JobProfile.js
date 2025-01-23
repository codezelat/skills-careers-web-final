// JobProfile.js
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import JobEditForm from "../JobEdit";
import ApplicationCard from "../ApplicationCard";

function JobProfile({ job, Close }) {
  const [jobDetails, setJobDetails] = useState({
    _id: "",
    jobTitle: "",
    recruiterId: "",
    location: "",
    jobCategory: "",
    jobTypes: "",
    jobDescription: "",
    keyResponsibilities: "",
    jobExperience: "",
    salaryRs: "",
    salaryCents: "",
    createdAt: "",
  });

  const [recruiterDetails, setRecruiterDetails] = useState({
    recruiterName: "",
    email: "",
    profileImage: "",
  });

  const [applications, setApplications] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    setJobDetails(job);
  }, [job]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch recruiter details after getting job details
        if (jobDetails.recruiterId) {
          const recruiterResponse = await fetch(
            `/api/recruiter/get?id=${jobDetails.recruiterId}`
          );
          if (recruiterResponse.ok) {
            const data = await recruiterResponse.json();
            setRecruiterDetails(data.recruiter);
          }
        }

        if (jobDetails.recruiterId && jobDetails._id) {
          // Fetch applications after getting job details
          const applicationsResponse = await fetch(
            `/api/jobapplication/get?jobId=${jobDetails._id}&recruiterId=${jobDetails.recruiterId}`
          );
          const applicationsData = await applicationsResponse.json();

          if (!applicationsResponse.ok) {
            throw new Error(
              applicationsData.message || "Failed to fetch applications"
            );
          }
          setApplications(applicationsData.applications);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobDetails._id) {
      fetchJobDetails();
    }
  }, [jobDetails._id]);

  const handleViewRecruiter = () => {
    // Open the recruiter profile in a new tab
    window.open(`/recruiters/${jobDetails.recruiterId}`, "_blank");
  };

  const handleJobSelect = () => {
    setSelectedJob(jobDetails);
  };

  const handleCloseProfile = () => {
    setSelectedJob(null);
  };

  return (
    <>
      {selectedJob && (
        <JobEditForm job={selectedJob} onClose={handleCloseProfile} />
      )}
      <div className="fixed inset-0 bg-black/50 z-20">
        <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 h-[95vh] w-11/12 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-lg p-6 mb-6">
          {isLoading && (
            <div className="text-center py-4">Loading job details...</div>
          )}

          <div className="flex justify-between">
            <Image
              src={recruiterDetails.profileImage || "/images/default-image.jpg"}
              alt="Profile Image"
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
                <h2 className="text-gray-600">Job Category</h2>
                <p className="font-medium">{jobDetails.jobCategory}</p>
              </div>
              <div>
                <h2 className="text-gray-600">Job Type</h2>
                <p className="font-medium">{jobDetails.jobTypes}</p>
              </div>
            </div>
            <div>
              <h2 className="text-gray-600">Experience</h2>
              <p className="font-medium">{jobDetails.jobExperience}</p>
            </div>
            <div>
              <h2 className="text-gray-600">Salary</h2>
              <p className="font-medium">
                {jobDetails.salaryRs === ""
                  ? "Not Applicable"
                  : `LKR. ${jobDetails.salaryRs}.${jobDetails.salaryCents}`}
              </p>
            </div>
            {jobDetails.jobDescription && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Job Description</h2>
                <p className="whitespace-pre-wrap">
                  {jobDetails.jobDescription}
                </p>
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
                  Posted on:{" "}
                  {new Date(jobDetails.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {applications.length > 0 ? (
              applications.map((application) => (
                <ApplicationCard
                  key={application._id}
                  application={application}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No applications found for this job.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default JobProfile;
