"use client";
import { useEffect, useState } from "react";
import { RiDownloadLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PortalApplicationCard({ application }) {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const [recruiterdetails, setRecruiterdetails] = useState([]);

  const handleView = () => {
    router.push(`/Portal/jobApplications/${application._id}`);
  };

  const handleViewJob = () => {
    router.push(`/Portal/jobApplications/job/${application.jobId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;

      try {
        const recruiterUrl = `/api/recruiterdetails/get?id=${application.recruiterId}`;
        const recruiterResponse = await fetch(recruiterUrl);
        if (!recruiterResponse.ok) {
          console.warn(
            "Recruiter details not found for ID:",
            application.recruiterId
          );
          setRecruiterdetails({}); // Set empty object to avoid undefined errors
          return;
        }
        const recruiterdata = await recruiterResponse.json();
        setRecruiterdetails(recruiterdata);
        console.log("recruiter : ", recruiterdata);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
      }
    };

    if (session?.user?.id) {
      fetchData();
    }
  }, [session?.user?.id, application.recruiterId]);

  const date = new Date(application.appliedAt).getDate();
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
  const d = new Date(application.appliedAt);
  let month = monthName[d.getMonth()];
  const year = new Date(application.appliedAt).getFullYear();
  const postedDate = `${date} ${month} ${year}`;

  return (
    <>
      {session?.user?.role === "recruiter" && (
        <div className="py-4 rounded-lg transition-shadow border-b border-gray-200 flex items-center text-sm font-semibold">
          <div className="flex items-center w-[23.33%]">
            {application.candidateDeleted ? (
              <span className="text-gray-500 italic">Deleted Account</span>
            ) : (
              `${application.firstName} ${application.lastName}`
            )}
          </div>

          <div className="py-3 w-[15%]">
            {application.jobTitle || "No title"}
          </div>

          <div className="py-3 w-[23.33%]">{postedDate || "Unknown date"}</div>

          <div className="py-3 w-[23.33%]">
            {application.candidateDeleted ? (
              <span className="text-gray-500 italic">[Deleted Account]</span>
            ) : (
              application.email || "No email"
            )}
          </div>

          <div className="flex gap-2 justify-end w-[15%] items-center">
            <button
              className="flex items-center justify-center w-full h-[50px] bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition-colors disabled:opacity-50"
              onClick={handleView}
              disabled={application.candidateDeleted}
              title={
                application.candidateDeleted
                  ? "Candidate account has been deleted"
                  : "View application"
              }
            >
              View
            </button>
          </div>
        </div>
      )}
      {session?.user?.role === "jobseeker" && (
        <div className="py-4 rounded-lg transition-shadow border-b border-gray-200 flex items-center text-sm font-semibold">
          <div className="flex items-center w-[20%]">
            {application.jobDeleted ? (
              <span className="text-gray-500 italic">
                {application.jobTitle}
              </span>
            ) : (
              application.jobTitle
            )}
          </div>

          <div className="py-3 w-[20%]">
            {recruiterdetails.recruiterName || "No title"}
          </div>

          <div className="py-3 w-[20%]">{postedDate || "Unknown date"}</div>

          <div className="py-3 w-[20%]">
            {application.jobDeleted ? (
              <span className="text-orange-500">Job Removed</span>
            ) : (
              application.status || "No email"
            )}
          </div>

          <div className="flex gap-2 justify-end w-[20%] items-center">
            <button
              className="flex items-center justify-center w-full h-[50px] bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition-colors disabled:opacity-50"
              onClick={handleViewJob}
              disabled={application.jobDeleted}
              title={
                application.jobDeleted
                  ? "This job has been removed"
                  : "View job details"
              }
            >
              View
            </button>
          </div>
        </div>
      )}
    </>
  );
}
