"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ApplicationCard from "./applicationcard";
import { useEffect, useState } from "react";
import NavBar from "@/components/navBar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

function Applications() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

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
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // console.log("Jobs recruiter ID is: " + jobDetails.recruiterId);

  // Handle authentication and authorization redirection
  useEffect(() => {
    if (status === "unauthenticated") {
      alert("Please Login to view");
      router.push("/login");
      return;
    }

    if (session?.user?.role === "jobseeker") {
      alert("Only Recruiters can view applications");
      router.push("/");
      return;
    }
  }, [status, session, router, jobDetails.recruiterId]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/job/get?id=${jobId}`);
        const data = await response.json();

        console.log("Jobs Recruiter ID: " + data.recruiterId);
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch job details");
        }
        setJobDetails(data);

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
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

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

  const date = new Date(jobDetails.createdAt).getDate();
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date(jobDetails.createdAt);
  let month = monthName[d.getMonth()];
  const year = new Date(jobDetails.createdAt).getFullYear();
  const postedDate = `${date} ${month} ${year}`;

  return (
    <>
      <NavBar />
      <div className="mx-auto max-w-screen-xl space-y-5 px-4 pb-8 pt-16 sm:px-6">
        <div className="bg-white shadow-lg rounded-lg p-6 my-4">
          <div className="flex justify-between">
            <div className="flex gap-8 items-center">
              <Image
                src={recruiterDetails.logo || "/images/default-image.jpg"}
                alt="Recruiter Logo"
                width={100}
                height={100}
                className="rounded-full object-cover mb-4 shadow-lg"
              />
              <h1 className="text-xl font-bold mb-4 text-center">
                Job & Application Details of {jobDetails.jobTitle}
              </h1>
            </div>
            <Link href={`/jobs/edit/${jobDetails.id}`}>
              <button className="px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors">
                Edit Job
              </button>
            </Link>
          </div>
          <div className="space-y-4 mt-10">
            <div className="grid grid-cols-2 items-center space-x-2">
              <div className="flex space-x-2">
                <h2 className="font-semibold">Job Name:</h2>
                <p className="text-gray-700">{jobDetails.jobTitle}</p>
              </div>
              <div className="flex space-x-2">
                <h2 className="font-semibold">Total Applications:</h2>
                <p className="text-gray-700">{applications.length}</p>
              </div>
            </div>
            <div>
              <h2 className="font-semibold">Location</h2>
              <p className="text-gray-700">{jobDetails.location}</p>
            </div>
            <div>
              <h2 className="font-semibold">Job Type</h2>
              <p className="text-gray-700">{jobDetails.jobTypes}</p>
            </div>
            <div>
              <h2 className="font-semibold">Job Description</h2>
              <p className="text-gray-700">{jobDetails.jobDescription}</p>
            </div>
            <div>
              <h2 className="font-semibold">Key Responsibilities</h2>
              <p className="text-gray-700">{jobDetails.keyResponsibilities}</p>
            </div>
            <div>
              <h2 className="font-semibold">Posted Date</h2>
              <p className="text-gray-700">{postedDate}</p>
            </div>
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
    </>
  );
}

export default Applications;
