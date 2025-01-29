"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { PiCheckCircle } from "react-icons/pi";
import { RiDeleteBinFill } from "react-icons/ri";
import { BsChevronLeft, BsChevronRight, BsFillEyeFill, BsPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import RecruiterCard from "@/components/PortalComponents/portalRecruiterCard";
import PortalLoading from "../loading";
import { FaTimes } from "react-icons/fa";
import AddRecruiterForm from "./addRecruiterForm";

export default function Recruiters() {
  const [activeTab, setActiveTab] = useState("all");
  const [userType, setUserType] = useState("All");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  const [activeSection, setActiveSection] = useState("recruiters");

  const [recruiters, setRecruiters] = useState([]);
  const [filteredRecruiters, setFilteredRecruiters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  });

  useEffect(() => {
    if (session?.user?.email) {
      const fetchRecruiters = async () => {
        try {
          const response = await fetch("/api/recruiterdetails/all");
          const data = await response.json();
          setRecruiters(data.recruiters);
          setFilteredRecruiters(data.recruiters);
        } catch (error) {
          console.error("Error fetching recruiters:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchRecruiters();
    }
  }, [session]);

  // Handle search query change
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredRecruiters(
      recruiters.filter(
        (recruiter) =>
          recruiter.recruiterName.toLowerCase().includes(query)
        // recruiter.industry.toLowerCase().includes(query) ||
        // recruiter.location.toLowerCase().includes(query)
      )
    );
  };

  const handleRecruiterSelect = (recruiter) => {
    setSelectedRecruiter(recruiter);
  };

  const [newRecruiter, setNewRecruiter] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    recruiterName: '',
    employeeRange: '',
    email: '',
    telephoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  // createRecruiter function
  async function createRecruiter(
    firstName,
    lastName,
    contactNumber,
    recruiterName,
    employeeRange,
    email,
    telephoneNumber,
    password,
    confirmPassword
  ) {
    const response = await fetch("/api/auth/recruitersignup", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        contactNumber,
        recruiterName,
        employeeRange,
        email,
        telephoneNumber,
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

  // Update handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createRecruiter(
        newRecruiter.firstName,
        newRecruiter.lastName,
        newRecruiter.contactNumber,
        newRecruiter.recruiterName,
        newRecruiter.employeeRange,
        newRecruiter.email,
        newRecruiter.telephoneNumber,
        newRecruiter.password,
        newRecruiter.confirmPassword
      );
      alert(result.message);
      setShowApplicationForm(false);
      
      const response = await fetch("/api/recruiterdetails/all");
      const data = await response.json();
      setRecruiters(data.recruiters);
      setFilteredRecruiters(data.recruiters);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // handleInputChange for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecruiter(prev => ({ ...prev, [name]: value }));
  };

  // pagination function
  const [currentPage, setCurrentPage] = useState(1);
  const recruitersPerPage = 6;

  const totalPages = Math.ceil(filteredRecruiters.length / recruitersPerPage);

  const indexOfLastRecruiter = currentPage * recruitersPerPage;
  const indexOfFirstRecruiter = indexOfLastRecruiter - recruitersPerPage;
  const currentRecruiters = filteredRecruiters.slice(indexOfFirstRecruiter, indexOfLastRecruiter);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <PortalLoading />;
  }

  return (
    <div className="min-h-screen bg-white rounded-3xl py-5 px-7">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#001571]">Recruiters</h1>
        <button
          className="bg-[#001571] text-white px-6 py-2 rounded-2xl shadow hover:bg-blue-800 flex items-center text-sm font-semibold"
          onClick={() => setShowApplicationForm(true)}
        >
          <BsPlus size={25} className="mr-1" />Add New
        </button>
      </div>

      <div className="flex items-center justify-center p-1 mb-5 bg-[#E6E8F1] rounded-2xl w-max text-sm font-medium">
        {/* All Recruiters Button */}
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-3 flex rounded-2xl ${activeTab === "all"
            ? "bg-[#001571] text-white"
            : "text-[#B0B6D3] bg-[#E6E8F1]"
            }`}
        >
          All Recruiters
          <span className="ml-2">
            <PiCheckCircle size={20} />
          </span>
        </button>

        {/* Restricted Recruiters Button */}
        <button
          onClick={() => setActiveTab("restricted")}
          className={`px-6 py-3 flex rounded-2xl text-sm font-semibold ${activeTab === "restricted"
            ? "bg-[#001571] text-white"
            : "text-[#B0B6D3] bg-[#E6E8F1]"
            }`}
        >
          Restricted Recruiters
          <span className="ml-2">
            <PiCheckCircle size={20} />
          </span>
        </button>
      </div>

      {activeTab === "all" ? (
        <>
          <div className="flex-grow ">
            <div className="bg-[#E6E8F1] flex items-center pl-10 pr-10 mb-5 py-4 rounded-2xl shadow-sm w-full">
              <IoSearchSharp size={25} className="text-[#001571]" />
              <input
                type="text"
                placeholder="Search Job Posts..."
                className="ml-4 text-[#8A93BE] bg-[#E6E8F1] font-bold outline-none w-full"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
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

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-[#8A93BE] text-base font-semibold text-left">
                  <th className="px-4 py-3 w-[3%]"></th>
                  <th className="px-4 py-3 w-[24.25%]">Recruiter Name</th>
                  <th className="px-4 py-3 w-[24.25%]">Email</th>
                  <th className=" px-4 py-3 w-[24.25%]">Phone</th>
                  <th className="px-4 py-3 w-[24.25%]">Actions</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="grid gap-4 grid-cols-1">
            {currentRecruiters.length > 0 ? (
              currentRecruiters.map((recruiter) => (
                <RecruiterCard
                  key={recruiter._id}
                  recruiter={recruiter}
                  onViewRecruiter={() => handleRecruiterSelect(recruiter)}
                />
              ))
            ) : (
              <p className="text-lg text-center font-bold text-red-500 py-20">
                No jobs found.
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex-grow ">
            <div className="bg-[#E6E8F1] flex items-center pl-4 pr-4 mb-5 py-4 rounded-lg shadow-sm w-full">
              <IoSearchSharp size={25} className="text-[#001571]" />
              <input
                type="text"
                placeholder="Search Recruiters..."
                className="ml-2 text-[#8A93BE] bg-[#E6E8F1] font-bold outline-none w-full"
              />
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4 mb-4 items-center bg-green">
            <button className="flex bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800">
              <span className="mr-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                />
              </span>
              Select More
            </button>

            <button className="flex bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-600">
              <span className="mr-2">
                <BsFillEyeFill size={20} />
              </span>
              Unrestricted
            </button>

            <button className="flex bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-600">
              <span className="mr-2">
                <RiDeleteBinFill size={20} />
              </span>
              Delete
            </button>
          </div>


        </>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <nav className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-[10px] py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-400'}`}
          >
            <BsChevronLeft size={15} />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-400'}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-[10px] py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-400'}`}
          >
            <BsChevronRight size={15} />
          </button>
        </nav>
      </div>

      {showApplicationForm && (
        <AddRecruiterForm
          showForm={showApplicationForm}
          onClose={() => setShowApplicationForm(false)}
          newRecruiter={newRecruiter}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
