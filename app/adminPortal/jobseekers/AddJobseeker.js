"use client";
import { useState } from "react";
import { PiCheckCircle } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";

async function createJobseeker(
  firstName,
  lastName,
  email,
  contactNumber,
  password,
  confirmPassword,
  position,
  personalProfile,
  dob,
  nationality,
  maritalStatus,
  languages,
  religion,
  address,
  ethnicity,
  experience,
  education,
  licensesCertifications,
  softSkills,
  professionalExpertise
) {
  const response = await fetch("/api/auth/jobseekersignup", {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      contactNumber,
      password,
      confirmPassword,
      position,
      personalProfile,
      dob,
      nationality,
      maritalStatus,
      languages,
      religion,
      address,
      ethnicity,
      experience,
      education,
      licensesCertifications,
      softSkills,
      professionalExpertise,
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

function AddJobseeker({ onClose }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [position, setPosition] = useState("");
  const [personalProfile, setPersonalProfile] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [maritalStatus, setMaritalStatu] = useState("");
  const [languages, setLanguages] = useState("");
  const [religion, setReligion] = useState("");
  const [address, setAddress] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [licensesCertifications, setLicensesCertifications] = useState("");
  const [softSkills, setSoftSkills] = useState("");
  const [professionalExpertise, setProfessionalExpertise] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setContactNumber("");
    setPassword("");
    setConfirmPassword("");
    setPosition("");
    setPersonalProfile("");
    setDob("");
    setNationality("");
    setMaritalStatu("");
    setLanguages("");
    setReligion("");
    setAddress("");
    setEthnicity("");
    setExperience("");
    setEducation("");
    setLicensesCertifications("");
    setSoftSkills("");
    setProfessionalExpertise("");
  };

  async function submitHandler(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await createJobseeker(
        firstName,
        lastName,
        email,
        contactNumber,
        password,
        confirmPassword,
        position,
        personalProfile,
        dob,
        nationality,
        maritalStatus,
        languages,
        religion,
        address,
        ethnicity,
        experience,
        education,
        licensesCertifications,
        softSkills,
        professionalExpertise
      );

      console.log(result);
      alert(result.message);
      clearForm();
      onClose();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
        <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-md p-8 scrollbar-hide">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-2xl font-semibold text-[#001571]">
              Add New Job Seeker
            </h4>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 focus:outline-none"
            >
              <IoCloseSharp size={24} />
            </button>
          </div>
          <div className="border-2 border-gray-200 mb-4" />

          <form className="space-y-6" onSubmit={submitHandler}>
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-semibold text-[#001571]"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                name="lastname"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  name="contactnumber"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
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
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="confirmpassword"
                className="block text-sm font-semibold text-[#001571]"
              >
                Confirmation Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
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
                required
                value={personalProfile}
                onChange={(e) => setPersonalProfile(e.target.value)}
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
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
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
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="martialStatus"
                className="block text-sm font-semibold text-[#001571]"
              >
                Martial Status
              </label>
              <input
                type="text"
                name="maritalStatus"
                value={maritalStatus}
                onChange={(e) => setMaritalStatu(e.target.value)}
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
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
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
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
                value={ethnicity}
                onChange={(e) => setEthnicity(e.target.value)}
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
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
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
                value={education}
                onChange={(e) => setEducation(e.target.value)}
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
                value={licensesCertifications}
                onChange={(e) => setLicensesCertifications(e.target.value)}
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
                value={softSkills}
                onChange={(e) => setSoftSkills(e.target.value)}
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
                value={professionalExpertise}
                onChange={(e) => setProfessionalExpertise(e.target.value)}
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
export default AddJobseeker;
