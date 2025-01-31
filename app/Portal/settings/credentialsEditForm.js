"use client";
import { FaTimes } from "react-icons/fa";
import { PiCheckCircle } from "react-icons/pi";

export default function CredentialsForm({
  userDetails,
  isSubmitting,
  onClose,
  onSubmit,
  onInputChange,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h4 className="text-2xl font-semibold text-[#001571]">Credentials</h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-2 grid-rows-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={userDetails.firstName || ""}
                  onChange={onInputChange}
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
                  onChange={onInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  disabled
                  value={userDetails.email || ""}
                  onChange={onInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Phone
                </label>
                <input
                  type="text"
                  name="telephoneNumber"
                  value={userDetails.telephoneNumber || ""}
                  onChange={onInputChange}
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
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
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