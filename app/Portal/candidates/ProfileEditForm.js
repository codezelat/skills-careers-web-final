"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import PhoneNumberInput from "@/components/PhoneInput";
import { PiCheckCircle } from "react-icons/pi";
import { FiInfo } from "react-icons/fi";

export default function NameEditForm({
  userDetails,
  jobSeekerDetails,
  handleInputChange,
  handleUserInputChange,
  jobseekerUpdateSubmitHandler,
  isSubmitting,
  onClose,
}) {
  const [showPositionInfo, setShowPositionInfo] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      {/* Popup Container */}
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
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
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-[#001571]">
                    Position
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPositionInfo(!showPositionInfo)}
                    className="text-[#001571] hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                    title="Position guide"
                  >
                    <FiInfo size={18} />
                  </button>
                </div>

                {showPositionInfo && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                    <div className="flex items-start">
                      <FiInfo
                        className="text-blue-600 mt-0.5 mr-2 flex-shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-xs font-semibold text-blue-900 mb-1">
                          Position Guide:
                        </p>
                        <p className="text-xs text-blue-800">
                          Your last or current job title
                        </p>
                        <p className="text-xs text-blue-700 mt-1 italic">
                          Example: Sales Manager, Software Engineer, Marketing
                          Coordinator
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPositionInfo(false)}
                        className="ml-auto text-blue-400 hover:text-blue-600"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="text"
                  name="position"
                  value={jobSeekerDetails.position || ""}
                  onChange={handleInputChange}
                  onFocus={() => setShowPositionInfo(true)}
                  className="block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  placeholder="e.g., Sales Manager"
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

            {/* Preferred Job Types */}
            <div>
              <label className="block text-sm font-semibold text-[#001571] mb-2">
                Preferred Job Types
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "On Site",
                  "Hybrid",
                  "Remote",
                  "Full-Time",
                  "Part-Time",
                  "Freelance",
                ].map((type) => (
                  <label
                    key={type}
                    className={`flex items-center py-2 px-4 rounded-lg border transition-all duration-200 cursor-pointer text-sm
                      ${(jobSeekerDetails.preferredJobTypes || []).includes(type)
                        ? "bg-[#001571] text-white border-[#001571]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#001571]"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={(jobSeekerDetails.preferredJobTypes || []).includes(type)}
                      onChange={(e) => {
                        const currentTypes = jobSeekerDetails.preferredJobTypes || [];
                        let newTypes;
                        if (e.target.checked) {
                          newTypes = [...currentTypes, type];
                        } else {
                          newTypes = currentTypes.filter((t) => t !== type);
                        }
                        handleInputChange({
                          target: {
                            name: "preferredJobTypes",
                            value: newTypes,
                          },
                        });
                      }}
                      className="hidden"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
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
                  Portfolio / Website
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
            className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${isSubmitting
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
