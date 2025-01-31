import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function CustomizedApplications() {
  const [showViewLatestApplication, setShowViewLatestApplication] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Updated to 10 rows per page
  const totalPages = 15;


  const applicationData = Array.from(
    { length: (rowsPerPage * totalPages) / 2 },
    (_, index) => ({
      id: index + 1 ,
      applications: 125,
      position:" Software Engineer",
      email: "alanfernando@gmail.com",
      date: "25 AUG 2024",
    })
  );


  const displayedApplications = applicationData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // Determine the range of visible pages
  const getVisiblePages = () => {
    const visiblePages = 4;
    const halfRange = Math.floor(visiblePages / 2);
    let start = Math.max(currentPage - halfRange, 1);
    let end = start + visiblePages - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - visiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="p-6 bg-white rounded-xl">
      <h1 className="text-xl font-bold text-[#001571] mb-4">
       Applications
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full ">
          <thead>
            <tr className="text-left text-sm font-medium text-[#8A93BE]">
              <th className="py-3 px-6">Position</th>
              <th className="py-3 px-6">Published Date</th>
              <th className="py-3 px-6">Applications</th>
              <th className="py-3 px-6 text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800 font-semibold">
            {displayedApplications.map((item) => (
              <tr
                key={item.id}
                className="border-b text-gray-700 hover:bg-gray-50"
              >
                <td className="py-2 px-6  items-center">
                  {item.position}
                </td>
                <td className="py-2 px-6">{item.date}</td>
                <td className="py-2 px-6">{item.applications}</td>
                <td className="py-2 px-6">
                  <Link href="/recruiter/receivedApplications/ViewApplication">
                  <div className="flex justify-end">

                  <button
                    className="flex items-center bg-[#001571] text-white px-4 py-2 rounded-md"
                  >
                    View Application
                    <Image
                      src="/images/arrowrightwhite.png"
                      alt="Arrow Right"
                      width={16}
                      height={16}
                      className="ml-2"
                    />
                  </button>
                  </div>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-4 items-center space-x-2">
        <button
          className="px-3 py-1 rounded-lg  text-gray-600"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          &laquo;
        </button>
        {getVisiblePages().map((page) => (
          <button
            key={page}
            className={`px-3 py-1 rounded-lg ${
              currentPage === page ? " text-[#001571]" : " text-gray-600"
            }`}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded-lg  text-gray-600"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}
