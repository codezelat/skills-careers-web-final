import Link from "next/link";
import { useState } from "react";

function ApplicationCard({ application }) {
  const [status, setStatus] = useState(application.status || "Pending");
  const [isUpdating, setIsUpdating] = useState(false);

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
  const appliedDate = `${date} ${month} ${year}`;

  const handleDownloadCV = async () => {
    try {
      const response = await fetch(`/api/download-cv/${application.cvFileId}`);
      if (!response.ok) {
        throw new Error("Download failed");
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "cv.pdf";

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading CV:", error);
      alert("Failed to download CV");
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      const response = await fetch("/api/jobapplication/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobseekerEmail: application.email,
          applicationId: application._id,
          jobTitle: application.jobTitle,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update application status");
    } finally {
      setIsUpdating(false);
    }
  };

  const jobSeekerName = `${application.firstName} ${application.lastName}`;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Jobseeker Name</p>
          <p className="font-semibold">{jobSeekerName}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Status</p>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className={`px-3 py-2 rounded-md border ${
              status === "Pending"
                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                : status === "Approved"
                ? "bg-green-100 text-green-800 border-green-300"
                : "bg-red-100 text-red-800 border-red-300"
            } cursor-pointer`}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Contact Number</p>
          <p className="font-semibold">{application.contactNumber || "N/A"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Applied date</p>
          <p className="font-semibold">{appliedDate}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Download CV</p>
          <button
            onClick={handleDownloadCV}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Download CV
          </button>
        </div>
        <div className="flex justify-end">
          <Link href={`/jobseeker/${application.jobseekerId}`}>
            <button className="px-4 py-2 border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white rounded transition-colors">
              View Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ApplicationCard;
