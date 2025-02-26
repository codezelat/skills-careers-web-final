"use client";
import { useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { PiCheckCircle } from "react-icons/pi";
import { BsChevronLeft, BsChevronRight, BsPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PortalLoading from "../loading";
import AddRecruiterForm from "./addRecruiterForm";
import PortalRecruiterCard from "@/components/PortalComponents/portalRecruiterCard";
import RecruiterSearch from "@/components/RecruiterSearch";

export default function Recruiters() {
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();
  const { data: session, status } = useSession();
  const [recruiters, setRecruiters] = useState([]);
  const [filteredRecruiters, setFilteredRecruiters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recruitersPerPage = 6;
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("recruiters");
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [newRecruiter, setNewRecruiter] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    recruiterName: "",
    employeeRange: "",
    email: "",
    telephoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin");
  }, [status, router]);

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const response = await fetch("/api/recruiterdetails/all");
        const data = await response.json();
        setRecruiters(data.recruiters);
        filterRecruiters(data.recruiters, searchQuery, activeTab);
      } catch (error) {
        console.error("Error fetching recruiters:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) fetchRecruiters();
  }, [session]);

  const filterRecruiters = (recruiters, query, tab) => {
    const filtered = recruiters.filter((recruiter) => {
      const matchesSearch = recruiter.recruiterName
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesTab = tab === "all" ? true : recruiter.isRestricted;
      return matchesSearch && matchesTab;
    });
    setFilteredRecruiters(filtered);
  };

  useEffect(() => {
    filterRecruiters(recruiters, searchQuery, activeTab);
  }, [searchQuery, activeTab, recruiters]);

  const handleRecruiterUpdate = (updatedRecruiter) => {
    setRecruiters((prev) =>
      prev.map((r) =>
        r._id === updatedRecruiter._id ? { ...r, ...updatedRecruiter } : r
      )
    );
  };

  const handleRecruiterDelete = (deletedId) => {
    setRecruiters((prev) => prev.filter((r) => r._id !== deletedId));
    setFilteredRecruiters((prev) => prev.filter((r) => r._id !== deletedId));
  };

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(filteredRecruiters.length / recruitersPerPage)
    ) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <PortalLoading />;

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredRecruiters(
      recruiters.filter((recruiter) =>
        recruiter.recruiterName.toLowerCase().includes(query)
      )
    );
  };

  const handleRecruiterSelect = (recruiter) => {
    setSelectedRecruiter(recruiter);
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecruiter((prev) => ({ ...prev, [name]: value }));
  };

  const totalPages = Math.ceil(filteredRecruiters.length / recruitersPerPage);

  const indexOfLastRecruiter = currentPage * recruitersPerPage;
  const indexOfFirstRecruiter = indexOfLastRecruiter - recruitersPerPage;
  const currentRecruiters = filteredRecruiters.slice(
    indexOfFirstRecruiter,
    indexOfLastRecruiter
  );

  return (
    <div className="min-h-screen bg-white rounded-3xl py-5 px-7">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#001571]">Recruiters</h1>
        <button
          className="bg-[#001571] text-white px-6 py-2 rounded-2xl shadow hover:bg-blue-800 flex items-center text-sm font-semibold"
          onClick={() => setShowApplicationForm(true)}
        >
          <BsPlus size={25} className="mr-1" />
          Add New
        </button>
      </div>

      <div className="flex items-center justify-center p-1 mb-5 bg-[#E6E8F1] rounded-2xl w-max text-sm font-medium">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-3 flex rounded-2xl ${
            activeTab === "all" ? "bg-[#001571] text-white" : "text-[#B0B6D3]"
          }`}
        >
          All Recruiters
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
          Restricted Recruiters
          <PiCheckCircle size={20} className="ml-2" />
        </button>
      </div>

      {/* <div className="bg-[#E6E8F1] flex items-center mb-5 py-4 rounded-2xl shadow-sm w-full">
        <IoSearchSharp size={25} className="text-[#001571]" />
        <input
          type="text"
          placeholder="Search recruiters..."
          className="ml-4 text-[#8A93BE] bg-[#E6E8F1] font-bold outline-none w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div> */}
      <RecruiterSearch />

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[#8A93BE] text-base font-semibold text-left">
              <th className="px-4 py-3 w-[3%]"></th>
              <th className="px-4 py-3 w-[24.25%]">Recruiter Name</th>
              <th className="px-4 py-3 w-[24.25%]">Email</th>
              <th className="px-4 py-3 w-[24.25%]">Phone</th>
              <th className="px-4 py-3 w-[24.25%]">Actions</th>
            </tr>
          </thead>
        </table>
      </div>

      <div className="grid gap-4 grid-cols-1">
        {filteredRecruiters
          .slice(
            (currentPage - 1) * recruitersPerPage,
            currentPage * recruitersPerPage
          )
          .map((recruiter) => (
            <PortalRecruiterCard
              key={recruiter._id}
              recruiter={recruiter}
              onUpdate={handleRecruiterUpdate}
              onDelete={handleRecruiterDelete}
            />
          ))}
      </div>

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
              length: Math.ceil(filteredRecruiters.length / recruitersPerPage),
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
              Math.ceil(filteredRecruiters.length / recruitersPerPage)
            }
            className={`px-[10px] py-2 rounded-lg ${
              currentPage ===
              Math.ceil(filteredRecruiters.length / recruitersPerPage)
                ? "bg-gray-300"
                : "bg-gray-200 hover:bg-gray-400"
            }`}
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
