"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { GoArrowUp } from "react-icons/go";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { useSession } from "next-auth/react";

export default function DashboardStats() {
  const { data: session, status } = useSession();
  const [jobsCount, setJobsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [recruitersCount, setRecruitersCount] = useState(0);
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [jobApplications, setJobApplications] = useState(0);
  const [jobs, setJobs] = useState([]);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs count
        const jobsResponse = await fetch("/api/job/all");
        const jobsData = await jobsResponse.json();
        setJobsCount(jobsData.count);

        // Fetch applications count
        const applicationsResponse = await fetch("/api/jobapplication/all");
        const applicationsData = await applicationsResponse.json();
        setApplicationsCount(applicationsData.count);

        // Fetch recruiters count
        const recruitersResponse = await fetch("/api/recruiterdetails/all");
        const recruitersData = await recruitersResponse.json();
        setRecruitersCount(recruitersData.count);

        // Fetch candidates count
        const candidatesResponse = await fetch("/api/jobseekerdetails/all");
        const candidatesData = await candidatesResponse.json();
        setCandidatesCount(candidatesData.count);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchRecruiterDetails = async () => {
    console.log("Recruiter data started fetching.......");
    try {
      const recruiterResponse = await fetch(
        `/api/recruiterdetails/get?userId=${session?.user?.id}`
      );
      if (recruiterResponse.ok) {
        const recruiterData = await recruiterResponse.json();

        // Fetch Job Applications
        const applicationsResponse = await fetch(
          `/api/jobapplication/all?recruiterId=${recruiterData.id}`
        );

        if (!applicationsResponse.ok) {
          throw new Error("Failed to fetch jobs applications.");
        }

        const data = await applicationsResponse.json();
        setJobApplications(data.count);

        // Fetch Jobs
        const jobResponse = await fetch(
          `/api/job/all?recruiterId=${recruiterData.id}&showAll=true`
        );
        if (!jobResponse.ok) {
          throw new Error("Failed to fetch jobs.");
        }
        const jobData = await jobResponse.json();
        setJobs(jobData.jobs);
      } else {
        console.error("Failed to fetch recruiter details");
      }
    } catch (error) {
      console.error("Error fetching recruiter details:", error);
    }
  };

  useEffect(() => {
    // Fetch Recruiter Details
    if (session?.user?.role === "recruiter") {
      fetchRecruiterDetails();
    }
  }, [session?.user?.role]);

  const activeJobs = jobs.filter((job) => job.isPublished === true);
  const inactiveJobs = jobs.filter((job) => job.isPublished === false);

  return (
    <>
      {/* If admin */}
      {session?.user?.role === "admin" && (
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[
            {
              title: "Jobs",
              count: jobsCount,
              growth: "+2.5% ",
              since: "Since Yesterday",
              icon: "/portal-dashboard/flag.png",
            },
            {
              title: "Applications",
              count: applicationsCount,
              growth: "+6.5% ",
              since: "Since Yesterday",
              icon: "/portal-dashboard/document.png",
            },
            {
              title: "Recruiters",
              count: recruitersCount,
              growth: "+1.5% ",
              since: " Since Last Month",
              icon: "/portal-dashboard/buliding.png",
            },
            {
              title: "Candidates",
              count: candidatesCount,
              growth: "+1.5% ",
              since: "Since Last Month",
              icon: "/portal-dashboard/people.png",
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-semibold text-[#8A93BE] flex items-center">
                  {item.title}
                  <span className="ml-2">
                    <IoIosArrowDroprightCircle />
                  </span>
                </h2>
                <Image src={item.icon} alt="Flag icon" width={35} height={35} />
              </div>
              <div className="text-3xl font-bold text-[#001571] mt-1">
                {item.count}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* If candidate */}
      {session?.user?.role === "jobseeker" && (
        <div className="grid grid-cols-3 gap-6 mb-6">
          {[
            {
              title: "Applications",
              count: 12, // Replace with actual data if available
              growth: "+2.5% ",
              since: "Since Last Month",
              icon: "/portal-dashboard/flag.png",
            },
            {
              title: "Impressions",
              count: 221, // Replace with actual data if available
              growth: "+6.5% ",
              since: "Since Last Month",
              icon: "/portal-dashboard/document.png",
            },
            {
              title: "Profile Views",
              count: 8, // Replace with actual data if available
              growth: "+1.5% ",
              since: " Since Last Month",
              icon: "/portal-dashboard/buliding.png",
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-semibold text-[#8A93BE] flex items-center">
                  {item.title}
                  <span className="ml-2">
                    <IoIosArrowDroprightCircle />
                  </span>
                </h2>
                <Image src={item.icon} alt="Flag icon" width={35} height={35} />
              </div>
              <div className="text-3xl font-bold text-[#001571] mt-1">
                {item.count}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* If recruiter */}
      {session?.user?.role === "recruiter" && (
        <div className="grid grid-cols-3 gap-6 mb-6">
          {[
            {
              title: "Applications",
              count: jobApplications, // Use applications count
              growth: "+1.5% ",
              since: "Since Last Month",
              icon: "/portal-dashboard/document.png",
            },
            {
              title: "Active Jobs",
              count: activeJobs.length, // Use jobs count for recruiter's job posts
              growth: "+6.5% ",
              since: "Since Last Month",
              icon: "/portal-dashboard/flag.png",
            },
            {
              title: "Inactive Jobs",
              count: inactiveJobs.length, // Use jobs count for recruiter's job posts
              growth: "+6.5% ",
              since: "Since Last Month",
              icon: "/portal-dashboard/flag.png",
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-semibold text-[#8A93BE] flex items-center">
                  {item.title}
                  <span className="ml-2">
                    <IoIosArrowDroprightCircle />
                  </span>
                </h2>
                <Image src={item.icon} alt="Flag icon" width={35} height={35} />
              </div>
              <div className="text-3xl font-bold text-[#001571] mt-1">
                {item.count}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
