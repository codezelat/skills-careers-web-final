"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BsChevronLeft, BsChevronRight, BsPlus } from "react-icons/bs";
import { IoSearchSharp } from "react-icons/io5";
import PortalLoading from "../loading";
import AddPressrelease from "./AddPressrelease";
import PressReleaseCard from "@/components/PortalComponents/pressReleaseCard";

import UpdatePressrelease from "./UpdatePressrelease";
import DeleteConfirmation from "./DeleteConfirmation";

export default function PressReleaseList() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [pressreleases, setPressreleases] = useState([]);
  const [filteredPressreleases, setFilteredPressreleases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPressrelease, setSelectedPressrelease] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pressPerPage = 16;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  const fetchPressReleases = async () => {
    try {
      // Don't set loading to true here to avoid flickering if mostly silent update
      const response = await fetch("/api/pressrelease/all", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch press releases");
      const data = await response.json();
      setPressreleases(data.pressreleases || []);
      setFilteredPressreleases(data.pressreleases || []);
    } catch (error) {
      console.error("Error fetching press releases:", error);
      setPressreleases([]);
      setFilteredPressreleases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPressReleases();
  }, []);

  useEffect(() => {
    setFilteredPressreleases(
      pressreleases.filter((pressrelease) =>
        pressrelease.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, pressreleases]);

  const handlePressreleaseSelect = (pressrelease) => {
    router.push(`/Portal/pressrelease/${pressrelease._id}`);
  };

  const handleEditClick = (pressrelease) => {
    setSelectedPressrelease(pressrelease);
    setShowUpdateForm(true);
  };

  const handleDeleteClick = (pressrelease) => {
    setSelectedPressrelease(pressrelease);
    setShowDeleteConfirm(true);
  };

  const handleUpdateSubmit = async (updatedDetails, imageFile) => {
    const formData = new FormData();
    formData.append("_id", selectedPressrelease._id);
    formData.append("title", updatedDetails.title);
    formData.append("description", updatedDetails.description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch("/api/pressrelease/update", {
      method: "PUT", // or POST, verifying... usually update is PUT or POST
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update");
    }

    return await response.json();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const totalPages = Math.ceil(filteredPressreleases.length / pressPerPage);
  const indexOfLastpress = currentPage * pressPerPage;
  const indexOfFirstpress = indexOfLastpress - pressPerPage;
  const currentpress = filteredPressreleases.slice(
    indexOfFirstpress,
    indexOfLastpress
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (status === "loading" || loading) return <PortalLoading />;

  return (
    <div className="min-h-screen bg-white rounded-3xl py-5 px-7">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl font-bold text-[#001571]">Press Release</h1>
        {session?.user?.role === "admin" && (
          <button
            className="bg-[#001571] text-white px-6 py-2 rounded-2xl shadow hover:bg-blue-800 flex items-center text-sm font-semibold w-full sm:w-auto justify-center"
            onClick={() => setShowApplicationForm(true)}
          >
            <BsPlus size={25} className="mr-1" />
            Add New
          </button>
        )}
      </div>

      {showApplicationForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
            <AddPressrelease
              onClose={() => setShowApplicationForm(false)}
              onSuccess={() => {
                setShowApplicationForm(false);
                fetchPressReleases();
              }}
            />
          </div>
        </div>
      )}

      {showUpdateForm && selectedPressrelease && (
        <UpdatePressrelease
          pressreleaseDetails={selectedPressrelease}
          onClose={() => setShowUpdateForm(false)}
          onSubmit={async (updatedDetails, image) => {
            await handleUpdateSubmit(updatedDetails, image);
            setShowUpdateForm(false);
            fetchPressReleases();
          }}
        />
      )}

      {showDeleteConfirm && selectedPressrelease && (
        <DeleteConfirmation
          slug={selectedPressrelease._id}
          pressreleaseDetails={selectedPressrelease}
          onClose={() => setShowDeleteConfirm(false)}
          onSuccess={() => {
            setShowDeleteConfirm(false);
            fetchPressReleases();
          }}
        />
      )}

      <div className="flex-grow mt-8 sm:mt-16">
        <div className="bg-[#E6E8F1] flex items-center pl-4 sm:pl-10 pr-4 sm:pr-10 mb-5 py-4 rounded-2xl shadow-sm w-full">
          <IoSearchSharp size={25} className="text-[#001571] min-w-[25px]" />
          <input
            type="text"
            placeholder="Search Job Posts..."
            className="ml-4 text-[#8A93BE] bg-[#E6E8F1] font-bold outline-none w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-10">
        {currentpress.length > 0 ? (
          currentpress
            .map((pressrelease, index) => (
              <PressReleaseCard
                key={index}
                pressrelease={pressrelease}
                onViewPressrelease={() =>
                  handlePressreleaseSelect(pressrelease)
                }
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))
            .reverse()
        ) : (
          <p className="text-lg text-center font-bold text-red-500 py-20">
            No pressreleases found.
          </p>
        )}
      </div>

      <div className="flex justify-center mt-4">
        <nav className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-[10px] py-2 rounded-lg ${currentPage === 1
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
              className={`px-4 py-2 rounded-lg ${currentPage === index + 1
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
            className={`px-[10px] py-2 rounded-lg ${currentPage === totalPages
              ? "bg-gray-300"
              : "bg-gray-200 hover:bg-gray-400"
              }`}
          >
            <BsChevronRight size={15} />
          </button>
        </nav>
      </div>
    </div>
  );
}
