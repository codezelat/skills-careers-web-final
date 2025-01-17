"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function JobseekerEdit({ jobseekerId, Close }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { status } = useSession();

  const [jobSeekerDetails, setJobSeekerDetails] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    position: "",
    personalProfile: "",
    dob: "",
    nationality: "",
    maritalStatus: "",
    languages: "",
    religion: "",
    address: "",
    ethnicity: "",
    experience: "",
    education: "",
    licensesCertifications: "",
    softSkills: "",
    professionalExpertise: "",
    profileImage: "", // Added profile image field
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login if unauthenticated
    }
  }, [status, router]);

  useEffect(() => {
    if (jobseekerId) {
      const fetchJobSeekerDetails = async (e) => {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/jobseekerdetails/get?id=${jobseekerId}`
          );
          if (response.ok) {
            const data = await response.json();
            setJobSeekerDetails(data);
          } else {
            console.error("Failed to fetch job seeker details");
          }
        } catch (error) {
          console.error("Error fetching job seeker details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchJobSeekerDetails();
    }
  }, [jobseekerId]);

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setJobSeekerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/jobseekerdetails/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobSeekerDetails),
      });
      if (response.ok) {
        alert("Details updated successfully!");
        Close();
      } else {
        alert("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating job seeker details:", error);
    }
  };

  return (
    <div className="grid absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-[90vh] w-4/5 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-lg p-6 mb-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-8">
          Update {jobSeekerDetails.firstName} {jobSeekerDetails.lastName}
        </h1>
        <button
          onClick={Close}
          className="px-2 py-1 h-12 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          Close ✕
        </button>
      </div>

      {loading ? <p>Loading...</p> : <p>Edit your details now</p>}
      <form onSubmit={handleFormSubmit}>
        <p htmlFor="firstName" className="text-base font-bold text-black mb-1">
          First Name
        </p>
        <input
          type="text"
          name="firstName"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.firstName || ""}
          onChange={handleInputChange}
        />

        <p htmlFor="lastName" className="text-base font-bold text-black mb-1">
          Last Name
        </p>
        <input
          type="text"
          name="lastName"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.lastName || ""}
          onChange={handleInputChange}
        />

        <p
          htmlFor="contactNumber"
          className="text-base font-bold text-black mb-1"
        >
          Contact Number
        </p>
        <input
          type="text"
          name="contactNumber"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.contactNumber || ""}
          onChange={handleInputChange}
        />

        <p htmlFor="position" className="text-base font-bold text-black mb-1">
          Position
        </p>
        <input
          type="text"
          name="position"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.position || ""}
          onChange={handleInputChange}
        />

        <p
          htmlFor="personalProfile"
          className="text-base font-bold text-black mb-1"
        >
          Personal Profile
        </p>
        <textarea
          name="personalProfile"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.personalProfile || ""}
          onChange={handleInputChange}
        />

        <p htmlFor="dob" className="text-base font-bold text-black mb-1">
          DOB
        </p>
        <input
          type="date"
          name="dob"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.dob || ""}
          onChange={handleInputChange}
        />

        <p
          htmlFor="nationality"
          className="text-base font-bold text-black mb-1"
        >
          Nationality
        </p>
        <input
          type="text"
          name="nationality"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.nationality || ""}
          onChange={handleInputChange}
        />

        <p
          htmlFor="maritalStatus"
          className="text-base font-bold text-black mb-1"
        >
          Marital Status
        </p>
        <input
          type="text"
          name="maritalStatus"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.maritalStatus || ""}
          onChange={handleInputChange}
        />

        <p htmlFor="languages" className="text-base font-bold text-black mb-1">
          Languages
        </p>
        <input
          type="text"
          name="languages"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.languages || ""}
          onChange={handleInputChange}
        />

        <p htmlFor="religion" className="text-base font-bold text-black mb-1">
          Religion
        </p>
        <input
          type="text"
          name="religion"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.religion || ""}
          onChange={handleInputChange}
        />

        <p htmlFor="address" className="text-base font-bold text-black mb-1">
          Address
        </p>
        <input
          type="text"
          name="address"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.address || ""}
          onChange={handleInputChange}
        />

        <p htmlFor="ethnicity" className="text-base font-bold text-black mb-1">
          Ethnicity
        </p>
        <input
          type="text"
          name="ethnicity"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.ethnicity || ""}
          onChange={handleInputChange}
        />

        <p htmlFor="experience" className="text-base font-bold text-black mb-1">
          Experience
        </p>
        <input
          type="text"
          name="experience"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.experience || ""}
          onChange={handleInputChange}
        />

        <p htmlFor="education" className="text-base font-bold text-black mb-1">
          Education
        </p>
        <input
          type="text"
          name="education"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.education || ""}
          onChange={handleInputChange}
        />

        <p
          htmlFor="licensesCertifications"
          className="text-base font-bold text-black mb-1"
        >
          Licenses & Certifications
        </p>
        <input
          type="text"
          name="licensesCertifications"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.licensesCertifications || ""}
          onChange={handleInputChange}
        />

        <p htmlFor="softSkills" className="text-base font-bold text-black mb-1">
          Soft Skills
        </p>
        <input
          type="text"
          name="softSkills"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.softSkills || ""}
          onChange={handleInputChange}
        />

        <p
          htmlFor="professionalExpertise"
          className="text-base font-bold text-black mb-1"
        >
          Professional Expertise
        </p>
        <input
          type="text"
          name="professionalExpertise"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={jobSeekerDetails.professionalExpertise || ""}
          onChange={handleInputChange}
        />
        <br />

        <button
          type="submit"
          className="w-96 px-4 py-2 mt-5 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors"
        >
          Update Details
        </button>
      </form>
    </div>
  );
}

export default JobseekerEdit;
