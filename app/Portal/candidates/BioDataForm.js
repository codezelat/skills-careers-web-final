"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { PiCheckCircle } from "react-icons/pi";
import { FiInfo } from "react-icons/fi";
import { countries } from "@/lib/countries";
import sriLankaDistricts from "@/data/sriLankaDistricts.json";

const RELIGION_LIST = [
  "Buddhism",
  "Hinduism",
  "Islam",
  "Christianity (Catholic / Other)",
  "Other",
  "Prefer not to say",
];

const LANGUAGES_LIST = ["Sinhala", "Tamil", "English"];

export default function BioDataForm({
  jobSeekerDetails,
  handleInputChange,
  jobseekerUpdateSubmitHandler,
  isSubmitting,
  onClose,
}) {
  const [religionSuggestions, setReligionSuggestions] = useState([]);
  const [showReligionSuggestions, setShowReligionSuggestions] = useState(false);

  const [showOtherNationality, setShowOtherNationality] = useState(
    jobSeekerDetails.nationality &&
      jobSeekerDetails.nationality !== "Sri Lankan"
  );

  const [showAddressFormat, setShowAddressFormat] = useState(false);

  // Get country, default to Sri Lanka
  const selectedCountry = jobSeekerDetails.country || "Sri Lanka";
  const isSriLanka = selectedCountry === "Sri Lanka";

  const handleCountryChange = (e) => {
    const country = e.target.value;
    handleInputChange({ target: { name: "country", value: country } });

    // Reset location fields when changing country
    if (country !== "Sri Lanka") {
      handleInputChange({ target: { name: "district", value: "" } });
      handleInputChange({ target: { name: "province", value: "" } });
      handleInputChange({ target: { name: "location", value: "" } });
    } else {
      handleInputChange({ target: { name: "location", value: "" } });
    }
  };

  // Filters
  const uniqueProvinces = [
    ...new Set(sriLankaDistricts.map((item) => item.province)),
  ];

  const filteredDistricts = sriLankaDistricts.filter(
    (item) => item.province === jobSeekerDetails.province
  );

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    handleInputChange({ target: { name: "province", value: province } });
    handleInputChange({ target: { name: "district", value: "" } }); // Clear district
  };

  const handleDistrictChange = (e) => {
    const districtValue = e.target.value;
    // Find key details if we need them, though storing simple string is fine
    // const fullDistrictObj = sriLankaDistricts.find(d => d.value === districtValue);

    // We store the district name (e.g. "Colombo") not the full value string if previously matching by value
    // Checking previous logic: value was full string, but saved as district name.
    // The select options below will use 'district' not 'value' for cleaner data if preferred,
    // or keep 'value' to match existing data.
    // Existing data used `d.value` equal to district?
    // Looking at JSON: value="Colombo...", district="Colombo"
    // Previous code: value={district.value} -> stored selectedDistrict.district
    // So if options return full string, we find and store simple name.

    // Let's assume we want to store the simple district name now for cleaner UI too.
    // But to match previous behavior of `handleLocationChange` which took `e.target.value` (likely full string from option value)
    // and matched it to find district.

    // Let's simplify: value in options will be the District Name directly now.
    handleInputChange({ target: { name: "district", value: districtValue } });
  };

  const handleReligionInputChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(e); // Update parent state

    if (value.trim()) {
      const filtered = RELIGION_LIST.filter((religion) =>
        religion.toLowerCase().includes(value.toLowerCase())
      );
      setReligionSuggestions(filtered);
      setShowReligionSuggestions(true);
    } else {
      setReligionSuggestions([]);
      setShowReligionSuggestions(false);
    }
  };

  const selectReligion = (religion) => {
    // Create a synthetic event to pass to handleInputChange
    const event = {
      target: {
        name: "religion",
        value: religion,
      },
    };
    handleInputChange(event);
    setShowReligionSuggestions(false);
  };

  const [showOtherLanguage, setShowOtherLanguage] = useState(false);
  const [otherLanguage, setOtherLanguage] = useState("");

  const currentLanguages = jobSeekerDetails.languages
    ? jobSeekerDetails.languages
        .split(",")
        .map((lang) => lang.trim())
        .filter(Boolean)
    : [];

  const updateLanguages = (newLanguages) => {
    const event = {
      target: {
        name: "languages",
        value: newLanguages.join(", "),
      },
    };
    handleInputChange(event);
  };

  const handleLanguageSelect = (e) => {
    const selectedLang = e.target.value;
    if (selectedLang === "Other") {
      setShowOtherLanguage(true);
    } else {
      if (!currentLanguages.includes(selectedLang)) {
        updateLanguages([...currentLanguages, selectedLang]);
      }
      e.target.value = ""; // Reset select
    }
  };

  const handleAddOtherLanguage = () => {
    if (otherLanguage.trim()) {
      if (!currentLanguages.includes(otherLanguage.trim())) {
        updateLanguages([...currentLanguages, otherLanguage.trim()]);
      }
      setOtherLanguage("");
      setShowOtherLanguage(false);
    }
  };

  const removeLanguage = (langToRemove) => {
    const updatedLanguages = currentLanguages.filter(
      (lang) => lang !== langToRemove
    );
    updateLanguages(updatedLanguages);
  };

  const handleNationalityChange = (e) => {
    const value = e.target.value;
    if (value === "Others") {
      setShowOtherNationality(true);
      // Clear the nationality value to allow input
      const event = {
        target: {
          name: "nationality",
          value: "",
        },
      };
      handleInputChange(event);
    } else {
      setShowOtherNationality(false);
      handleInputChange(e);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      {/* Popup Container */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Edit Bio Data
          </h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 pb-40">
          <form onSubmit={jobseekerUpdateSubmitHandler} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Birth Day
              </label>
              <input
                type="date"
                name="dob"
                value={jobSeekerDetails.dob || ""}
                onChange={handleInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Nationality
              </label>
              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtherNationality(false);
                    handleInputChange({
                      target: { name: "nationality", value: "Sri Lankan" },
                    });
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    !showOtherNationality &&
                    jobSeekerDetails.nationality === "Sri Lankan"
                      ? "bg-[#001571] text-white border-[#001571]"
                      : "bg-white text-gray-500 border-[#B0B6D3] hover:border-[#001571] hover:text-[#001571]"
                  }`}
                >
                  Sri Lankan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOtherNationality(true);
                    if (jobSeekerDetails.nationality === "Sri Lankan") {
                      handleInputChange({
                        target: { name: "nationality", value: "" },
                      });
                    }
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    showOtherNationality
                      ? "bg-[#001571] text-white border-[#001571]"
                      : "bg-white text-gray-500 border-[#B0B6D3] hover:border-[#001571] hover:text-[#001571]"
                  }`}
                >
                  Other
                </button>
              </div>

              {showOtherNationality && (
                <div className="mt-3 animate-fadeIn">
                  <input
                    type="text"
                    name="nationality"
                    value={
                      jobSeekerDetails.nationality === "Sri Lankan"
                        ? ""
                        : jobSeekerDetails.nationality || ""
                    }
                    onChange={handleInputChange}
                    placeholder="Please enter your nationality"
                    className="block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    autoFocus
                  />
                </div>
              )}
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-[#001571]">
                Languages
              </label>

              {currentLanguages.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 p-2 border border-[#B0B6D3] rounded-xl min-h-[50px]">
                  {currentLanguages.map((lang, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => removeLanguage(lang)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {!showOtherLanguage ? (
                <select
                  onChange={handleLanguageSelect}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Language to Add
                  </option>
                  {LANGUAGES_LIST.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                  <option value="Other">Other (Add Custom)</option>
                </select>
              ) : (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={otherLanguage}
                    onChange={(e) => setOtherLanguage(e.target.value)}
                    placeholder="Type language..."
                    className="flex-1 border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddOtherLanguage();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddOtherLanguage}
                    className="bg-[#001571] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtherLanguage("");
                      setShowOtherLanguage(false);
                    }}
                    className="text-gray-500 hover:text-gray-700 px-2"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            {/* Structured Address Fields */}
            <div className="space-y-4">
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

              {/* Address Line (Full Width) */}
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Address Line
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="addressLine"
                    value={jobSeekerDetails.addressLine || ""}
                    onChange={handleInputChange}
                    placeholder="Street address, building name, etc."
                    className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddressFormat(!showAddressFormat)}
                    className="absolute right-3 top-1/2 mt-1 text-[#001571] hover:text-blue-600 transition-colors"
                    title="Address Info"
                  >
                    <FiInfo size={18} />
                  </button>
                </div>

                {showAddressFormat && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                    <p className="text-xs text-blue-800">
                      Format: Home No., Lane/Road
                    </p>
                  </div>
                )}
              </div>

              {/* City & Province */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isSriLanka ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-[#001571]">
                        Province
                      </label>
                      <select
                        name="province"
                        value={jobSeekerDetails.province || ""}
                        onChange={handleProvinceChange}
                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      >
                        <option value="">Select Province</option>
                        {uniqueProvinces.map((province, index) => (
                          <option key={index} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#001571]">
                        City (District)
                      </label>
                      <select
                        name="district"
                        value={jobSeekerDetails.district || ""}
                        onChange={handleDistrictChange}
                        disabled={!jobSeekerDetails.province}
                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">Select City</option>
                        {filteredDistricts.map((district) => (
                          <option
                            key={district.value}
                            value={district.district}
                          >
                            {district.district}
                          </option>
                        ))}
                      </select>
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
                        value={jobSeekerDetails.location || ""}
                        onChange={handleInputChange}
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
                        value={jobSeekerDetails.province || ""}
                        onChange={handleInputChange}
                        placeholder="Enter Province or State"
                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      />
                    </div>
                  </>
                )}
              </div>
              {/* Hidden field for legacy address compatibility if needed, or we just ignore it */}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Age
              </label>
              <input
                type="text"
                name="age"
                disabled
                value={jobSeekerDetails.age || ""}
                onChange={handleInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Marital Status
              </label>
              <select
                name="maritalStatus"
                value={jobSeekerDetails.maritalStatus || ""}
                onChange={handleInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
              >
                <option value="">Select Marital Status</option>
                <option value="Married">Married</option>
                <option value="Single">Single</option>
              </select>
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-[#001571]">
                Religion
              </label>
              <input
                type="text"
                name="religion"
                value={jobSeekerDetails.religion || ""}
                onChange={handleReligionInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                placeholder="Select or type religion"
                autoComplete="off"
              />
              {showReligionSuggestions && religionSuggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                  {religionSuggestions.map((religion, index) => (
                    <li
                      key={index}
                      onClick={() => selectReligion(religion)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                    >
                      {religion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Ethnicity
              </label>
              <input
                type="text"
                name="ethnicity"
                value={jobSeekerDetails.ethnicity || ""}
                onChange={handleInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
              />
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
