"use client";
import { useEffect, useState } from "react";  

async function createJob(
  jobTitle,
  recruiterId,
  location,
  jobTypes,
  jobDescription,
  keyResponsibilities
) {
  const response = await fetch("/api/job/add", {
    method: "POST",
    body: JSON.stringify({
      jobTitle,
      recruiterId,
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

function CreateJobPost({ onClose, recruiterId }) {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [keyResponsibilities, setKeyResponsibilities] = useState("");
  const [jobTypes, setJobTypes] = useState([]);

  const [recruiterDetails, setRecruiterDetails] = useState({
    recruiterName: "",
    
  });

  useEffect(() => {
    if (recruiterId) {
      const fetchRecruiterDetails = async (e) => {
        try {
          const response = await fetch(
            `/api/recruiterdetails/get?id=${recruiterId}`
          );
          if (response.ok) {
            const data = await response.json();
            setRecruiterDetails(data);
          } else {
            console.error("Failed to fetch recruiter details");
          }
        } catch (error) {
          console.error("Error fetching recruiter details:", error);
        }
      };

      fetchRecruiterDetails();
    }
  }, [recruiterId]);

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
        recruiterId,
        location,
        jobTypes,
        jobDescription,
        keyResponsibilities
      );
      console.log(result);
      alert(result.message);

      setJobTitle("");
      setLocation("");
      setJobDescription("");
      setKeyResponsibilities("");
      setJobTypes([]);
      onClose();
      window.location.reload();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  return (
    <div className="grid bg-white shadow-lg rounded-lg p-4 m-2">
      <button
        onClick={onClose}
        className="px-2 py-1 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
      >
        Close
      </button>

      <h1 className="text-2xl font-bold mb-8">Create New Job</h1>

      <form onSubmit={submitHandler}>
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
            disabled
            value={recruiterDetails.recruiterName}
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

export default CreateJobPost;
