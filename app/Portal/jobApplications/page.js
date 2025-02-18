"use client";
import { useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useSession } from "next-auth/react";
import PortalApplicationCard from "@/components/PortalComponents/portalApplicationCard";

export default function JobApplications() {
  const { data: session, status } = useSession({ required: true });
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const rowsPerPage = 10;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;
      
      try {
        const recruiterUrl = `/api/recruiterdetails/get?userId=${session.user.id}`;
        const recruiterResponse = await fetch(recruiterUrl);
        if (!recruiterResponse.ok) throw new Error('Failed to fetch recruiter');
        const recruiterData = await recruiterResponse.json();

        const url = `/api/applications/get?recruiterId=${recruiterData.id}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        if (data.success) {
          const formatted = data.applications.map(app => ({
            ...app,
            id: app._id.toString(),
            date: new Date(app.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }).toUpperCase()
          }));
          
          setApplications(formatted);
          setFilteredApplications(formatted);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchData();
    }
  }, [session?.user?.id]);

  // Handle search filtering
  useEffect(() => {
    const filtered = applications.filter(app =>
      app.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredApplications(filtered);
    setCurrentPage(1);
  }, [searchQuery, applications]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredApplications.length / rowsPerPage);
  const displayedApplications = filteredApplications.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Pagination controls
  const handlePageClick = (page) => setCurrentPage(page);
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const getVisiblePages = () => {
    const visiblePages = 5;
    const halfRange = Math.floor(visiblePages / 2);
    let start = Math.max(currentPage - halfRange, 1);
    let end = Math.min(start + visiblePages - 1, totalPages);

    if (end - start + 1 < visiblePages) {
      start = Math.max(end - visiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col p-6 bg-white rounded-xl">
        <p className="text-center py-20">Authenticating...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col p-6 bg-white rounded-xl">
        <p className="text-center py-20">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 bg-white rounded-xl">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-[#001571] text-xl font-bold">
          Received Applications
        </h2>
        <span className="text-[#001571] text-base font-medium">
          Total Applications: {applications.length}
        </span>
      </div>

      <div className="flex-grow mt-6">
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

      <div className=" bg-white rounded-xl mt-8">
        <h1 className="text-xl font-bold text-[#001571] mb-2">Applications</h1>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-[#8A93BE] text-base font-semibold text-left">
                <th className="py-3 w-[23.33%]">Candidate Name</th>
                <th className="py-3 w-[15%]">Job Title</th>
                <th className="py-3 w-[23.33%]">Applied Date</th>
                <th className="py-3 w-[23.33%]">Email</th>
                <th className="py-3 w-[15%]">Actions</th>
              </tr>
            </thead>
          </table>

          <div className="grid gap-4 grid-cols-1">
            {displayedApplications.length > 0 ? (
              displayedApplications.map((application) => (
                <PortalApplicationCard
                  key={application.id}
                  application={application}
                />
              ))
            ) : (
              <p className="text-lg text-center font-bold text-red-500 py-20">
                No applications found.
              </p>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4 items-center space-x-2">
            <button
              className="px-3 py-1 rounded-lg text-gray-600 hover:text-[#001571]"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>
            
            {getVisiblePages().map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === page ? "text-[#001571] font-bold" : "text-gray-600"
                }`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </button>
            ))}
            
            <button
              className="px-3 py-1 rounded-lg text-gray-600 hover:text-[#001571]"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}