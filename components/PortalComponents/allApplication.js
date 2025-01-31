"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import PortalApplicationCard from "./portalApplicationCard";

export default function AllApplications({ applications = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(applications.length / rowsPerPage);

  const displayedApplications = applications.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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

  return (
    <div className="p-6 bg-white rounded-xl">
      <h1 className="text-xl font-bold text-[#001571] mb-4">Applications</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[#8A93BE] text-base font-semibold text-left">
              <th className="px-4 py-3 w-[20%]">Candidate Name</th>
              <th className="px-4 py-3 w-[20%]">Job Title</th>
              <th className="px-4 py-3 w-[20%]">Applied Date</th>
              <th className="px-4 py-3 w-[20%]">Email</th>
              <th className="px-4 py-3 w-[20%]">Actions</th>
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
  );
}