"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { handleCloseForm, handleOpenForm } from "@/handlers";
import { useRouter } from "next/navigation";

import DeleteConfirmation from "./DeleteConfirmation";
import AdminNavBar from "@/app/admindashboard/AdminNav";
import AddAnnouncement from "@/components/adminPortal/annoucement/AddAnnouncement";
import EditAnnouncement from "@/components/adminPortal/annoucement/EditAnnouncement";
import AnnouncementCard from "@/components/adminPortal/annoucement/AnnouncementCard";

function Announcements() {
  const router = useRouter();
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
      setIsLoading(true);
      const response = await fetch("/api/announcement/all");

      if (!response.ok) {
        throw new Error("Failed to fetch Announcements.");
      }

      const data = await response.json();
      setAnnouncements(data.announcements);
      setFilteredAnnouncements(data.announcements);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
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

  return (
    <div className="p-4">
      {/* Title Bar */}
      <div className="h-[10vh] flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <input
          type="search"
          placeholder="Search by announcement name"
          className="px-2 py-2 w-96 text-center bg-slate-100 border-solid border-2 border-slate-100 outline-none rounded-lg"
        />
        <p className="text-purple-600 font-semibold">
          {session?.user?.name} | {session?.user?.email}
        </p>
      </div>

      {/* Content */}
      <div className="h-[90vh] space-y-6">
        <div className="h-full grid lg:grid-cols-5 md:grid-cols-5 sm:grid-cols-1 lg:gap-4 md:gap-4 sm:gap-0">
          {/* Left Side Bar */}
          <div className="bg-slate-100 mb-4 p-6 rounded-lg shadow-md">
            <AdminNavBar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>

          {/* Center Contents */}
          <div className="lg:col-span-4 md:col-span-4 sm:col-span-1 bg-slate-100 mb-4 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-purple-600 font-semibold">
                Announcements
              </h2>
              <button
                onClick={handleOpenForm(setIsFormVisible)}
                className="px-4 py-2 bg-purple-600 border-2 border-purple-600 text-white font-semibold hover:border-purple-600 hover:bg-white hover:text-purple-600 rounded transition-colors"
              >
                Add New Announcement
              </button>
              {isFormVisible && (
                <AddAnnouncement onClose={handleCloseForm(setIsFormVisible)} />
              )}
            </div>

            {selectedAnnouncement && (
              <EditAnnouncement
                announcement={selectedAnnouncement}
                onClose={handleCloseAnnouncement}
              />
            )}

            {selectedAnnouncementDelete && (
              <DeleteConfirmation
                announcement={selectedAnnouncementDelete}
                onClose={handleCloseAnnouncementDelete}
              />
            )}

            {/* Announcement Cards */}
            <div className="grid gap-4 grid-cols-1">

            <div className="overflow-x-auto rounded-lg">
              <div className="w-full">
                <div className="text-[#8A93BE] text-base font-semibold text-left flex">
                  <div className="w-[10%] py-3 pl-3 flex items-center"></div>
                  
                  <div className="py-3 w-[30%] flex items-center justify-start pl-0">
                    Title
                  </div>
                  <div className="px-4 py-3 w-[30%]">Date Posted</div>
                 
                  <div className=" py-3 w-[30%] ml-auto justify-start">
                    Actions
                  </div>
                </div>
              </div>
            </div>

              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements
                  .map((announcement, index) => (
                    <AnnouncementCard
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
                  No announcements found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Announcements;
