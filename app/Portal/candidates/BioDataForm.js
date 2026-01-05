"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { PiCheckCircle } from "react-icons/pi";
import { FiInfo } from "react-icons/fi";

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

  const [languageSuggestions, setLanguageSuggestions] = useState([]);
  const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false);

  const [showOtherNationality, setShowOtherNationality] = useState(
    jobSeekerDetails.nationality &&
      jobSeekerDetails.nationality !== "Sri Lankan"
  );

  const [showAddressFormat, setShowAddressFormat] = useState(false);

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

  const handleLanguageInputChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(e);

    // Get the last value after comma
    const lastValue = value.split(",").pop().trim();

    if (lastValue) {
      const filtered = LANGUAGES_LIST.filter((lang) =>
        lang.toLowerCase().startsWith(lastValue.toLowerCase())
      );
      setLanguageSuggestions(filtered);
      setShowLanguageSuggestions(true);
    } else {
      setLanguageSuggestions([]);
      setShowLanguageSuggestions(false);
    }
  };

  const selectLanguage = (lang) => {
    const currentLanguages = jobSeekerDetails.languages
      ? jobSeekerDetails.languages.split(",")
      : [];
    // Remove the last partial entry
    currentLanguages.pop();
    // Add the selected language
    currentLanguages.push(lang);

    const newValue = currentLanguages.join(", ") + ", ";

    const event = {
      target: {
        name: "languages",
        value: newValue,
      },
    };
    handleInputChange(event);
    setShowLanguageSuggestions(false);
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {/* Popup Container */}
      <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
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
              {!showOtherNationality ? (
                <select
                  name="nationality"
                  value={
                    jobSeekerDetails.nationality === "Sri Lankan"
                      ? "Sri Lankan"
                      : jobSeekerDetails.nationality === "" ||
                        !jobSeekerDetails.nationality
                      ? ""
                      : "Others"
                  }
                  onChange={handleNationalityChange}
                  className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                >
                  <option value="">Select Nationality</option>
                  <option value="Sri Lankan">Sri Lankan</option>
                  <option value="Others">Others</option>
                </select>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="nationality"
                    value={jobSeekerDetails.nationality || ""}
                    onChange={handleInputChange}
                    placeholder="Enter your nationality"
                    className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtherNationality(false);
                      const event = {
                        target: {
                          name: "nationality",
                          value: "",
                        },
                      };
                      handleInputChange(event);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Back to selection
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-[#001571]">
                Languages
              </label>
              <input
                type="text"
                name="languages"
                value={jobSeekerDetails.languages || ""}
                placeholder="example: English, French (Type to search, comma separated)"
                onChange={handleLanguageInputChange}
                className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                autoComplete="off"
              />
              {showLanguageSuggestions && languageSuggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                  {languageSuggestions.map((lang, index) => (
                    <li
                      key={index}
                      onClick={() => selectLanguage(lang)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                    >
                      {lang}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-[#001571]">
                  Address
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddressFormat(!showAddressFormat)}
                  className="text-[#001571] hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                  title="Address format guide"
                >
                  <FiInfo size={18} />
                </button>
              </div>
              
              {showAddressFormat && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <FiInfo className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" size={16} />
                    <div>
                      <p className="text-xs font-semibold text-blue-900 mb-1">Address Format:</p>
                      <p className="text-xs text-blue-800">Home No., Lane/Road, City, Province, Country.</p>
                      <p className="text-xs text-blue-700 mt-1 italic">Example: No. 123, Galle Road, Colombo, Western Province, Sri Lanka</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddressFormat(false)}
                      className="ml-auto text-blue-400 hover:text-blue-600"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                </div>
              )}
              
              <input
                type="text"
                name="address"
                value={jobSeekerDetails.address || ""}
                onChange={handleInputChange}
                onFocus={() => setShowAddressFormat(true)}
                className="block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                placeholder="Enter your address"
              />
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
