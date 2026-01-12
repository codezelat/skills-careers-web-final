"use client";
import { FaTimes } from "react-icons/fa";

const EMPLOYEE_RANGES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

export default function AddRecruiterForm({
  showForm,
  onClose,
  newRecruiter,
  handleInputChange,
  handleSubmit,
  isSubmitting,
}) {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Add New Recruiter
          </h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Admin Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Admin First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={newRecruiter.firstName}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Admin Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={newRecruiter.lastName}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Admin Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={newRecruiter.contactNumber}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  required
                />
              </div>
            </div>

            <hr className="my-4" />

            {/* Recruiter Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Recruiter Name
                </label>
                <input
                  type="text"
                  name="recruiterName"
                  value={newRecruiter.recruiterName}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Employee Range
                </label>
                <select
                  name="employeeRange"
                  value={newRecruiter.employeeRange}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  required
                >
                  <option value="">Select Employee Range</option>
                  {EMPLOYEE_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newRecruiter.email}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Telephone Number
                </label>
                <input
                  type="tel"
                  name="telephoneNumber"
                  value={newRecruiter.telephoneNumber}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={newRecruiter.password}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={newRecruiter.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-[#001571] text-white px-6 py-3 rounded-xl text-sm font-semibold ${isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
                  }`}
              >
                {isSubmitting ? "Adding..." : "Add Recruiter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
