import Image from "next/image";
import { useEffect, useState } from "react";

function JobCard(props) {
  const [applicationCount, setApplicationCount] = useState(0);
  const [recruiterDetails, setRecruiterDetails] = useState({
    email: "",
    recruiterName: "",
    logo: "",
  });
  const [isPublished, setIsPublished] = useState(
    props.job.isPublished || false
  );
  const [isLoading, setIsLoading] = useState(false);

  const {
    _id,
    createdAt,
    jobTitle,
    recruiterId,
    location,
    jobTypes,
    jobDescription,
  } = props.job;

  useEffect(() => {
    if (recruiterId) {
      const fetchRecruiterDetails = async (e) => {
        try {
          const response = await fetch(
            `/api/recruiterdetails/get?id=${recruiterId}`
          );
          if (response.ok) {
            const data = await response.json();
            setRecruiterDetails(data);
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
          `/api/applications?jobId=${_id}&recruiterId=${recruiterId}`
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
      const response = await fetch(`/api/job/${_id}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished: !isPublished }),
      });

      if (response.ok) {
        setIsPublished(!isPublished);
        // Notify parent component about the status change
        props.onJobStatusChanged?.(_id, !isPublished);
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
      setIsLoading(true);
      try {
        const response = await fetch(`/api/job/${_id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Notify parent component to refresh the jobs list
          props.onJobDeleted?.(_id);
        } else {
          alert("Failed to delete job");
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Error deleting job");
      }
      setIsLoading(false);
    }
  };

  // In JobCard.js, modify the handleViewJob function:
  const handleViewJob = () => {
    props.onViewJob?.();
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
    <div className="grid grid-cols-12 gap-1 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="col-span-1 space-y-1">
        <Image
          src={recruiterDetails.logo || "/images/default-image.jpg"}
          alt="Jobseeker Profile"
          width={50}
          height={50}
          className="rounded-full shadow-lg"
        />
      </div>
      <div className="col-span-3 space-y-1">
        <p className="text-sm text-gray-600">Name</p>
        <p className="font-semibold">{jobTitle}</p>
      </div>
      <div className="flex col-span-4 justify-between">
        <div className="">
          <p className="text-sm text-gray-600">Applicants</p>
          <p className="font-semibold">{applicationCount}</p>
        </div>
        <div className="">
          <p className="text-sm text-gray-600">Location</p>
          <p className="font-semibold">{location}</p>
        </div>
        <div className="">
          <p className="text-sm text-gray-600">Posted Date</p>
          <p className="font-semibold">{postedDate}</p>
        </div>
      </div>
      <div className="col-span-4 mt-2 flex gap-2 justify-end">
        <button
          onClick={handlePublishToggle}
          disabled={isLoading}
          className={`px-4 py-2 rounded transition-colors ${
            isPublished
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {isLoading ? "Loading..." : isPublished ? "Unpublish" : "Publish"}
        </button>
        <button
          className="px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors"
          onClick={handleViewJob}
        >
          Manage
        </button>
        <button className="px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}

export default JobCard;
