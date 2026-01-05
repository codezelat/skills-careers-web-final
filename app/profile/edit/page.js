"use client";

import NavBar from "@/components/navBar";
import PhoneNumberInput from "@/components/PhoneInput";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import CertificationSection from "./CertificationSection";
import SkillSection from "./SkillSection";
import Swal from "sweetalert2";

function EditProfileForm() {
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
    softSkills: "",
    professionalExpertise: "",
    profileImage: "",
    educations: [],
    experiences: [],
    certifications: [],
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchJobSeekerDetails = useCallback(async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch(
          `/api/jobseekerdetails/get?email=${session.user.email}`
        );
        if (response.ok) {
          const data = await response.json();
          // The API returns { jobseeker: { ... } }
          setJobSeekerDetails(data.jobseeker);
        } else {
          console.error("Failed to fetch job seeker details");
        }
      } catch (error) {
        console.error("Error fetching job seeker details:", error);
      }
    }
  }, [session]);

  useEffect(() => {
    fetchJobSeekerDetails();
  }, [fetchJobSeekerDetails]);

  const handleInputChange = (e) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
    const { name, value } = e.target;
    setJobSeekerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // We only update the main jobseeker details here.
      // Education, Experience, Certifications are handled in their own sections.
      const { educations, experiences, certifications, _id, ...updateData } =
        jobSeekerDetails;

      console.log("Submitting data:", updateData); // Debug log

      const response = await fetch(`/api/jobseekerdetails/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updateData, email: session.user.email }),
      });
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Details updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          router.push(`/profile`);
        });
      } else {
        const errorData = await response.json();
        console.error("Update failed:", errorData); // Debug log
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to update details.",
        });
      }
    } catch (error) {
      console.error("Error updating job seeker details:", error);
    }
  };

  const handleCloseForm = () => {
    router.push(`/profile`);
  };

  if (status === "loading" || !jobSeekerDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <div className="grid justify-center"></div>

      <div className="grid justify-items-center bg-white shadow-lg rounded-lg p-4 m-2 max-w-4xl mx-auto">
        <button
          onClick={handleCloseForm}
          className="px-2 py-1 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          close
        </button>
        <h1 className="text-2xl font-bold mb-8">Update Job Seeker Details</h1>

        <form onSubmit={handleFormSubmit} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <p className="text-base font-bold text-black mb-1">First Name</p>
              <input
                type="text"
                name="firstName"
                className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                value={jobSeekerDetails.firstName || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <p className="text-base font-bold text-black mb-1">Last Name</p>
              <input
                type="text"
                name="lastName"
                className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                value={jobSeekerDetails.lastName || ""}
                onChange={handleInputChange}
              />
            </div>

            <PhoneNumberInput
              value={jobSeekerDetails.contactNumber || ""}
              onChange={(phone) =>
                setJobSeekerDetails((prev) => ({
                  ...prev,
                  contactNumber: phone,
                }))
              }
              label="Contact Number"
              placeholder="Enter phone number"
            />

            <div>
              <p className="text-base font-bold text-black mb-1">Position</p>
              <input
                type="text"
                name="position"
                className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                value={jobSeekerDetails.position || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="md:col-span-2">
              <p className="text-base font-bold text-black mb-1">
                Personal Profile
              </p>
              <textarea
                name="personalProfile"
                className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                value={jobSeekerDetails.personalProfile || ""}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            <div>
              <p className="text-base font-bold text-black mb-1">DOB</p>
              <input
                type="date"
                name="dob"
                className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                value={jobSeekerDetails.dob || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <p className="text-base font-bold text-black mb-1">Nationality</p>
              <input
                type="text"
                name="nationality"
                className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                value={jobSeekerDetails.nationality || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <p className="text-base font-bold text-black mb-1">
                Marital Status
              </p>
              <input
                type="text"
                name="maritalStatus"
                className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                value={jobSeekerDetails.maritalStatus || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <p className="text-base font-bold text-black mb-1">Languages</p>
              <input
                type="text"
                name="languages"
                className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                value={jobSeekerDetails.languages || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <p className="text-base font-bold text-black mb-1">Religion</p>
              <input
                type="text"
                name="religion"
                className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                value={jobSeekerDetails.religion || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="md:col-span-2">
              <p className="text-base font-bold text-black mb-1">Address</p>
              <input
                type="text"
                name="address"
                className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                value={jobSeekerDetails.address || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <p className="text-base font-bold text-black mb-1">Ethnicity</p>
              <input
                type="text"
                name="ethnicity"
                className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                value={jobSeekerDetails.ethnicity || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <hr className="my-8 border-gray-300" />

          {/* Structured Sections */}
          {jobSeekerDetails._id && (
            <>
              <ExperienceSection
                experiences={jobSeekerDetails.experiences}
                jobseekerId={jobSeekerDetails._id}
                onRefresh={fetchJobSeekerDetails}
              />

              <EducationSection
                educations={jobSeekerDetails.educations}
                jobseekerId={jobSeekerDetails._id}
                onRefresh={fetchJobSeekerDetails}
              />

              <CertificationSection
                certifications={jobSeekerDetails.certifications}
                jobseekerId={jobSeekerDetails._id}
                onRefresh={fetchJobSeekerDetails}
              />
            </>
          )}

          <hr className="my-8 border-gray-300" />

          <div className="grid grid-cols-1 gap-4 mb-8">
            <SkillSection
              title="Soft Skills"
              initialSkills={jobSeekerDetails.softSkills}
              onSave={(newSkills) =>
                setJobSeekerDetails((prev) => ({
                  ...prev,
                  softSkills: newSkills,
                }))
              }
            />

            <SkillSection
              title="Professional Expertise"
              initialSkills={jobSeekerDetails.professionalExpertise}
              onSave={(newSkills) =>
                setJobSeekerDetails((prev) => ({
                  ...prev,
                  professionalExpertise: newSkills,
                }))
              }
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 mt-5 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors font-bold"
          >
            Update Main Details
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfileForm;
