"use client";
import React, { useEffect, useState, useCallback } from "react";
import { IoAdd, IoSearchSharp } from "react-icons/io5";
import { PiCheckCircle } from "react-icons/pi";
import { RiDeleteBinFill } from "react-icons/ri";
import { BsChevronLeft, BsChevronRight, BsFillEyeFill, BsPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PortalLoading from "@/app/Portal/loading";
import { FaTimes } from "react-icons/fa";
import PortalTicketsCard from "@/components/PortalComponents/portalTicketsCard";
import EnrollTicketsCard from "./ticketEnrollCard";

export default function BookingAdminPage(props) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [ticketEnrollments, setTicketEnrollments] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchTicketEnrollments();
        }
    }, [session]);

    // Fetch enrolled ticket details
    const fetchTicketEnrollments = useCallback(async () => {
        try {
            const enrollmentsResponse = await fetch("/api/ticketenrollments/allJoined");
            if (!enrollmentsResponse.ok) {
                throw new Error("Failed to fetch ticket enrollments");
            }
            const enrollmentsData = await enrollmentsResponse.json();
            console.log("Enrolled data : ", enrollmentsData);
            setTicketEnrollments(enrollmentsData.data);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchTicketEnrollments();
        }
    }, [session, fetchTicketEnrollments]);

    // Handle "View" button click
    const handleViewTicket = useCallback((ticket) => {
        setSelectedTicket(ticket);
        setIsPopupVisible(true);
    }, []);

    // Close the popup
    const closePopup = useCallback(() => {
        setIsPopupVisible(false);
        setSelectedTicket(null);
    }, []);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 6;
    const totalPages = Math.ceil(ticketEnrollments.length / ticketsPerPage);
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentEnrolledTickets = ticketEnrollments.slice(indexOfFirstTicket, indexOfLastTicket);

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
                <h1 className="text-xl font-bold text-[#001571]">Booking Record</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-grow ">
                <div className="bg-[#E6E8F1] flex items-center pl-10 pr-10 mb-5 py-4 rounded-2xl shadow-sm w-full">
                    <IoSearchSharp size={25} className="text-[#001571]" />
                    <input
                        type="text"
                        placeholder="Search Tickets..."
                        className="ml-4 text-[#8A93BE] bg-[#E6E8F1] font-bold outline-none w-full"
                    />
                </div>
            </div>

            {/* Tickets Table */}
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-[#8A93BE] text-base font-semibold text-left">
                            <th className="py-3 w-[3%]"></th>
                            <th className="py-3 w-[27.333%]">Event Name</th>
                            <th className="py-3 w-[27.333%]">Event Location</th>
                            <th className="py-3 w-[27.333%]">Enroller Name</th>
                            <th className="py-3 w-[15%]">Actions</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div className="grid gap-4 grid-cols-1">
                {currentEnrolledTickets.length > 0 ? (
                    currentEnrolledTickets.map((enrolledticket, index) => (
                        <EnrollTicketsCard key={index} enrolledticket={enrolledticket} onView={handleViewTicket} />
                    ))
                ) : (
                    <p className="text-lg text-center font-bold text-red-500 py-20">
                        No tickets found.
                    </p>
                )}
            </div>

            {/* Popup for Ticket Details */}
            {isPopupVisible && selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-2/5 max-w-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[#001571]">{selectedTicket.name}'s Enrollment details</h2>
                            <button
                                onClick={closePopup}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="space-y-4 pt-4">
                            <div className="flex flex-row items-center gap-4">
                                <label className="block text-base font-semibold">Event Name</label>
                                <p>:</p>
                                <p className="text-base font-medium">{selectedTicket.eventName}</p>
                            </div>
                            <div className="flex flex-row items-center gap-4">
                                <label className="block text-base font-semibold">Event Location</label>
                                <p>:</p>
                                <p className="text-base font-medium">{selectedTicket.eventLocation}</p>
                            </div>
                            <div className="flex flex-row items-center gap-4">
                                <label className="block text-base font-semibold">Enroller Name</label>
                                <p>:</p>
                                <p className="text-base font-medium">{selectedTicket.name}</p>
                            </div>
                            <div className="flex flex-row items-center gap-4">
                                <label className="block text-base font-semibold">Enroller Email</label>
                                <p>:</p>
                                <p className="text-base font-medium">{selectedTicket.email}</p>
                            </div>
                            <div className="flex flex-row items-center gap-4">
                                <label className="block text-base font-semibold">Enroller Contact</label>
                                <p>:</p>
                                <p className="text-base font-medium">{selectedTicket.contactNumber}</p>
                            </div>
                        </div>
                        {/* <div className="flex flex-row w-full items-center justify-end text-base font-semibold mt-2">
                            <button
                                className="flex items-center justify-center bg-[#c81f1f] text-white px-6 py-[6px] rounded-lg shadow hover:bg-[#992828]"
                            >
                                Delete
                            </button>
                        </div> */}
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <nav className="flex gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-[10px] py-2 rounded-lg ${currentPage === 1 ? "bg-gray-300" : "bg-gray-200 hover:bg-gray-400"}`}
                    >
                        <BsChevronLeft size={15} />
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? "bg-blue-700 text-white" : "bg-gray-200 hover:bg-gray-400"}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-[10px] py-2 rounded-lg ${currentPage === totalPages ? "bg-gray-300" : "bg-gray-200 hover:bg-gray-400"}`}
                    >
                        <BsChevronRight size={15} />
                    </button>
                </nav>
            </div>
        </div>
    );
}