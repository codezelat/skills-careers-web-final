"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AdminNavBar from "../AdminNav";
import { useRouter } from "next/navigation";
import UpdateInquiryForm from "./UpdateInquiryForm";
import InquiryCard from "./InquiryCard";

function HelpandContact() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState("helpandcontact");

  const [inquiries, setInquiries] = useState([]); // Original Inquirys
  const [filteredInquiries, setFilteredInquiries] = useState([]);

  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  });
  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/inquiry/all");

      if (!response.ok) {
        throw new Error("Failed to fetch Inquiries.");
      }

      const data = await response.json();
      setInquiries(data.inquiries);
      setFilteredInquiries(data.inquiries);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  //   To refresh all data fetching every 60 seconds
  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([fetchInquiries()]);
    };
    fetchAllData();
    const intervalId = setInterval(fetchAllData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleInquirySelect = (inquiry) => {
    setSelectedInquiry(inquiry);
  };

  const handleCloseInquiry = () => {
    setSelectedInquiry(null);
  };

  return (
    <div className="p-4">
      {/* Title Bar */}
      <div className="h-[10vh] flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Help & Contact</h1>
        <input
          type="search"
          placeholder="Search by inquiry name"
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
                Inquiries
              </h2>
            </div>

            {selectedInquiry && (
              <UpdateInquiryForm 
                inquiry={selectedInquiry}
                onClose={handleCloseInquiry}
              />
            )}

            <div className="grid grid-cols-1">
              {filteredInquiries.length > 0 ? (
                filteredInquiries
                  .map((inquiry, index) => (
                    <InquiryCard
                      key={index}
                      inquiry={inquiry}
                      onViewInquiry={() => handleInquirySelect(inquiry)}
                    />
                  ))
                  .reverse()
              ) : (
                <p className="col-span-4 text-lg text-center font-bold text-red-500 py-20">
                  No Inquiries found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HelpandContact;
