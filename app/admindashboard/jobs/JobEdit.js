"use client";
import NavBar from "@/components/navBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function JobEditForm({ jobId, Close }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const [jobDetails, setJobDetails] = useState({
    id: "",
    jobTitle: "",
    recruiterId: "", // Keep this in state but don't allow editing
    location: "",
    jobTypes: [], // Initialize as an array
    jobDescription: "",
    keyResponsibilities: "",
  });

  const [recruiterDetails, setRecruiterDetails] = useState({
    email: "",
    recruiterName: "",
    logo: "",
  });

  //To send back to Login page, if the user is unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  //Fetch job details
  useEffect(() => {
    if (jobId) {
      const fetchJobDetails = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/job/get?id=${jobId}`);
          if (response.ok) {
            const data = await response.json();
            // Ensure jobTypes is always an array
            setJobDetails({
              ...data,
              jobTypes: Array.isArray(data.jobTypes) ? data.jobTypes : [],
            });
          } else {
            console.error("Failed to fetch job details");
          }
        } catch (error) {
          console.error("Error fetching job details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchJobDetails();
    }
  }, [jobId]);

  //Fetch recruiter details
  useEffect(() => {
    if (jobDetails.recruiterId) {
      const fetchRecruiterDetails = async () => {
        try {
          const response = await fetch(
            `/api/recruiterdetails/get?id=${jobDetails.recruiterId}`
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
  }, [jobDetails.recruiterId]);

  //Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setJobDetails((prev) => ({
      ...prev,
      jobTypes: checked
        ? [...prev.jobTypes, value]
        : prev.jobTypes.filter((type) => type !== value),
    }));
  };

  //Handle Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a copy of jobDetails without modifying the recruiterId
      const { recruiterId, ...updateData } = jobDetails;

      const response = await fetch(`/api/job/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updateData,
          id: jobId, // Ensure we're sending the correct ID
        }),
      });

      if (response.ok) {
        alert("Details updated successfully!");
        Close();
      } else {
        alert("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating job details:", error);
      alert("Error updating job details.");
    }
  };

  const jobTypeOptions = [
    "Onsite",
    "Hybrid",
    "Remote",
    "Full Time",
    "Part Time",
    "Freelance",
  ];

  return (
    <div className="grid absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-[85vh] w-4/5 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-lg p-6 mb-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-8">Edit {jobDetails.jobTitle}</h1>
        <button
          onClick={Close}
          className="px-2 py-1 h-12 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          Close ✕
        </button>
      </div>
      {loading ? <p>Loading...</p> : <p>Edit your details now</p>}

      <form onSubmit={handleFormSubmit}>
        <div>
          <p htmlFor="jobTitle" className="text-base font-bold text-black mb-1">
            Job Title
          </p>
          <input
            type="text"
            name="jobTitle"
            required
            value={jobDetails.jobTitle || ""}
            onChange={handleInputChange}
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
            name="location"
            required
            value={jobDetails.location || ""}
            onChange={handleInputChange}
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div className="mb-4">
          <p className="text-base font-bold text-black mb-1">Job Type:</p>
          {jobTypeOptions.map((type) => (
            <label key={type} className="mr-4 text-base">
              <input
                type="checkbox"
                value={type}
                checked={jobDetails.jobTypes.includes(type)}
                onChange={handleCheckboxChange}
                className="mr-1"
              />
              {type}
            </label>
          ))}
        </div>

        <div>
          <p
            htmlFor="jobDescription"
            className="text-base font-bold text-black mb-1"
          >
            Job Description
          </p>
          <textarea
            type="text"
            name="jobDescription"
            required
            value={jobDetails.jobDescription || ""}
            onChange={handleInputChange}
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div>
          <p
            htmlFor="keyResponsibilities"
            className="text-base font-bold text-black mb-1"
          >
            Key Responsibilities
          </p>
          <textarea
            type="text"
            name="keyResponsibilities"
            required
            value={jobDetails.keyResponsibilities || ""}
            onChange={handleInputChange}
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        <div>
          <button className="w-96 px-4 py-2 mt-5 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors">
            Update Job
          </button>
        </div>
      </form>
    </div>
  );
}

export default JobEditForm;
