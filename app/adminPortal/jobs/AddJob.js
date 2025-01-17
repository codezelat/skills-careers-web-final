"use client";
import { useEffect, useState } from "react";

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

      onClose();

      window.location.reload();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  return (
    <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-[90vh] w-1/2 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Add Job</h2>
        <button
          onClick={onClose}
          className="px-2 py-1 h-12 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          Close ✕
        </button>
      </div>

      <form onSubmit={submitHandler}>
        <div className="relative">
          <p
            htmlFor="recruiteremail"
            className="text-base font-bold text-black mb-1"
          >
            Recruiter Email
          </p>
          <input
            type="email"
            id="recruiteremail"
            value={recruiterEmail}
            onChange={handleEmailChange}
            placeholder="Start typing recruiter email..."
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
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
                  <div className="text-sm text-gray-600">{recruiter.recruiterName}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p htmlFor="jobtitle" className="text-base font-bold text-black mb-1">
            Job Title
          </p>
          <input
            type="text"
            id="jobtitle"
            required
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div>
          <p
            htmlFor="recruitername"
            className="text-base font-bold text-black mb-1"
          >
            Recruiter Name
          </p>
          <input
            type="text"
            id="recruitername"
            value={recruiterName}
            onChange={(e) => setRecruiterName(e.target.value)}
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div>
          <p htmlFor="location" className="text-base font-bold text-black mb-1">
            Location
          </p>
          <input
            type="text"
            id="location"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div className="mb-4">
          <p className="text-base font-bold text-black mb-1">Job Type:</p>
          {[
            "Onsite ",
            "Hybrid ",
            "Remote ",
            "Full Time ",
            "Part Time ",
            "Freelance ",
          ].map((type) => (
            <label key={type} className="mr-4 text-base">
              <input
                type="checkbox"
                value={type}
                checked={jobTypes.includes(type)}
                onChange={handleCheckboxChange}
                className="mr-1"
              />
              {type}
            </label>
          ))}
        </div>

        <div>
          <p
            htmlFor="jobdescription"
            className="text-base font-bold text-black mb-1"
          >
            Job Description
          </p>
          <textarea
            type="text"
            id="jobdescription"
            required
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div>
          <p
            htmlFor="keyresponsibilities"
            className="text-base font-bold text-black mb-1"
          >
            Key Responsibilities
          </p>
          <textarea
            type="text"
            id="keyresponsibilities"
            required
            value={keyResponsibilities}
            onChange={(e) => setKeyResponsibilities(e.target.value)}
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div>
          <button className="w-96 px-4 py-2 mt-5 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors">
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddJob;
