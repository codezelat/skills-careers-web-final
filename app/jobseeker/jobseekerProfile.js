"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import NavBar from "@/components/navBar";

function JobseekerProfile({ slug }) {
  const [jobSeekerDetails, setJobSeekerDetails] = useState({
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

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchJobSeekerDetails = async (e) => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/jobseekerdetails/get?id=${slug}`);
          if (response.ok) {
            const data = await response.json();
            setJobSeekerDetails(data);
          } else if (response.status === 404) {
            const errorData = await response.json();
            if (errorData.isDeleted) {
              setError("This account has been deleted.");
            } else {
              setError("Job seeker not found.");
            }
          } else {
            setError("Failed to fetch job seeker details");
            console.error("Failed to fetch job seeker details");
          }
        } catch (error) {
          setError(error.message || "An error occurred");
          console.error("Error fetching job seeker details:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchJobSeekerDetails();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="text-center py-4">Loading Job Seeker details...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Error: {error}</p>
        {/* <Link
          href="/recruiter"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Return to Recruiter List
        </Link> */}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid justify-center"></div>

      <div className="bg-white p-6 rounded-lg shadow-md my-4">
        <h1 className="text-xl font-bold mb-4">Job Seeker Profile</h1>

        <div>
          <Image
            src={jobSeekerDetails.profileImage}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full object-cover mb-4 shadow-lg"
          />
          <p className="text-sm text-gray-600">First Name </p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.firstName}
          </p>
          <p className="text-sm text-gray-600">Last Name </p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.lastName}
          </p>

          <p className="text-sm text-gray-600">Contact Number</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.contactNumber}
          </p>
          <p className="text-sm text-gray-600">Position</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.position}
          </p>
          <p className="text-sm text-gray-600">Personal Profile</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.personalProfile}
          </p>
          <p className="text-sm text-gray-600">DOB</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.dob}
          </p>
          <p className="text-sm text-gray-600">Nationality</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.nationality}
          </p>
          <p className="text-sm text-gray-600">Marital Status</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.maritalStatus}
          </p>
          <p className="text-sm text-gray-600">Languages</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.languages}
          </p>
          <p className="text-sm text-gray-600">Religion</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.religion}
          </p>
          <p className="text-sm text-gray-600">Address</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.address}
          </p>
          <p className="text-sm text-gray-600">Ethnicity</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.ethnicity}
          </p>
          <p className="text-sm text-gray-600">Experience</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.experience}
          </p>
          <p className="text-sm text-gray-600">Education</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.education}
          </p>
          <p className="text-sm text-gray-600">Licenses & Certifications</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.licensesCertifications}
          </p>
          <p className="text-sm text-gray-600">Soft Skills</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.softSkills}
          </p>
          <p className="text-sm text-gray-600">Professional Expertise</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.professionalExpertise}
          </p>
        </div>
      </div>
    </div>
  );
}

export default JobseekerProfile;
