"use client";
import { useEffect, useState } from "react";
import { PiCheckCircle } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegCircle, FaRegCircleDot } from "react-icons/fa6";

async function createJob(
  jobTitle,
  recruiterName,
  recruiterEmail,
  location,
  jobTypes,
  jobDescription,
  keyResponsibilities
) {
  const response = await fetch("/api/job/add/admin", {
    method: "POST",
    body: JSON.stringify({
      jobTitle,
      recruiterName,
      recruiterEmail,
      location,
      jobTypes,
      jobDescription,
      keyResponsibilities,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
}

function AddJob({ onClose }) {
  const [jobTitle, setJobTitle] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [location, setLocation] = useState("");
  const [jobTypes, setJobTypes] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [keyResponsibilities, setKeyResponsibilities] = useState("");

  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]); // Define the selected state

  // Function to fetch recruiters based on email search
  const fetchRecruiters = async (searchTerm) => {
    if (searchTerm.length >= 3) {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/recruiterdetails/search?query=${encodeURIComponent(searchTerm)}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Search failed:", errorData);
          throw new Error(errorData.message || "Search failed");
        }

        const data = await response.json();
        console.log("Search results:", data); // Debug log

        if (data.recruiters) {
          setEmailSuggestions(data.recruiters);
        } else {
          setEmailSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching recruiters:", error);
        setEmailSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setEmailSuggestions([]);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setRecruiterEmail(value);
    fetchRecruiters(value);
  };

  const handleRecruiterSelect = (recruiter) => {
    setRecruiterEmail(recruiter.email);
    setRecruiterName(recruiter.recruiterName);
    setEmailSuggestions([]);
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setJobTypes(
      (prevJobTypes) =>
        checked
          ? [...prevJobTypes, value] // Add value if checked
          : prevJobTypes.filter((type) => type !== value) // Remove value if unchecked
    );
  };

  const handleSelect = (label) => {
    setSelected((prevSelected) =>
      prevSelected.includes(label)
        ? prevSelected.filter((item) => item !== label)
        : [...prevSelected, label]
    );
  };

  async function submitHandler(event) {
    event.preventDefault();

    try {
      const result = await createJob(
        jobTitle,
        recruiterName,
        recruiterEmail,
        location,
        jobTypes,
        jobDescription,
        keyResponsibilities
      );
      console.log(result);
      alert(result.message);

      setJobTitle("");
      setRecruiterName("");
      setRecruiterEmail("");
      setLocation("");
      setJobTypes([]);
      setJobDescription("");
      setKeyResponsibilities("");
      setSelected([]); // Reset selected state

      onClose();

      window.location.reload();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto rounded-xl shadow-md p-8 scrollbar-hide">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold text-[#001571]">Add Job Posts</h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <IoCloseSharp size={24} />
          </button>
        </div>
        <div className="border-2 border-gray-200 mb-4" />

        <form className="space-y-6" onSubmit={submitHandler}>
<div>
              <label
                htmlFor="recruiteremail"
                className="block text-sm font-semibold text-[#001571]"
              >
                Recruiter Email
              </label>
              <input
                type="email"
                id="recruiteremail"
                value={recruiterEmail}
                onChange={handleEmailChange}
                placeholder="Start typing recruiter email..."
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
              />
{loading && <div className="text-sm text-gray-500">Loading...</div>}
            {emailSuggestions.length > 0 && (
              <ul className="absolute z-10 w-96 border border-gray-300 rounded shadow-lg bg-white max-h-48 overflow-auto">
                {emailSuggestions.map((recruiter, index) => (
                  <li
                    key={index}
                    onClick={() => handleRecruiterSelect(recruiter)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="font-medium">{recruiter.email}</div>
                    <div className="text-sm text-gray-600">
                      {recruiter.recruiterName}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Job Title
            </label>
            <input
              type="text"
              id="jobtitle"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Recruiter Name
            </label>
            <input
              type="text"
              id="recruitername"
              value={recruiterName}
              onChange={(e) => setRecruiterName(e.target.value)}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Location
            </label>
            <input
              type="text"
              id="location"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-[#001571] pb-2">Job Types</h2>
            <div className="flex flex-wrap gap-4">
              {[
                { id: 1, label: "Onsite" },
                { id: 2, label: "Hybrid" },
                { id: 3, label: "Remote" },
                { id: 4, label: "Full Time" },
                { id: 5, label: "Part Time" },
                { id: 6, label: "Freelance" },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelect(type.label)}
                  className={`flex px-5 py-2 border rounded-lg transition ${
                    selected.includes(type.label)
                      ? "bg-[#001571] text-white text-sm"
                      : "bg-white text-gray-700 text-sm border-[#B0B6D3]"
                  }`}
                >
                  {type.label}
                  {selected.includes(type.label) ? (
                    <span className="ml-2 mt-1">
                      <FaRegCircleDot width={20} height={10} />
                    </span>
                  ) : (
                    <span className="ml-2 mt-1">
                      <FaRegCircle width={20} height={10} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Job Description
            </label>
            <textarea
              type="text"
              id="jobdescription"
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Key Responsibilities
            </label>
            <textarea
              type="text"
              id="keyresponsibilities"
              required
              value={keyResponsibilities}
              onChange={(e) => setKeyResponsibilities(e.target.value)}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Required & Qualifications
            </label>
            <textarea
              name="qualifications"
              rows="10"
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Perks & Benefits
            </label>
            <textarea
              name="keyResponsibilities"
              rows="10"
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div className="border-2 border-gray-200 mb-4" />

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#001571] text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            >
              <div className="flex items-center space-x-3">
                <p>Save</p>
                <PiCheckCircle width={20} height={10} />
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddJob;