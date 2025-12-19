// app/admin/inquiries/AdminInquiriesClient.jsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { BsPlus } from "react-icons/bs";
import PortalLoading from "../loading";
import InquiryCard from "@/components/PortalComponents/inquiryCard";
import AddInquiry from "@/components/PortalComponents/addInquiryForm";

export default function AdminInquiriesClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addInquiryForm, setAddInquiryForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const displayedInquiries = inquiries.filter((inquiry) => {
    if (filterStatus === "All") return true;
    return (inquiry.status || "Pending") === filterStatus;
  });

  const fetchInquiries = useCallback(async () => {
    if (!session?.user?.role) return;
    try {
      setIsLoading(true);
      const response = await fetch(`/api/inquiry/all`);
      if (!response.ok) throw new Error("Failed to fetch inquiries.");
      const data = await response.json();
      setInquiries(data.inquiries);
      setFilteredInquiries(data.inquiries);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  if (isLoading) {
    return <PortalLoading />;
  }

  return (
    <div className="min-h-screen bg-white rounded-3xl py-5 px-7">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#001571]">Help & Inquiries</h1>
        {(session?.user?.role === "jobseeker" || session?.user?.role === "recruiter") && (
          <button
            className="bg-[#001571] text-white px-6 py-2 rounded-2xl shadow hover:bg-blue-800 flex items-center text-sm font-semibold"
            onClick={() => setAddInquiryForm(true)}
          >
            <BsPlus size={25} className="mr-1" />
            Add New
          </button>
        )}
      </div>

      {/* Filter Section */}
      {session?.user?.role === "admin" && (
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <label className="text-[#001571] font-semibold text-sm">Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Solved">Solved</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[#8A93BE] text-base font-semibold text-left">
              <th className="py-3 pl-12 w-[20%]">Profile Name</th>
              <th className="py-3 w-[15%]">User Type</th>
              <th className="py-3 w-[15%]">Date</th>
              <th className="py-3 w-[15%]">Time</th>
              <th className="py-3 w-[15%]">Status</th>
              <th className="py-3 w-[20%]">Action</th>
            </tr>
          </thead>
        </table>
      </div>

      {session?.user?.role === "admin" && (
        <div className="grid gap-4 grid-cols-1">
          {displayedInquiries.length > 0 ? (
            displayedInquiries.map((inquiry, index) => (
              <InquiryCard key={index} inquiry={inquiry} />
            ))
          ) : (
            <p className="text-lg text-center font-bold text-red-500 py-20">
              No Inquiries found.
            </p>
          )}
        </div>
      )}

      {(session?.user?.role === "jobseeker" || session?.user?.role === "recruiter") && (
        <div className="grid gap-4 grid-cols-1">
          {filteredInquiries.length > 0 ? (
            filteredInquiries.map((inquiry, index) => (
              <InquiryCard key={index} inquiry={inquiry} />
            ))
          ) : (
            <p className="text-lg text-center font-bold text-red-500 py-20">
              No Inquiries found.
            </p>
          )}
        </div>
      )}

      {addInquiryForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
            <AddInquiry
              onClose={() => setAddInquiryForm(false)}
              onInquiryAdded={fetchInquiries}
            />
          </div>
        </div>
      )}
    </div>
  );
}