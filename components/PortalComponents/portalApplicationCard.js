"use client";
import { useState } from "react";
import { RiDownloadLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

export default function PortalApplicationCard({ application }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();

  const handleDownloadCV = async () => {
    if (!application?.cvFileId) {
      alert("No CV available for download");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch(`/api/download-cv/${application.cvFileId}`);
      if (!response.ok) throw new Error('Failed to download CV');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_${application.firstName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download CV. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

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
    <div className="py-4 rounded-lg transition-shadow border-b border-gray-200 flex items-center text-sm font-semibold">
      <div className="flex items-center w-[20%]">
        {application.firstName} {application.lastName}
      </div>

      <div className="py-3 w-[20%]">
        {application.jobTitle || "No title"}
      </div>

      <div className="py-3 w-[20%]">
        {postedDate || "Unknown date"}
      </div>

      <div className="py-3 w-[20%]">
        {application.email || "No email"}
      </div>

      <div className="flex gap-2 justify-end w-[20%] items-center">
        <button
          className="flex items-center justify-center w-full bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition-colors disabled:opacity-50"
          onClick={handleDownloadCV}
          disabled={isDownloading || !application.cvFileId}
        >
          <RiDownloadLine size={20} className="mr-2" />
          {isDownloading ? "Downloading..." : "Download CV"}
        </button>
      </div>
    </div>
  );
}