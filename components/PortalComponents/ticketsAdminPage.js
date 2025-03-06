"use client";
import React, { useEffect, useState, useCallback } from "react";
import { IoAdd, IoSearchSharp } from "react-icons/io5";
import { PiCheckCircle } from "react-icons/pi";
import { RiDeleteBinFill } from "react-icons/ri";
import { BsChevronLeft, BsChevronRight, BsFillEyeFill, BsPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaTimes } from "react-icons/fa";
import PortalTicketsCard from "@/components/PortalComponents/portalTicketsCard";
import PortalLoading from "@/app/Portal/loading";

export default function AdminsTicketsPage(props) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        date: "",
        startTime: "",
        endTime: "",
        capacity: "",
        closingDate: "",
    });

    // Edit form state
    const [editFormData, setEditFormData] = useState({
        _id: "",
        name: "",
        description: "",
        location: "",
        date: "",
        startTime: "",
        endTime: "",
        capacity: "",
        closingDate: "",
    });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchTickets();
        }
    }, [session]);

    const fetchTickets = async () => {
        try {

            const ticketsResponse = await fetch(`/api/ticket/all`);
            if (!ticketsResponse.ok) {
                throw new Error("Failed to fetch tickets");
            }
            const ticketsData = await ticketsResponse.json();

            setTickets(ticketsData.tickets);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching tickets:", err);
        } finally {
            setLoading(false);
        }
    };

    const convertTo12HourFormat = (time) => {
        if (!time) return "";

        const [hours, minutes] = time.split(":");

        let hour = parseInt(hours, 10);

        const ampm = hour >= 12 ? "PM" : "AM";

        hour = hour % 12;
        hour = hour ? hour : 12;

        return `${hour}:${minutes} ${ampm}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            const startTime12Hour = convertTo12HourFormat(formData.startTime);
            const endTime12Hour = convertTo12HourFormat(formData.endTime);

            const recruiterResponse = await fetch(`/api/recruiterdetails/get?userId=${session.user.id}`);
            if (!recruiterResponse.ok) {
                throw new Error("Failed to fetch recruiter details");
            }
            const recruiterData = await recruiterResponse.json();

            const recruiterId = recruiterData.id;

            const response = await fetch("/api/ticket/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    startTime: startTime12Hour,
                    endTime: endTime12Hour,
                    recruiterId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create ticket");
            }

            setIsFormVisible(false);
            fetchTickets();

            setFormData({
                name: "",
                description: "",
                location: "",
                date: "",
                startTime: "",
                endTime: "",
                capacity: "",
                closingDate: "",
            });
        } catch (error) {
            console.error("Ticket creation error:", error);
            alert(error.message || "Failed to create ticket. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const convertTo24HourFormat = (time) => {
        if (!time) return "";

        const [timePart, ampm] = time.split(" ");
        const [hours, minutes] = timePart.split(":");

        let hour = parseInt(hours, 10);

        if (ampm === "PM" && hour < 12) {
            hour += 12;
        } else if (ampm === "AM" && hour === 12) {
            hour = 0;
        }

        return `${hour.toString().padStart(2, "0")}:${minutes}`;
    };

    const handleEdit = useCallback((ticket) => {
        setEditFormData({
            _id: ticket._id,
            name: ticket.name,
            description: ticket.description,
            location: ticket.location,
            date: ticket.date,
            startTime: convertTo24HourFormat(ticket.startTime),
            endTime: convertTo24HourFormat(ticket.endTime),
            capacity: ticket.capacity,
            closingDate: ticket.closingDate,
        });
        setIsEditFormVisible(true);
    }, []);

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/ticket/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editFormData),
            });

            if (!response.ok) {
                throw new Error("Failed to update ticket");
            }

            setIsEditFormVisible(false);
            fetchTickets();
        } catch (error) {
            console.error("Ticket update error:", error);
            alert(error.message || "Failed to update ticket. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 6;
    const totalPages = Math.ceil(tickets.length / ticketsPerPage);
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

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
                <h1 className="text-xl font-bold text-[#001571]">Tickets</h1>
                {/* <button
                    className="bg-[#001571] text-white px-6 py-2 rounded-2xl shadow hover:bg-blue-800 flex items-center text-sm font-semibold"
                    onClick={() => setIsFormVisible(true)}
                >
                    <BsPlus size={25} className="mr-1" />Add New
                </button> */}
            </div>

            {/* Tabs */}
            {/* <div className="flex items-center justify-center p-1 mb-5 bg-[#E6E8F1] rounded-2xl w-max text-sm font-medium">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-6 py-3 flex rounded-2xl ${activeTab === "all" ? "bg-[#001571] text-white" : "text-[#B0B6D3] bg-[#E6E8F1]"}`}
                >
                    All Tickets
                    <span className="ml-2">
                        <PiCheckCircle size={20} />
                    </span>
                </button>
            </div> */}

            {activeTab === "all" && (
                <>
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
                                    <th className="py-3 w-[24.25%]">Event Name</th>
                                    <th className="py-3 w-[24.25%]">Date</th>
                                    <th className="py-3 w-[24.25%]">Location</th>
                                    <th className="py-3 w-[24.25%]">Actions</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div className="grid gap-4 grid-cols-1">
                        {currentTickets.length > 0 ? (
                            currentTickets.map((ticket, index) => (
                                <PortalTicketsCard key={index} ticket={ticket} onEdit={handleEdit} />
                            ))
                        ) : (
                            <p className="text-lg text-center font-bold text-red-500 py-20">
                                No tickets found.
                            </p>
                        )}
                    </div>
                </>
            )}

            {/* Add Ticket Form */}
            {isFormVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h4 className="text-2xl font-semibold text-[#001571]">Add Ticket</h4>
                            <button
                                onClick={() => setIsFormVisible(false)}
                                className="text-gray-500 hover:text-red-500 focus:outline-none"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Event Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Capacity
                                    </label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Closing Date
                                    </label>
                                    <input
                                        type="date"
                                        name="closingDate"
                                        value={formData.closingDate}
                                        onChange={handleInputChange}
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="border-t border-gray-200 pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`bg-[#001571] text-white px-6 py-3 rounded-xl shadow-sm text-sm font-semibold flex items-center ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                                    >
                                        {isSubmitting ? "Creating..." : "Create Ticket"}
                                        <PiCheckCircle className="ml-2" size={20} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Ticket Form */}
            {isEditFormVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h4 className="text-2xl font-semibold text-[#001571]">Edit Ticket</h4>
                            <button
                                onClick={() => setIsEditFormVisible(false)}
                                className="text-gray-500 hover:text-red-500 focus:outline-none"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <form onSubmit={handleEditSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Event Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleEditInputChange}
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={editFormData.location}
                                        onChange={handleEditInputChange}
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={editFormData.date}
                                        onChange={handleEditInputChange}
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={editFormData.startTime}
                                        onChange={handleEditInputChange}
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={editFormData.endTime}
                                        onChange={handleEditInputChange}
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Capacity
                                    </label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        value={editFormData.capacity}
                                        onChange={handleEditInputChange}
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Closing Date
                                    </label>
                                    <input
                                        type="date"
                                        name="closingDate"
                                        value={editFormData.closingDate}
                                        onChange={handleEditInputChange}
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-[#001571]">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={editFormData.description}
                                        onChange={handleEditInputChange}
                                        rows="4"
                                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm px-4 py-3"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="border-t border-gray-200 pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`bg-[#001571] text-white px-6 py-3 rounded-xl shadow-sm text-sm font-semibold flex items-center ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                                    >
                                        {isSubmitting ? "Updating..." : "Update Ticket"}
                                        <PiCheckCircle className="ml-2" size={20} />
                                    </button>
                                </div>
                            </form>
                        </div>
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