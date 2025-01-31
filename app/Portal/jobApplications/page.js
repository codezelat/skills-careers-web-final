"use client";
import { useState, useEffect } from "react";
import AllApplications from "@/components/PortalComponents/allApplication";
import CustomizedApplications from "@/components/PortalComponents/customizedApplication";
import { IoSearchSharp } from "react-icons/io5";

// Mock data generator
const generateApplicationData = (length) => 
  Array.from({ length }, (_, index) => ({
    id: index + 1,
    candidateName: "Alan Fernando",
    jobTitle: "Senior Ui/UX Engineer",
    email: "alanfernando@gmail.com",
    date: "25 AUG 2024",
  }));

export default function JobApplications() {
  const [isAllJobPosts, setisAllJobPosts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);

  // Initialize with mock data
  useEffect(() => {
    const mockData = generateApplicationData(150); // 15 pages of 10 items
    setApplications(mockData);
    setFilteredApplications(mockData);
  }, []);

  // Handle search filtering
  useEffect(() => {
    const filtered = applications.filter(app =>
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredApplications(filtered);
  }, [searchQuery, applications]);

  return (
    <div className="flex flex-col p-6 bg-white rounded-xl">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-[#001571] text-xl font-bold mb-6">
          Received Applications
        </h2>
      </div>

      <div className="flex-grow">
        <div className="bg-[#E6E8F1] flex items-center pl-10 pr-10 mb-5 py-4 rounded-2xl shadow-sm w-full">
          <IoSearchSharp size={25} className="text-[#001571]" />
          <input
            type="text"
            placeholder="Search By Name or Job Title..."
            className="ml-4 text-[#8A93BE] bg-[#E6E8F1] font-bold outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <AllApplications applications={filteredApplications} />
    </div>
  );
}