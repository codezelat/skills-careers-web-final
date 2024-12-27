import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

function PostedJobs(props) {
  const { data: session } = useSession();
  const [applicationCount, setApplicationCount] = useState(0);
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
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Job Title</p>
          <p className="font-semibold">{jobTitle}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Posted Date</p>
          <p className="font-semibold">{postedDate}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">No of Applications</p>
          <p className="font-semibold">{applicationCount}</p>
        </div>
        <div className="flex justify-end">
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
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded transition-colors"
          >
            {isLoading ? "Loading..." : "Delete Job"}
          </button>
        </div>
        <div className="flex justify-end">
          <Link href={`/applications?jobId=${_id}`}>
            <button className="px-4 py-2 border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white rounded transition-colors">
              Manage
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PostedJobs;
