"use client";
import Image from "next/image";
import { FaLocationDot, FaTicketAlt } from "react-icons/fa6";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import { GiDuration } from "react-icons/gi";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function TicketsCard({ ticket, fetchTickets }) {
  const { data: session } = useSession();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventDate = new Date(ticket.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!session) {
      setError("You must be logged in to book an event.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Fetch jobseeker details using session.user.id
      const jobseekerResponse = await fetch(
        `/api/jobseekerdetails/get?userId=${session.user.id}`
      );
      const jobseekerData = await jobseekerResponse.json();

      if (!jobseekerResponse.ok || !jobseekerData.jobseeker) {
        throw new Error("Only job seekers can apply.");
      }

      if (!jobseekerResponse.ok || !jobseekerData.jobseeker) {
        throw new Error("Failed to fetch jobseeker details.");
      }

      const jobseekerId = jobseekerData.jobseeker._id;

      // Submit enrollment data
      const response = await fetch("/api/ticketenrollments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticket._id,
          ticketName: ticket.name,
          jobseekerId,
          name: formData.name,
          email: formData.email,
          contactNumber: formData.contactNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to book event.");

      setShowBookingForm(false);
      fetchTickets(); // Refresh the tickets list

      Swal.fire({
        title: "Success!",
        text: "Enrollment successful! Please check your email.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#001571",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <div className="mb-6 group">
      <div className="flex flex-col md:flex-row w-full border border-gray-100 rounded-2xl bg-white hover:bg-[#F8F9FC] p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300">

        {/* Image Container */}
        <div className="flex-shrink-0 w-full md:w-auto mb-6 md:mb-0 md:mr-8 flex justify-center items-center bg-gray-50 rounded-xl p-4 md:p-2">
          <Image
            src={ticket.eventProfile || "/images/image-placeholder.jpg"}
            alt={`${ticket.recruiter?.recruiterName || "Company"} logo`}
            width={180}
            height={180}
            className="object-contain w-48 h-48 md:w-40 md:h-40 mix-blend-multiply"
          />
        </div>

        {/* Content Container */}
        <div className="flex flex-col w-full justify-between">
          <div>
            {/* Header: Title and Availability */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="w-full md:w-auto">
                <h3 className="text-xl md:text-2xl font-bold text-[#001571] text-center md:text-left leading-tight">
                  {ticket.name}
                </h3>
                <p className="text-sm text-gray-500 font-medium mt-1 text-center md:text-left">
                  by {ticket.recruiter?.recruiterName || "Unknown Recruiter"}
                </p>
              </div>

              <div className="flex items-center justify-center md:justify-end w-full md:w-auto bg-gray-50 md:bg-transparent py-2 md:py-0 rounded-lg md:rounded-none">
                {(() => {
                  const availableSeats = ticket.capacity - (ticket.enrolledCount || 0);

                  if (availableSeats <= 0) {
                    return (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                        Fully Booked
                      </span>
                    );
                  }

                  if (availableSeats <= 10) {
                    return (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                        {availableSeats} {availableSeats === 1 ? 'seat' : 'seats'} left
                      </span>
                    );
                  }

                  return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#001571]/5 text-[#001571] border border-[#001571]/10">
                      {availableSeats} {availableSeats === 1 ? 'seat' : 'seats'} available
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 mt-6">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-[#001571]/5 rounded-lg text-[#001571]">
                  <FaLocationDot size={16} />
                </div>
                <p className="font-medium text-sm sm:text-base truncate">{ticket.location}</p>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-[#001571]/5 rounded-lg text-[#001571]">
                  <MdDateRange size={16} />
                </div>
                <p className="font-medium text-sm sm:text-base">{eventDate}</p>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-[#001571]/5 rounded-lg text-[#001571]">
                  <GiDuration size={16} />
                </div>
                <p className="font-medium text-sm sm:text-base">
                  {ticket.startTime} - {ticket.endTime}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-500">
              <span className="font-semibold text-[#001571]">Closing Date:</span>
              <span>{ticket.closingDate}</span>
            </div>

            <p className="text-gray-600 mt-5 leading-relaxed text-sm md:text-base line-clamp-3 text-justify md:text-left opacity-90">
              {ticket.description}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center md:justify-end mt-6 pt-4 border-t border-gray-100 md:border-0 md:pt-0">
            {ticket.capacity - (ticket.enrolledCount || 0) > 0 ? (
              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full md:w-auto group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-[#001571] rounded-xl hover:bg-[#001c96] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#001571] focus:ring-offset-2"
              >
                <span className="mr-2">Book Now</span>
                <BsArrowUpRightCircleFill className="text-lg transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            ) : (
              <button
                disabled
                className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 font-bold text-gray-400 bg-gray-100 rounded-xl cursor-not-allowed border border-gray-200"
              >
                Sold Out
              </button>
            )}
          </div>
        </div>
      </div>

      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Enroll for {ticket.name}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#001571] text-white rounded hover:bg-[#000d3d] disabled:bg-gray-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Enroll"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
