"use client";
import React, { useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { PiCheckCircle } from "react-icons/pi";
import { BsChevronLeft, BsChevronRight, BsPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CandidateCard from "@/components/PortalComponents/portalCandidateCard";
import PortalLoading from "../loading";
import { FaTimes } from "react-icons/fa";

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
  const candidatesPerPage = 6;
  const [newJobSeekerForm, setNewJobseekerForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    confirmPassword
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
  }, [session]);

  const filterJobseekers = (jobseekers, query, tab) => {
    const filtered = (jobseekers || []).filter((jobseeker) => {
      const matchesSearch = (jobseeker.email || "")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesTab = tab === "all" ? true : jobseeker.isRestricted;
      return matchesSearch && matchesTab;
    });
    setFilteredJobseekers(filtered);
  };

  useEffect(() => {
    filterJobseekers(jobseekers, searchQuery, activeTab);
  }, [searchQuery, activeTab, jobseekers]);

  const handleJobseekerUpdate = (updatedJobseeker) => {
    setJobseekers((prev) =>
      prev.map((js) =>
        js._id === updatedJobseeker._id ? { ...js, ...updatedJobseeker } : js
      )
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
        newJobseeker.confirmPassword
      );
      alert(result.message);
      setNewJobseekerForm(false);

      const response = await fetch("/api/jobseekerdetails/all");
      const data = await response.json();
      setJobseekers(data.jobseekers);
    } catch (error) {
      alert(error.message);
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

  if (loading) return <PortalLoading />;

  return (
    <div className="min-h-screen bg-white rounded-3xl py-5 px-7">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#001571]">Candidates</h1>
        {session?.user?.role === "admin" && (
          <button
            className="bg-[#001571] text-white px-6 py-2 rounded-2xl shadow hover:bg-blue-800 flex items-center text-sm font-semibold"
            onClick={() => setNewJobseekerForm(true)}
          >
            <BsPlus size={25} className="mr-1" />
            Add New
          </button>
        )}
      </div>

      {/* Tabs */}
      {session?.user?.role === "admin" && (
        <div className="flex items-center justify-center p-1 mb-5 bg-[#E6E8F1] rounded-2xl w-max text-sm font-medium">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 flex rounded-2xl ${
              activeTab === "all" ? "bg-[#001571] text-white" : "text-[#B0B6D3]"
            }`}
          >
            All Candidates
            <PiCheckCircle size={20} className="ml-2" />
          </button>
          <button
            onClick={() => setActiveTab("restricted")}
            className={`px-6 py-3 flex rounded-2xl ${
              activeTab === "restricted"
                ? "bg-[#001571] text-white"
                : "text-[#B0B6D3]"
            }`}
          >
            Restricted Candidates
            <PiCheckCircle size={20} className="ml-2" />
          </button>
        </div>
      )}
      {/* Search */}
      <div className="bg-[#E6E8F1] flex items-center pl-10 pr-10 mb-5 py-4 rounded-2xl shadow-sm w-full">
        <IoSearchSharp size={25} className="text-[#001571]" />
        <input
          type="text"
          placeholder="Search candidates..."
          className="ml-4 text-[#8A93BE] bg-[#E6E8F1] font-bold outline-none w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Candidate List */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[#8A93BE] text-base font-semibold text-left">
              <th className="px-4 py-3 w-[3%]"></th>
              <th className="px-4 py-3 w-[24.25%]">Candidate Name</th>
              <th className="px-4 py-3 w-[24.25%]">Email</th>
              <th className="px-4 py-3 w-[24.25%]">Phone</th>
              <th className="px-4 py-3 w-[24.25%]">Actions</th>
            </tr>
          </thead>
        </table>
      </div>

      <div className="grid gap-4 grid-cols-1">
        {filteredJobseekers
          .slice(
            (currentPage - 1) * candidatesPerPage,
            currentPage * candidatesPerPage
          )
          .map((jobseeker) => (
            <CandidateCard
              key={jobseeker._id}
              jobseeker={jobseeker}
              onUpdate={handleJobseekerUpdate}
            />
          ))}
      </div>

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
          {Array.from(
            {
              length: Math.ceil(filteredJobseekers.length / candidatesPerPage),
            },
            (_, index) => (
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
            )
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={
              currentPage ===
              Math.ceil(filteredJobseekers.length / candidatesPerPage)
            }
            className={`px-[10px] py-2 rounded-lg ${
              currentPage ===
              Math.ceil(filteredJobseekers.length / candidatesPerPage)
                ? "bg-gray-300"
                : "bg-gray-200 hover:bg-gray-400"
            }`}
          >
            <BsChevronRight size={15} />
          </button>
        </nav>
      </div>

      {newJobSeekerForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h4 className="text-2xl font-semibold text-[#001571]">
                Add New Candidate
              </h4>
              <button
                onClick={() => setNewJobseekerForm(false)}
                className="text-gray-500 hover:text-red-500 focus:outline-none"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Admin Details */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={newJobseeker.firstName}
                      onChange={handleInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={newJobseeker.lastName}
                      onChange={handleInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Email
                    </label>
                    <input
                      type="tel"
                      name="email"
                      value={newJobseeker.email}
                      onChange={handleInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={newJobseeker.contactNumber}
                      onChange={handleInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={newJobseeker.password}
                      onChange={handleInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={newJobseeker.confirmPassword}
                      onChange={handleInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      required
                    />
                  </div>
                </div>

                <hr className="my-4" />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-[#001571] text-white px-6 py-3 rounded-xl text-sm font-semibold ${
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
