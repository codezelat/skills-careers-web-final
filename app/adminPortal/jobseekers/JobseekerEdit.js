"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PiCheckCircle } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";

function JobseekerEdit({ jobseeker, Close, onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { status } = useSession();

  const [jobSeekerDetails, setJobSeekerDetails] = useState({
    _id: "",
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
    setJobSeekerDetails(jobseeker);
  }, [jobseeker]);

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setJobSeekerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/jobseeker/update`, {
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
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-md p-8 scrollbar-hide">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold text-[#001571]">
          Update {jobSeekerDetails?.firstName} {jobSeekerDetails?.lastName}
          </h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <IoCloseSharp size={24} />
          </button>
        </div>
        <div className="border-2 border-gray-200 mb-4" />
        {loading ? <p>Loading...</p> : <p>Edit your details now</p>}
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold text-[#001571]"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={jobSeekerDetails?.firstName || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-semibold text-[#001571]"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={jobSeekerDetails?.lastName || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#001571]"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={jobSeekerDetails?.email || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="contactnumber"
                className="block text-sm font-semibold text-[#001571]"
              >
                Phone
              </label>
              <input
                type="text"
                name="contactNumber"
                value={jobSeekerDetails?.contactNumber || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#001571]"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={jobSeekerDetails?.password || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-[#001571]"
            >
              Confirmation Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={jobSeekerDetails?.confirmPassword || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-semibold text-[#001571]"
            >
              Position
            </label>
            <input
              type="text"
              name="position"
              value={jobSeekerDetails?.position || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="personalProfile"
              className="block text-sm font-semibold text-[#001571]"
            >
              Personal Profile
            </label>
            <input
              type="text"
              name="personalProfile"
              value={jobSeekerDetails?.personalProfile || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-semibold text-[#001571]"
              >
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={jobSeekerDetails?.dob || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="nationality"
                className="block text-sm font-semibold text-[#001571]"
              >
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                value={jobSeekerDetails?.nationality || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="maritalStatus"
              className="block text-sm font-semibold text-[#001571]"
            >
              Marital Status
            </label>
            <input
              type="text"
              name="maritalStatus"
              value={jobSeekerDetails?.maritalStatus || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="languages"
                className="block text-sm font-semibold text-[#001571]"
              >
                Languages
              </label>
              <input
                type="text"
                name="languages"
                value={jobSeekerDetails?.languages || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="religion"
                className="block text-sm font-semibold text-[#001571]"
              >
                Religion
              </label>
              <input
                type="text"
                name="religion"
                value={jobSeekerDetails?.religion || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-semibold text-[#001571]"
            >
              Address
            </label>
            <input
              type="text"
              name="address"
              value={jobSeekerDetails?.address || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="ethnicity"
              className="block text-sm font-semibold text-[#001571]"
            >
              Ethnicity
            </label>
            <input
              type="text"
              name="ethnicity"
              value={jobSeekerDetails?.ethnicity || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-semibold text-[#001571]"
            >
              Experience
            </label>
            <input
              type="text"
              name="experience"
              value={jobSeekerDetails?.experience || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="education"
              className="block text-sm font-semibold text-[#001571]"
            >
              Education
            </label>
            <input
              type="text"
              name="education"
              value={jobSeekerDetails?.education || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="licensesCertifications"
              className="block text-sm font-semibold text-[#001571]"
            >
              Licenses Certifications
            </label>
            <input
              type="text"
              name="licensesCertifications"
              value={jobSeekerDetails?.licensesCertifications || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="softSkills"
              className="block text-sm font-semibold text-[#001571]"
            >
              Soft Skills
            </label>
            <input
              type="text"
              name="softSkills"
              value={jobSeekerDetails?.softSkills || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="professionalExpertise"
              className="block text-sm font-semibold text-[#001571]"
            >
              Professional Expertise
            </label>
            <input
              type="text"
              name="professionalExpertise"
              value={jobSeekerDetails?.professionalExpertise || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#001571] text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            >
              <div className="flex items-center space-x-3">
                <p>Add</p>
                <PiCheckCircle width={20} height={10} />
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobseekerEdit;