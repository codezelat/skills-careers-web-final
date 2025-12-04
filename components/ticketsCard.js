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
      setError("You must be logged in to book a ticket.");
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
        throw new Error(data.message || "Failed to book ticket.");

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
    <div className="mb-4">
      <div className="flex flex-row w-full border rounded-lg bg-white hover:bg-[#EDF0FF] p-6 shadow-md">
        <div className="flex-shrink-0 mt-5 lg:mt-0 md:pt-0 mb-4 md:mb-0 md:mr-6 flex justify-center items-center">
          <Image
            src={ticket.eventProfile || "/images/image-placeholder.jpg"}
            alt={`${ticket.recruiter?.recruiterName || "Company"} logo`}
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col md:flex-row w-full">
          <div className="flex-grow">
            <div className="flex flex-col lg:flex-row md:flex-row justify-between items-start lg:items-center md:items-center mt-4 md:mt-0">
              <h3 className="flex items-center text-xl text-center font-bold text-[#001571]">
                {ticket.name} By {ticket.recruiter.recruiterName}
              </h3>
              <div className="flex items-center gap-2 mt-2 md:mt-0 text-[#001571]">
                <p className="text-black font-semibold">
                  {ticket.enrolledCount}/{ticket.capacity} Available
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mt-4 md:mt-4">
              <div className="flex items-center gap-1">
                <FaLocationDot size={20} className="text-[#001571]" />
                <p className="text-black font-semibold">{ticket.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <MdDateRange size={20} className="text-[#001571]" />
                <p className="text-black font-semibold">{eventDate}</p>
              </div>
              <div className="flex items-center gap-2">
                <GiDuration size={20} className="text-[#001571]" />
                <p className="text-black font-semibold">
                  {ticket.startTime} - {ticket.endTime}
                </p>
              </div>
            </div>
            <p className="text-black font-semibold mt-2">
              Closing Date : {ticket.closingDate}
            </p>

            <p className="line-clamp-4 text-black mt-8 mb-6 text-justify">
              {ticket.description}
            </p>
            <div className="flex flex-col md:flex-row gap-4 mt-4 justify-end">
              <button
                onClick={() => setShowBookingForm(true)}
                className="text-[#001571] border-[#001571] border-2 px-4 py-2 rounded-md"
              >
                <p className="flex text-lg font-bold justify-center">
                  Book Now
                  <span className="ml-3 mt-1 font-bold text-lg">
                    <BsArrowUpRightCircleFill />
                  </span>
                </p>
              </button>
            </div>
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
