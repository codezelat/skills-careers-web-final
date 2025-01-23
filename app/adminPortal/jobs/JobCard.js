import Image from "next/image";
import { useEffect, useState } from "react";

import { RiDeleteBinFill } from "react-icons/ri";
import { BsFillEyeFill } from "react-icons/bs";
import Link from "next/link";

function JobCard({job, onJobStatusChanged, onJobDeleted, onViewJob }) {
  const [applicationCount, setApplicationCount] = useState(0);
  const [recruiterDetails, setRecruiterDetails] = useState({
    email: "",
    recruiterName: "",
    profileImage: "",
  });
  const [isPublished, setIsPublished] = useState(job.isPublished || false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    _id,
    createdAt,
    jobTitle,
    recruiterId,
    location,
    jobTypes,
    jobDescription,
  } = job;

  useEffect(() => {
    if (recruiterId) {
      const fetchRecruiterDetails = async (e) => {
        try {
          const response = await fetch(
            `/api/recruiter/get?id=${recruiterId}`
          );
          if (response.ok) {
            const data = await response.json();
            setRecruiterDetails(data.recruiter);
          } else {
            console.error("Failed to fetch recruiter details");
          }
        } catch (error) {
          console.error("Error fetching recruiter details:", error);
        }
      };

      fetchRecruiterDetails();
    }
  }, [recruiterId]);

  useEffect(() => {
    const fetchApplicationCount = async () => {
      try {
        const response = await fetch(
          `/api/jobapplication/get?jobId=${_id}&recruiterId=${recruiterId}`
        );
        if (response.ok) {
          const data = await response.json();
          setApplicationCount(data.count);
        }
      } catch (error) {
        console.error("Error fetching application count:", error);
      }
    };
    fetchApplicationCount();
  }, [_id, recruiterId]);

  const handlePublishToggle = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/job/publish?id=${_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished: !isPublished }),
      });

      if (response.ok) {
        setIsPublished(!isPublished);
        // Notify parent component about the status change
        onJobStatusChanged?.(_id, !isPublished);
      } else {
        alert("Failed to update job status");
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      alert("Error updating job status");
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        setIsDeleting(true);
        const response = await fetch(`/api/job/delete?id=${_id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Job Deleted Successfully!!!");
        } else {
          alert("Failed to delete job...");
        }
      } catch (error) {
        console.error("Error deleting Job:", error);
        alert("Error deleting Job");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // In JobCard.js, modify the handleViewJob function:
  const handleViewJob = () => {
    onViewJob?.();
  };

  const date = new Date(createdAt).getDate();
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
  const d = new Date(createdAt);
  let month = monthName[d.getMonth()];
  const year = new Date(createdAt).getFullYear();
  const postedDate = `${date} ${month} ${year}`;

  return (
    <div className="gap-1 bg-white rounded-lg hover:shadow-md">
      <div className="w-full">
        <div className="text-gray-700 hover:bg-gray-50 border-b text-sm flex">
          {/* First Column - Small */}
          <div className="px-4 py-3 w-[5%] flex items-center">
            <input type="checkbox" />
          </div>

          {/* Other Columns - Equal Width */}
          <Link href={`/adminPortal/jobs/${job._id}`} className="flex w-[71.25%]">
          <div className="px-4 py-3 text-black font-semibold w-[23.75%] flex items-center">
            {jobTitle}
          </div>
          <div className="px-4 py-3 text-black font-semibold w-[23.75%] flex items-center">
            {recruiterDetails.recruiterName}
          </div>
          <div className="px-4 py-3 text-black font-semibold w-[23.75%] flex items-center">
            {postedDate}
          </div>
          </Link>
          <div className="px-4 py-3 flex gap-2 ml-auto justify-end w-[23.75%] items-center">
            <button
              onClick={handlePublishToggle}
              disabled={isLoading}
              className={`flex bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 ${
                isPublished
                  ? "bg-[#001571] text-white hover:bg-yellow-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              <span className="mr-2">
                <BsFillEyeFill size={15} />
              </span>
              {isLoading
                ? "Loading..."
                : isPublished
                ? "Restricted"
                : "Unrestricted"}
            </button>
            <button className="flex bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-600">
              <span className="mr-2">
                <RiDeleteBinFill size={20} />
              </span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobCard;