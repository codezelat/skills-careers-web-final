"use client";
import { FaTimes } from "react-icons/fa";
import PhoneNumberInput from "@/components/PhoneInput";
import { PiCheckCircle } from "react-icons/pi";

export default function NameEditForm({
  userDetails,
  jobSeekerDetails,
  handleInputChange,
  handleUserInputChange,
  jobseekerUpdateSubmitHandler,
  isSubmitting,
  onClose,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {/* Popup Container */}
      <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Edit Personal Profile Details
          </h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={jobseekerUpdateSubmitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={userDetails.firstName || ""}
                  onChange={handleUserInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={userDetails.lastName || ""}
                  onChange={handleUserInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={jobSeekerDetails.position || ""}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                />
              </div>
              <PhoneNumberInput
                value={userDetails.contactNumber || ""}
                onChange={(phone) =>
                  handleUserInputChange({
                    target: { name: "contactNumber", value: phone },
                  })
                }
                label="Phone Number"
                placeholder="Enter phone number"
                disabled={false}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Personal Profile
              </label>
              <input
                type="text"
                name="personalProfile"
                value={jobSeekerDetails.personalProfile || ""}
                onChange={handleInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  LinkedIn
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={jobSeekerDetails.linkedin || ""}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  X
                </label>
                <input
                  type="text"
                  name="x"
                  value={jobSeekerDetails.x || ""}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Facebook
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={jobSeekerDetails.facebook || ""}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Instagram
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={jobSeekerDetails.instagram || ""}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Github
                </label>
                <input
                  type="text"
                  name="github"
                  value={jobSeekerDetails.github || ""}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Dribbble
                </label>
                <input
                  type="text"
                  name="dribbble"
                  value={jobSeekerDetails.dribbble || ""}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            onClick={jobseekerUpdateSubmitHandler}
            disabled={isSubmitting}
            className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save"}
            <span className="ml-2">
              <PiCheckCircle size={20} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
