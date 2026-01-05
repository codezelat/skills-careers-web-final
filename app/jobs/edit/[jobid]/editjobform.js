"use client";
import NavBar from "@/components/navBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import sriLankaDistricts from "@/data/sriLankaDistricts.json";

function EditJobForm({ jobId }) {
  const router = useRouter();
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

  const [customLocation, setCustomLocation] = useState("");

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
          const response = await fetch(`/api/job/get?id=${jobId}`);
          if (response.ok) {
            const data = await response.json();
            // Ensure jobTypes is always an array
            const validDistricts = sriLankaDistricts.map((d) => d.value);
            const isValidDistrict = validDistricts.includes(data.location);

            setJobDetails({
              ...data,
              jobTypes: Array.isArray(data.jobTypes) ? data.jobTypes : [],
              location: isValidDistrict ? data.location : "Other",
            });

            if (!isValidDistrict) {
              setCustomLocation(data.location);
            }
          } else {
            console.error("Failed to fetch job details");
          }
        } catch (error) {
          console.error("Error fetching job details:", error);
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

      const finalLocation =
        jobDetails.location === "Other" ? customLocation : jobDetails.location;

      const response = await fetch(`/api/job/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updateData,
          location: finalLocation,
          id: jobId, // Ensure we're sending the correct ID
        }),
      });

      if (response.ok) {
        alert("Details updated successfully!");
        router.push("/dashboard");
      } else {
        alert("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating job details:", error);
      alert("Error updating job details.");
    }
  };

  const handleCloseForm = () => {
    router.push(`/dashboard`);
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
    <div className="p-4">
      <div className="grid justify-center"></div>

      <div className="grid justify-items-center bg-white shadow-lg rounded-lg p-4 m-2">
        <button
          onClick={handleCloseForm}
          className="px-2 py-1 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          close
        </button>
        <h1 className="text-2xl font-bold mb-8">
          Edit Job Details of {jobDetails.jobTitle}
        </h1>
        {session ? (
          <p className="text-sm font-bold text-gray-400 mb-1">
            Edit your details now
          </p>
        ) : (
          <p>Loading...</p>
        )}

        <form onSubmit={handleFormSubmit}>
          <div>
            <p
              htmlFor="jobTitle"
              className="text-base font-bold text-black mb-1"
            >
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
            <p
              htmlFor="location"
              className="text-base font-bold text-black mb-1"
            >
              Location
            </p>
            <select
              name="location"
              required
              value={jobDetails.location || ""}
              onChange={(e) => {
                handleInputChange(e);
                if (e.target.value !== "Other") {
                  setCustomLocation("");
                }
              }}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            >
              <option value="">Select a location</option>
              {sriLankaDistricts.map((district) => (
                <option key={district.value} value={district.value}>
                  {district.label}
                </option>
              ))}
            </select>
            {jobDetails.location === "Other" && (
              <input
                type="text"
                id="customLocation"
                required
                placeholder="Please specify location"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4 mt-2"
              />
            )}
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
    </div>
  );
}

export default EditJobForm;
