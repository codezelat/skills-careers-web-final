"use client";
import React, { useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { PiCheckCircle } from "react-icons/pi";
import { BsChevronLeft, BsChevronRight, BsPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CandidateCard from "@/components/PortalComponents/portalCandidateCard";
import PhoneNumberInput from "@/components/PhoneInput";
import PortalLoading from "../loading";
import { FaTimes } from "react-icons/fa";

import Swal from "sweetalert2";

export default function Candidates() {
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const { data: session, status } = useSession();
  const [jobseekers, setJobseekers] = useState([]);
  const [filteredJobseekers, setFilteredJobseekers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);

  const JOB_TYPE_OPTIONS = [
    "On Site",
    "Hybrid",
    "Remote",
    "Full-Time",
    "Part-Time",
    "Freelance",
  ];
  const candidatesPerPage = 6;
  const [newJobSeekerForm, setNewJobseekerForm] = useState(false);

  const [newJobseeker, setNewJobseeker] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });

  async function createJobseeker(
    firstName,
    lastName,
    email,
    contactNumber,
    password,
    confirmPassword,
  ) {
    const response = await fetch("/api/auth/jobseekersignup", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        contactNumber,
        password,
        confirmPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }
    return data;
  }

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin");
  }, [status, router]);

  useEffect(() => {
    const fetchJobseekers = async () => {
      try {
        const response = await fetch("/api/jobseekerdetails/all");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setJobseekers(data.jobseekers || []);
        filterJobseekers(data.jobseekers || [], searchQuery, activeTab);
      } catch (error) {
        console.error("Error fetching jobseekers:", error);
        setJobseekers([]);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) fetchJobseekers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, searchQuery, activeTab]);

  const filterJobseekers = (
    jobseekers,
    query,
    tab,
    jobTypes = selectedJobTypes,
  ) => {
    const filtered = (jobseekers || []).filter((jobseeker) => {
      const matchesSearch = (jobseeker.email || "")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesTab = tab === "all" ? true : jobseeker.isRestricted;
      const matchesJobType =
        jobTypes.length === 0
          ? true
          : jobTypes.some((type) =>
              (jobseeker.preferredJobTypes || []).includes(type),
            );

      return matchesSearch && matchesTab && matchesJobType;
    });
    setFilteredJobseekers(filtered);
  };

  useEffect(() => {
    filterJobseekers(jobseekers, searchQuery, activeTab, selectedJobTypes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, activeTab, jobseekers, selectedJobTypes]);

  const handleJobTypeToggle = (type) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedJobTypes([]);
  };

  const handleJobseekerUpdate = (updatedJobseeker) => {
    setJobseekers((prev) =>
      prev.map((js) =>
        js._id === updatedJobseeker._id ? { ...js, ...updatedJobseeker } : js,
      ),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createJobseeker(
        newJobseeker.firstName,
        newJobseeker.lastName,
        newJobseeker.email,
        newJobseeker.contactNumber,
        newJobseeker.password,
        newJobseeker.confirmPassword,
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: result.message,
        confirmButtonColor: "#001571",
      });
      setNewJobseekerForm(false);

      const response = await fetch("/api/jobseekerdetails/all");
      const data = await response.json();
      setJobseekers(data.jobseekers);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        confirmButtonColor: "#001571",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJobseeker((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(filteredJobseekers.length / candidatesPerPage)
    ) {
      setCurrentPage(newPage);
    }
  };

  /* Selection State */
  const [selectedIds, setSelectedIds] = useState([]);

  /* Handlers */
  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (
      selectedIds.length === filteredJobseekers.length &&
      filteredJobseekers.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredJobseekers.map((js) => js._id));
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EC221F",
      cancelButtonColor: "#001571",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    // Show loading
    Swal.fire({
      title: "Deleting...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(`/api/jobseekerdetails/delete?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");

      // Update State
      setJobseekers((prev) => prev.filter((js) => js._id !== id));
      setFilteredJobseekers((prev) => prev.filter((js) => js._id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "Candidate has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Delete failed", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete candidate.",
        icon: "error",
        confirmButtonColor: "#001571",
      });
    }
  };

  const handleBulkDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedIds.length} candidates. This cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EC221F",
      cancelButtonColor: "#001571",
      confirmButtonText: "Yes, delete all!",
    });

    if (!result.isConfirmed) return;

    // Show loading
    Swal.fire({
      title: "Deleting...",
      text: "Processing your request",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Optimistic Update can stay if we want, but better to wait for feedback
    const idsToDelete = [...selectedIds];

    // Execute deletes
    try {
      await Promise.all(
        idsToDelete.map((id) =>
          fetch(`/api/jobseekerdetails/delete?id=${id}`, { method: "DELETE" }),
        ),
      );

      // Update State
      setJobseekers((prev) =>
        prev.filter((js) => !idsToDelete.includes(js._id)),
      );
      setFilteredJobseekers((prev) =>
        prev.filter((js) => !idsToDelete.includes(js._id)),
      );
      setSelectedIds([]);

      Swal.fire({
        title: "Deleted!",
        text: "Selected candidates have been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Bulk delete failed", error);
      Swal.fire({
        title: "Partial Error",
        text: "Some deletions might have failed.",
        icon: "error",
        confirmButtonColor: "#001571",
      });
    }
  };

  if (loading) return <PortalLoading />;

  return (
    <div className="min-h-screen bg-white rounded-3xl py-5 px-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h1 className="text-lg sm:text-xl font-bold text-[#001571] whitespace-nowrap">
          Candidates
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {session?.user?.role === "admin" && selectedIds.length > 0 && (
            <button
              className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-2xl shadow hover:bg-red-800 flex items-center text-xs sm:text-sm font-semibold transition-all justify-center"
              onClick={handleBulkDelete}
            >
              <FaTimes size={16} className="mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">
                Delete Selected ({selectedIds.length})
              </span>
            </button>
          )}
          {session?.user?.role === "admin" && (
            <button
              className="bg-[#001571] text-white px-4 sm:px-6 py-2 rounded-2xl shadow hover:bg-blue-800 flex items-center text-xs sm:text-sm font-semibold justify-center"
              onClick={() => setNewJobseekerForm(true)}
            >
              <BsPlus size={20} className="mr-1" />
              <span className="whitespace-nowrap">Add New</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      {session?.user?.role === "admin" && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center p-1 mb-5 bg-[#E6E8F1] rounded-2xl w-full lg:w-max text-xs sm:text-sm font-medium gap-1 sm:gap-0">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 sm:px-6 py-3 flex items-center rounded-2xl w-full sm:w-auto justify-center whitespace-nowrap ${
              activeTab === "all" ? "bg-[#001571] text-white" : "text-[#B0B6D3]"
            }`}
          >
            <span>All Candidates</span>
            <PiCheckCircle size={18} className="ml-2" />
          </button>
          <button
            onClick={() => setActiveTab("restricted")}
            className={`px-4 sm:px-6 py-3 flex items-center rounded-2xl w-full sm:w-auto justify-center whitespace-nowrap ${
              activeTab === "restricted"
                ? "bg-[#001571] text-white"
                : "text-[#B0B6D3]"
            }`}
          >
            <span>Restricted Candidates</span>
            <PiCheckCircle size={18} className="ml-2" />
          </button>
        </div>
      )}
      {/* Search */}
      <div className="bg-[#E6E8F1] flex items-center px-4 sm:px-6 lg:px-10 mb-5 py-3 sm:py-4 rounded-2xl shadow-sm w-full">
        <IoSearchSharp
          size={20}
          className="text-[#001571] min-w-[20px] sm:min-w-[25px] flex-shrink-0"
        />
        <input
          type="text"
          placeholder="Search candidates..."
          className="ml-3 sm:ml-4 text-sm sm:text-base text-[#8A93BE] bg-[#E6E8F1] font-bold outline-none w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Job Type Filters */}
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
          <label className="block text-sm font-semibold text-[#001571]">
            Filter by Job Type
          </label>
          {(selectedJobTypes.length > 0 || searchQuery) && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-[#EC221F] hover:text-red-700 font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {JOB_TYPE_OPTIONS.map((type) => (
            <button
              key={type}
              onClick={() => handleJobTypeToggle(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedJobTypes.includes(type)
                  ? "bg-[#001571] text-white shadow-md"
                  : "bg-[#E6E8F1] text-[#8A93BE] hover:bg-[#d8dae8]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate List Header with Select All - Hidden on mobile */}
      <div className="hidden lg:block w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[#8A93BE] text-sm lg:text-base font-semibold text-left">
              <th className="px-2 lg:px-4 py-3 w-[3%]">
                {session?.user?.role === "admin" && (
                  <input
                    type="checkbox"
                    className="form-checkbox text-[#001571] border-gray-300 rounded cursor-pointer"
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length === filteredJobseekers.length
                    }
                    onChange={handleSelectAll}
                  />
                )}
              </th>
              <th className="px-2 lg:px-4 py-3 w-[24.25%]">Candidate Name</th>
              <th className="px-2 lg:px-4 py-3 w-[24.25%]">Email</th>
              <th className="px-2 lg:px-4 py-3 w-[24.25%]">Phone</th>
              <th className="px-2 lg:px-4 py-3 w-[24.25%]">Actions</th>
            </tr>
          </thead>
        </table>
      </div>

      <div className="grid gap-4 grid-cols-1">
        {filteredJobseekers
          .slice(
            (currentPage - 1) * candidatesPerPage,
            currentPage * candidatesPerPage,
          )
          .map((jobseeker) => (
            <CandidateCard
              key={jobseeker._id}
              jobseeker={jobseeker}
              onUpdate={handleJobseekerUpdate}
              isSelected={selectedIds.includes(jobseeker._id)}
              onSelect={handleSelectOne}
              onDelete={handleDelete}
            />
          ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <nav className="flex gap-1 sm:gap-2 items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 sm:px-3 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-400"
            }`}
          >
            <BsChevronLeft size={15} />
          </button>
          <div className="flex gap-1 sm:gap-2 overflow-x-auto max-w-[200px] sm:max-w-none">
            {Array.from(
              {
                length: Math.ceil(
                  filteredJobseekers.length / candidatesPerPage,
                ),
              },
              (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                    currentPage === index + 1
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 hover:bg-gray-400"
                  }`}
                >
                  {index + 1}
                </button>
              ),
            )}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={
              currentPage ===
              Math.ceil(filteredJobseekers.length / candidatesPerPage)
            }
            className={`px-2 sm:px-3 py-2 rounded-lg ${
              currentPage ===
              Math.ceil(filteredJobseekers.length / candidatesPerPage)
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-400"
            }`}
          >
            <BsChevronRight size={15} />
          </button>
        </nav>
      </div>

      {newJobSeekerForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#001571]">
                Add New Candidate
              </h4>
              <button
                onClick={() => setNewJobseekerForm(false)}
                className="text-gray-500 hover:text-red-500 focus:outline-none flex-shrink-0"
              >
                <FaTimes size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Admin Details */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#001571]">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={newJobseeker.firstName}
                      onChange={handleInputChange}
                      className="mt-1 sm:mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#001571]">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={newJobseeker.lastName}
                      onChange={handleInputChange}
                      className="mt-1 sm:mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#001571]">
                      Email
                    </label>
                    <input
                      type="tel"
                      name="email"
                      value={newJobseeker.email}
                      onChange={handleInputChange}
                      className="mt-1 sm:mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3"
                      required
                    />
                  </div>
                  <PhoneNumberInput
                    value={newJobseeker.contactNumber}
                    onChange={(phone) =>
                      setNewJobseeker({ ...newJobseeker, contactNumber: phone })
                    }
                    label="Phone"
                    placeholder="Enter phone number"
                    required
                  />
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#001571]">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={newJobseeker.password}
                      onChange={handleInputChange}
                      className="mt-1 sm:mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#001571]">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={newJobseeker.confirmPassword}
                      onChange={handleInputChange}
                      className="mt-1 sm:mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3"
                      required
                    />
                  </div>
                </div>

                <hr className="my-4" />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-[#001571] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold w-full sm:w-auto ${
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? "Adding..." : "Add Recruiter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
