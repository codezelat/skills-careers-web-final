"use client"

import InquiryCard from "@/components/PortalComponents/inquiryCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminInquiries() {

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
        <>
            <div className="min-h-screen bg-white rounded-3xl py-5 px-7">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-[#001571]">Help & Inquiries</h1>
                </div>
                <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-[#8A93BE] text-base font-semibold text-left">
                                <th className="py-3 pl-12 w-[25%]">Profile Name</th>
                                <th className="py-3 w-[20%]">User Type</th>
                                <th className="py-3 w-[20%]">Date</th>
                                <th className="py-3 w-[20%]">Time</th>
                                <th className="py-3 w-[15%]">Action</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div className="grid gap-4 grid-cols-1">
                    {filteredInquiries.length > 0 ? (
                        filteredInquiries
                            .map((inquiry, index) => (
                                <InquiryCard
                                    key={index}
                                    inquiry={inquiry}
                                    onViewInquiry={() => handleInquirySelect(inquiry)}
                                />
                            ))
                    ) : (
                        <p className="text-lg text-center font-bold text-red-500 py-20">
                            No Inquiries found.
                        </p>
                    )}
                </div>

                {/* Pagination */}
                {/* <div className="flex justify-center mt-4">
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
            </div> */}
            </div>
        </>
    )
}