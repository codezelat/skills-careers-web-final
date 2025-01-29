"use client";

import { RiDeleteBinFill } from "react-icons/ri";
import PortalLoading from "../loading";
import { IoSearchSharp } from "react-icons/io5";
import {
  BsChevronLeft,
  BsChevronRight,
  BsFillEyeFill,
  BsPlus,
} from "react-icons/bs";
import AnnoucementsCard from "@/components/PortalComponents/annoucementsCard";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PiCheckCircle } from "react-icons/pi";
import AddAnnouncement from "./AddAnnouncement";
import { handleCloseForm, handleOpenForm } from "@/handlers";

export default function Annoucements() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState("announcements");

  const [announcements, setAnnouncements] = useState([]); // Original Announcements
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedAnnouncementDelete, setSelectedAnnouncementDelete] =
    useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  });

  const fetchAnnouncments = async () => {
    try {
      const response = await fetch("/api/announcement/all");

      if (!response.ok) {
        throw new Error("Failed to fetch Announcements.");
      }

      const data = await response.json();
      setAnnouncements(data.announcements);
      setFilteredAnnouncements(data.announcements);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //   To refresh all data fetching every 60 seconds
  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([fetchAnnouncments()]);
    };
    fetchAllData();
    const intervalId = setInterval(fetchAllData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleAnnouncementSelect = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const handleCloseAnnouncement = () => {
    setSelectedAnnouncement(null);
  };

  const handleAnnouncementDelete = (announcement) => {
    setSelectedAnnouncementDelete(announcement);
  };

  const handleCloseAnnouncementDelete = () => {
    setSelectedAnnouncementDelete(null);
  };

  // pagination function
  const [currentPage, setCurrentPage] = useState(1);
  const annoucementsPerPage = 6;

  const totalPages = Math.ceil(
    filteredAnnouncements.length / annoucementsPerPage
  );

  const indexOfLastAnnoucements = currentPage * annoucementsPerPage;
  const indexOfFirstAnnoucements =
    indexOfLastAnnoucements - annoucementsPerPage;
  const currentAnnoucement = filteredAnnouncements.slice(
    indexOfFirstAnnoucements,
    indexOfLastAnnoucements
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <PortalLoading />;
  }

  return (
    <>
      <div className="min-h-screen bg-white rounded-3xl py-5 px-7">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-[#001571]">Annoucements</h1>

          {session?.user?.role === "admin" && (
            <button
              className="bg-[#001571] text-white px-6 py-2 rounded-2xl shadow hover:bg-blue-800 flex items-center text-sm font-semibold"
              onClick={handleOpenForm(setIsFormVisible)}
            >
              <BsPlus size={25} className="mr-1" />
              Add New
            </button>
          )}
          {isFormVisible && (
            <AddAnnouncement onClose={handleCloseForm(setIsFormVisible)} />
          )}
        </div>

        <>
          {session?.user?.role === "admin" && (
            <>
              {/* Action Buttons */}
              <div className="flex gap-4 mb-4 items-center bg-green">
                <button className="flex items-center justify-center bg-[#001571] text-white px-6 py-3 rounded-2xl shadow hover:bg-blue-800">
                  <span className="mr-2 flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </span>
                  Select More
                </button>

                <button className="flex bg-[#EC221F] text-white px-6 py-3 rounded-2xl shadow hover:bg-red-600">
                  <span className="mr-2">
                    <RiDeleteBinFill size={20} />
                  </span>
                  Delete
                </button>
              </div>

              {/* table */}
              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-[#8A93BE] text-base font-semibold text-left">
                      <th className="px-4 py-3 w-[3%]"></th>
                      <th className="px-4 py-3 w-[32.33%]">Title</th>
                      <th className="px-4 py-3 w-[32.33%]">Date Posted</th>
                      <th className="px-4 py-3 w-[32.33%]">Actions</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </>
          )}

          <div className="grid gap-4 grid-cols-1">
            {currentAnnoucement.length > 0 ? (
              currentAnnoucement
                .map((announcement, index) => (
                  <AnnoucementsCard
                    key={index}
                    announcement={announcement}
                    onViewAnnouncement={() =>
                      handleAnnouncementSelect(announcement)
                    }
                    onViewAnnouncementDelete={() =>
                      handleAnnouncementDelete(announcement)
                    }
                  />
                ))
                .reverse()
            ) : (
              <p className="text-lg text-center font-bold text-red-500 py-20">
                No Annoucements found.
              </p>
            )}
          </div>
        </>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <nav className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-[10px] py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-300"
                  : "bg-gray-200 hover:bg-gray-400"
              }`}
            >
              <BsChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 hover:bg-gray-400"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-[10px] py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-300"
                  : "bg-gray-200 hover:bg-gray-400"
              }`}
            >
              <BsChevronRight size={15} />
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
