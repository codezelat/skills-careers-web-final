"use client";
import { signOut, useSession } from "next-auth/react";
import ApplicationForm from "@/app/jobs/[jobid]/apply/applicationForm";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NavBar from "@/components/navBar";
import AppliedJobs from "./appliedjobbscard";
import Swal from "sweetalert2";

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
  const [isUploading, setIsUploading] = useState(false);

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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'File size should be less than 5MB',
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please upload an image file',
      });
      return;
    }

    try {
      setIsUploading(true);
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

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile image uploaded successfully!',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to upload image: ${error.message}`,
      });
    } finally {
      setIsUploading(false);
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
                  <div className="relative">
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center rounded-full">
                        <div className="text-white text-xs font-semibold flex flex-col items-center">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-1"></div>
                        </div>
                      </div>
                    )}
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
                  </div>

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
            <div className="mt-6">
              <h3 className="text-lg font-bold text-[#001571] mb-3">Experience</h3>
              {jobSeekerDetails.experiences && jobSeekerDetails.experiences.length > 0 ? (
                <div className="space-y-4">
                  {jobSeekerDetails.experiences.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r">
                      <p className="font-bold text-lg">{exp.position}</p>
                      <p className="font-semibold text-gray-700">{exp.companyName}</p>
                      <p className="text-sm text-gray-500">
                        {exp.city}, {exp.country} | {exp.startDate} - {exp.endDate}
                      </p>
                      {exp.description && <p className="text-gray-600 mt-2">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No experience added.</p>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold text-[#001571] mb-3">Education</h3>
              {jobSeekerDetails.educations && jobSeekerDetails.educations.length > 0 ? (
                <div className="space-y-4">
                  {jobSeekerDetails.educations.map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4 py-2 bg-gray-50 rounded-r">
                      <p className="font-bold text-lg">{edu.educationName}</p>
                      <p className="font-semibold text-gray-700">{edu.location}</p>
                      <p className="text-sm text-gray-500">
                        {edu.startDate} - {edu.endDate}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No education added.</p>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold text-[#001571] mb-3">Licenses & Certifications</h3>
              {jobSeekerDetails.certifications && jobSeekerDetails.certifications.length > 0 ? (
                <div className="space-y-4">
                  {jobSeekerDetails.certifications.map((cert, index) => (
                    <div key={index} className="border-l-4 border-yellow-500 pl-4 py-2 bg-gray-50 rounded-r">
                      <p className="font-bold text-lg">{cert.certificateName}</p>
                      <p className="font-semibold text-gray-700">{cert.organizationName}</p>
                      <p className="text-sm text-gray-500">Received: {cert.receivedDate}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No certifications added.</p>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold text-[#001571] mb-3">Soft Skills</h3>
              {jobSeekerDetails.softSkills ? (
                <p className="text-gray-700 whitespace-pre-wrap">{jobSeekerDetails.softSkills}</p>
              ) : (
                <p className="text-gray-500 italic">No soft skills added.</p>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold text-[#001571] mb-3">Professional Expertise</h3>
              {jobSeekerDetails.professionalExpertise ? (
                <p className="text-gray-700 whitespace-pre-wrap">{jobSeekerDetails.professionalExpertise}</p>
              ) : (
                <p className="text-gray-500 italic">No professional expertise added.</p>
              )}
            </div>
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
