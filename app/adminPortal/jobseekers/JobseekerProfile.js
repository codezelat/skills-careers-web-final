"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import NavBar from "@/components/navBar";
import JobseekerEdit from "./JobseekerEdit";
import { useSession } from "next-auth/react";

function JobseekerProfile({ jobseekerId, Close }) {
  const { data: session, status } = useSession();

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

  const [error, setError] = useState(null);
  const [selectedJobseekerId, setSelectedJobseekerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [upLoading, setUpLoading] = useState(false);

  useEffect(() => {
    if (jobseekerId) {
      const fetchJobSeekerDetails = async (e) => {
        try {
          setIsLoading(true);
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
          setError(err.message);
          console.error("Error fetching job seeker details:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchJobSeekerDetails();
    }
  }, [jobseekerId]);

  const handleImageChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    try {
      setUpLoading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("email", jobSeekerDetails.email);

      console.log("Starting image upload...");
      const response = await fetch("/api/jobseekerdetails/uploadimage", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      console.log("Upload successful:", data);
      setJobSeekerDetails((prev) => ({
        ...prev,
        profileImage: data.imageUrl,
      }));

      alert("Profile image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setUpLoading(false);
    }
  };

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

  const handleJobseekerSelect = () => {
    setSelectedJobseekerId(jobSeekerDetails.id);
  };

  const handleCloseProfile = () => {
    setSelectedJobseekerId(null);
  };

  return (
    <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-[90vh] w-1/2 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-lg p-6 mb-6">
      {selectedJobseekerId && (
        <JobseekerEdit
          jobseekerId={selectedJobseekerId}
          Close={handleCloseProfile}
        />
      )}
      {isLoading && (
        <div className="text-center py-4">Loading jobseeker details...</div>
      )}
      <div className="flex justify-between">
        <h1 className="text-xl font-bold mb-4">Job Seeker Profile</h1>
        <button
          onClick={Close}
          className="px-2 py-1 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          Close ✕
        </button>
      </div>

      <div className="flex justify-between items-baseline mb-8">
        <div className="flex flex-col items-center space-y-2">
          {jobSeekerDetails.profileImage ? (
            <Image
              src={jobSeekerDetails.profileImage}
              alt="Profile"
              width={128}
              height={128}
              className="rounded-full object-cover mb-4 shadow-lg"
              onError={(e) => {
                console.error("Error loading image:", e);
                // Optionally set a fallback image
                e.target.src = "/fallback-profile-image.png"; // Make sure to add a fallback image in your public folder
              }}
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500">{upLoading ? "Uploading" : "No Image"}</span>
            </div>
          )}

          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="profile-image-input"
            />
            <label
              htmlFor="profile-image-input"
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {jobSeekerDetails.profileImage
                ? "Change Profile Picture"
                : "Upload Profile Picture"}
            </label>
          </div>
        </div>
        <button
          onClick={handleJobseekerSelect}
          className="py-1 ml-auto h-10 w-24 bg-white border-2 border-green-500 text-green-500 hover:border-green-500 hover:bg-green-500 hover:text-white rounded transition-colors"
        >
          Edit
        </button>
      </div>
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
  );
}

export default JobseekerProfile;
