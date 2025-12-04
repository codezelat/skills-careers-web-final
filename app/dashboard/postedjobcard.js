import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

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
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/job/${_id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            Swal.fire(
              'Deleted!',
              'Your job has been deleted.',
              'success'
            );
            // Optionally trigger a refresh or redirect
          }
        } catch (error) {
          console.error("Error deleting job:", error);
          Swal.fire(
            'Error!',
            'Failed to delete job.',
            'error'
          );
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error in publish toggle:", error);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/job/${_id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          Swal.fire(
            'Deleted!',
            'Your job has been deleted.',
            'success'
          );
          // Add logic to remove card from UI if needed, e.g. props.onDelete(_id)
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        Swal.fire(
          'Error!',
          'Failed to delete job.',
          'error'
        );
      }
      setIsLoading(false);
    }
  };

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
  const postedDate = `${d.getDate()} ${month} ${year}`;

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
            className={`px-4 py-2 rounded transition-colors ${isPublished
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
