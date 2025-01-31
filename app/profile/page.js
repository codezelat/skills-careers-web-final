"use client";
import { signOut, useSession } from "next-auth/react";
import ApplicationForm from "@/app/jobs/[jobid]/apply/applicationForm";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavBar from "@/components/navBar";
import AppliedJobs from "./appliedjobbscard";

function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log(status);

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

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [error, setError] = useState(null);

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login if unauthenticated
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchJobSeekerDetails = async (e) => {
        try {
          const response = await fetch(
            `/api/jobseekerdetails/get?email=${session.user.email}`
          );
          if (response.ok) {
            const data = await response.json();
            setJobSeekerDetails(data);
          } else {
            console.error("Failed to fetch job seeker details");
          }
        } catch (error) {
          console.error("Error fetching job seeker details:", error);
        }
      };

      fetchJobSeekerDetails();
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchAppliedJobs = async () => {
        try {
          const response = await fetch(
            `/api/job/appliedjobs?id=${session.user.id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch applied jobs.");
          }
          const data = await response.json();
          setAppliedJobs(data.appliedJobs);
        } catch (err) {
          setError(err.message);
          console.error("Error fetching jobs:", err);
        }
      };
      fetchAppliedJobs();
    }
  }, [session]);

  // In your Profile component
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
      const formData = new FormData();
      formData.append("image", file);
      formData.append("email", session.user.email);

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
    }
  };

  return (
    <>
      <div className="mx-auto max-w-screen-xl space-y-5 px-4 pb-8 pt-16 sm:px-6">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profile Page</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
          >
            Sign out
          </button>
        </div>

        {session ? (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start gap-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center space-y-2">
                  {jobSeekerDetails.profileImage ? (
                    <Image
                      src={jobSeekerDetails.profileImage}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="rounded-full object-cover mb-4 shadow-lg"
                      onError={(e) => {
                        console.error("Error loading image:", e);
                        // Optionally set a fallback image
                        e.target.src = "/fallback-profile-image.png"; // Make sure to add a fallback image in your public folder
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
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
                <div className="flex-1 space-y-2">
                  <p className="text-xl font-semibold">
                    {jobSeekerDetails.firstName} {jobSeekerDetails.lastName}
                  </p>
                  <p className="text-gray-600">Name: {session.user.name}</p>
                  <p className="text-gray-600">Id: {session.user.id}</p>
                  <p className="text-gray-600">Email: {session.user.email}</p>
                  <Link
                    href="/profile/edit"
                    className="text-green-500 hover:text-green-700 hover:underline inline-block mt-2"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md my-4">
          <h1 className="text-xl font-bold mb-4">My Profile</h1>

          <div>
            {/* <p className="text-sm text-gray-600">First Name </p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.firstName}
          </p> */}
            {/* <p className="text-sm text-gray-600">Last Name </p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.lastName}
          </p> */}

            <p className="text-sm text-gray-600">Contact Number</p>
            <p className="text-base font-bold text-black mb-3">
              {jobSeekerDetails.contactNumber}
            </p>
            <p className="text-sm text-gray-600">Position</p>
            <p className="text-base font-bold text-black mb-3">
              {jobSeekerDetails.position}
            </p>
            {/* <p className="text-sm text-gray-600">Personal Profile</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.personalProfile}
          </p> */}
            {/* <p className="text-sm text-gray-600">DOB</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.dob}
          </p> */}
            {/* <p className="text-sm text-gray-600">Nationality</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.nationality}
          </p> */}
            {/* <p className="text-sm text-gray-600">Marital Status</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.maritalStatus}
          </p> */}
            {/* <p className="text-sm text-gray-600">Languages</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.languages}
          </p> */}
            {/* <p className="text-sm text-gray-600">Religion</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.religion}
          </p> */}
            {/* <p className="text-sm text-gray-600">Address</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.address}
          </p> */}
            {/* <p className="text-sm text-gray-600">Ethnicity</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.ethnicity}
          </p> */}
            {/* <p className="text-sm text-gray-600">Experience</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.experience}
          </p> */}
            {/* <p className="text-sm text-gray-600">Education</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.education}
          </p> */}
            {/* <p className="text-sm text-gray-600">Licenses & Certifications</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.licensesCertifications}
          </p> */}
            {/* <p className="text-sm text-gray-600">Soft Skills</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.softSkills}
          </p> */}
            {/* <p className="text-sm text-gray-600">Professional Expertise</p>
          <p className="text-base font-bold text-black mb-3">
            {jobSeekerDetails.professionalExpertise}
          </p> */}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md my-4">
          <h1 className="text-xl font-bold mb-4">Jobs Applied</h1>

          <div className="grid grid-cols-1">
            {appliedJobs.length > 0 ? (
              appliedJobs.map((appliedJob, index) => <AppliedJobs key={index} appliedJob={appliedJob} />)
            ) : (
              <p className="col-span-full text-center text-gray-500 py-4">
                No jobs applied yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
