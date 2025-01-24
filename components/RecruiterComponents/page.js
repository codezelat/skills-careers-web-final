"use client";
import { useState, useEffect } from "react";
import { handleOpenForm, handleCloseForm } from "@/handlers";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import AdminNavBar from "../AdminNav";
import AllRecruiterData from "./AllRecruiterData";
import AddRecruiter from "./AddRecruiter";
import RecruiterDetailsPage from "./[userId]";

function RecruitersPanel() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [activeSection, setActiveSection] = useState("recruiters");

  const [recruiters, setRecruiters] = useState([]);
  const [filteredRecruiters, setFilteredRecruiters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRecruiterId, setSelectedRecruiterId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Handle the "Select All" checkbox
  const handleSelectAll = (isChecked) => {
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedRecruiters(
        filteredRecruiters.map((recruiter) => recruiter.userId)
      );
    } else {
      setSelectedRecruiters([]);
    }
  };

  // Handle individual row selection
  const handleRowSelect = (id, isChecked) => {
    setSelectedRecruiters((prev) =>
      isChecked
        ? [...prev, id]
        : prev.filter((userId) => userId !== id)
    );
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  });

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const response = await fetch("/api/recruiter/all");
        const data = await response.json();
        setRecruiters(data.recruiters || []); // Default to empty array if undefined
        setFilteredRecruiters(data.recruiters || []); // Default to empty array if undefined
      } catch (error) {
        console.error("Error fetching recruiters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiters();
  }, []);

  // Handle search query change
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredRecruiters(
      recruiters.filter(
        (recruiter) =>
          recruiter.recruiterName.toLowerCase().includes(query) ||
          recruiter.industry.toLowerCase().includes(query) ||
          recruiter.location.toLowerCase().includes(query)
      )
    );
  };

  const handleRecruiterSelect = (id) => {
    setSelectedRecruiterId(id);
  };

  const handleCloseProfile = () => {
    setSelectedRecruiterId(null);
  };

  if (loading) {
    return <div className="text-sm text-purple-600">Loading recruiters...</div>;
  }

  return (
    <div className="p-4">
      {/* Title Bar */}
      <div className="h-[10vh] flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recruiters</h1>
        <input
          type="search"
          placeholder="Search by job name"
          className="px-2 py-2 w-96 text-center bg-slate-100 border-solid border-2 border-slate-100 outline-none rounded-lg"
        />
        <p className="text-purple-600 font-semibold">
          {session?.user?.name} | {session?.user?.email}
        </p>
      </div>

      {/* Content */}
      <div className="h-[90vh] space-y-6">
        <div className="h-full grid lg:grid-cols-5 md:grid-cols-5 sm:grid-cols-1 lg:gap-4 md:gap-4 sm:gap-0">
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
                Recruiters
              </h2>
              <button
                onClick={handleOpenForm(setIsFormVisible)}
                className="px-4 py-2 bg-purple-600 border-2 border-purple-600 text-white font-semibold hover:border-purple-600 hover:bg-white hover:text-purple-600 rounded transition-colors"
              >
                Add New
              </button>
              {isFormVisible && (
                <AddRecruiter onClose={handleCloseForm(setIsFormVisible)} />
              )}
            </div>
            <input
              type="search"
              placeholder="Search by company name, industry, location"
              className="px-10 py-2 mb-6 w-full text-left bg-white outline-none rounded-lg"
              value={searchQuery}
              onChange={handleSearchChange}
            />

            {selectedRecruiterId && (
              <RecruiterDetailsPage
                recruiterId={selectedRecruiterId}
                onClose={handleCloseProfile}
              />
            )}
            {/* Recruiter List */}
            <div className="p-4">
              {/* Header Row */}
              <div className="bg-gray-100 p-4 rounded-t-lg flex items-center font-semibold text-sm">
                {/* "Select All" Checkbox */}
                <div className="w-[10%] flex justify-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-[#001571] border-gray-300 rounded"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </div>
                <div className="w-1/4">Recruiter Name</div>
                <div className="w-1/4">Email</div>
                <div className="w-1/4">Contact Number</div>
                <div className="w-1/4">Actions</div>
              </div>

              {/* Data Rows */}
              <div className="grid gap-4">
                {Array.isArray(filteredRecruiters) &&
                filteredRecruiters.length > 0 ? (
                  filteredRecruiters.map((recruiter) => (
                    <AllRecruiterData
                      key={recruiter._id}
                      recruiter={recruiter}
                      isSelected={selectedRecruiters.includes(recruiter._id)}
                      onSelect={(isChecked) =>
                        handleRowSelect(recruiter._id, isChecked)
                      }
                    />
                  ))
                ) : (
                  <p className="text-lg text-center font-bold text-red-500 py-20">
                    No recruiters found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecruitersPanel;
