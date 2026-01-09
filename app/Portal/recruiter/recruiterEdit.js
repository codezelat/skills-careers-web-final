"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import PhoneNumberInput from "@/components/PhoneInput";
import { PiCheckCircle } from "react-icons/pi";
import { FiInfo } from "react-icons/fi";
import { countries } from "@/lib/countries";
import sriLankaDistricts from "@/data/sriLankaDistricts.json";

const RECRUITER_CATEGORIES = [
  "IT & Software",
  "Engineering & Technical",
  "Accounting & Finance",
  "Banking & Insurance",
  "Sales & Marketing",
  "Human Resources",
  "Admin & Office Support",
  "Customer Service",
  "Management & Strategy",
  "Logistics & Transport",
  "Construction & Property",
  "Manufacturing & Operations",
  "Hospitality & Hotels",
  "Travel & Tourism",
  "Healthcare",
  "Education & Training",
  "Media & Design",
  "Legal",
  "Government & Public Sector",
  "Agriculture & Environment",
  "Science & Research",
  "Apparel & Textile",
  "Supermarkets, Showrooms & Retail",
  "Fashion, Beauty & Luxury",
  "Security",
  "BPO / Call Center",
  "Imports & Exports",
  "NGO / Non-Profit",
  "Overseas Jobs",
  "Part-time & Flexible Jobs",
];

export default function RecruiterEdit({
  recruiterDetails,
  onClose,
  onSubmit,
  onInputChange,
  isSubmitting,
}) {
  const [isOther, setIsOther] = useState(
    recruiterDetails.category &&
      !RECRUITER_CATEGORIES.includes(recruiterDetails.category)
  );
  const [showAddressInfo, setShowAddressInfo] = useState(false);

  // Get country, default to Sri Lanka
  const selectedCountry = recruiterDetails.country || "Sri Lanka";
  const isSriLanka = selectedCountry === "Sri Lanka";

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    if (val === "Other") {
      setIsOther(true);
      onInputChange({ target: { name: "category", value: "" } });
    } else {
      setIsOther(false);
      onInputChange(e);
    }
  };

  const handleLocationChange = (e) => {
    const district = e.target.value;
    const selectedDistrict = sriLankaDistricts.find(
      (d) => d.value === district
    );

    if (selectedDistrict) {
      // Update location fields with district, province format
      onInputChange({
        target: { name: "district", value: selectedDistrict.district },
      });
      onInputChange({
        target: { name: "location", value: selectedDistrict.district }, // Map district to location for consistency
      });
      onInputChange({
        target: { name: "province", value: selectedDistrict.province },
      });
    }
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    onInputChange({ target: { name: "country", value: country } });

    // Reset location fields when changing country
    if (country !== "Sri Lanka") {
      onInputChange({ target: { name: "district", value: "" } });
      onInputChange({ target: { name: "province", value: "" } });
      onInputChange({ target: { name: "location", value: "" } });
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      {/* Popup Container */}
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Edit Profile
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
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Recruiter Name
              </label>
              <input
                type="text"
                name="recruiterName"
                value={recruiterDetails.recruiterName || ""}
                onChange={onInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
              />
            </div>

            {/* Country Selection */}
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Country
              </label>
              <select
                name="country"
                value={selectedCountry}
                onChange={handleCountryChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
              >
                {countries.map((country) => (
                  <option key={country.value} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Fields - Conditional based on Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address Line (Full Width) */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-[#001571]">
                  Address Line
                </label>
                <input
                  type="text"
                  name="addressLine"
                  value={recruiterDetails.addressLine || ""}
                  onChange={onInputChange}
                  placeholder="Street address, building name, etc."
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                />
              </div>

              {/* City & Province */}
              {isSriLanka ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      City (District)
                    </label>
                    <select
                      name="district"
                      value={recruiterDetails.district || ""}
                      onChange={handleLocationChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    >
                      <option value="">Select City</option>
                      {sriLankaDistricts.map((district) => (
                        <option key={district.value} value={district.value}>
                          {district.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Province
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={recruiterDetails.province || ""}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3 bg-gray-100"
                      readOnly
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      City
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={recruiterDetails.location || ""}
                      onChange={onInputChange}
                      placeholder="Enter City"
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Province/State
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={recruiterDetails.province || ""}
                      onChange={onInputChange}
                      placeholder="Enter Province or State"
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Recruiter Category
                </label>
                <select
                  name="category"
                  value={
                    isOther
                      ? "Other"
                      : RECRUITER_CATEGORIES.includes(recruiterDetails.category)
                      ? recruiterDetails.category
                      : ""
                  }
                  onChange={handleCategoryChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                >
                  <option value="">Select Category</option>
                  {RECRUITER_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {isOther && (
                  <input
                    type="text"
                    name="category"
                    placeholder="Type your category"
                    value={recruiterDetails.category || ""}
                    onChange={onInputChange}
                    className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Employee Range
                </label>
                <input
                  type="text"
                  name="employeeRange"
                  value={recruiterDetails.employeeRange || ""}
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
                  value={recruiterDetails.email || ""}
                  onChange={onInputChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                />
              </div>
              <PhoneNumberInput
                value={recruiterDetails.contactNumber || ""}
                onChange={(phone) =>
                  onInputChange({
                    target: { name: "contactNumber", value: phone },
                  })
                }
                label="Phone"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Company Description
              </label>
              <textarea
                name="companyDescription"
                value={recruiterDetails.companyDescription || ""}
                onChange={onInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Facebook
              </label>
              <input
                name="facebook"
                value={recruiterDetails.facebook || ""}
                onChange={onInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Instagram
              </label>
              <input
                name="instagram"
                value={recruiterDetails.instagram || ""}
                onChange={onInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                LinkedIn
              </label>
              <input
                name="linkedin"
                value={recruiterDetails.linkedin || ""}
                onChange={onInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                X
              </label>
              <input
                name="x"
                value={recruiterDetails.x || ""}
                onChange={onInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Dribbble
              </label>
              <input
                name="dribbble"
                value={recruiterDetails.dribbble || ""}
                onChange={onInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Github
              </label>
              <input
                name="github"
                value={recruiterDetails.github || ""}
                onChange={onInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                rows={4}
              />
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
