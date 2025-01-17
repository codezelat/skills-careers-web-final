"use client";
import { useState } from "react";

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
    <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-[90vh] w-1/2 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Add Jobseeker</h2>
        <button
          onClick={onClose}
          className="px-2 py-1 h-12 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          Close ✕
        </button>
      </div>

      <div className="grid justify-items-center">
        <form onSubmit={submitHandler} className="w-fit">
          <div>
            <p
              htmlFor="firstname"
              className="text-base font-bold text-black mb-1"
            >
              First Name
            </p>
            <input
              type="text"
              name="firstname"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>
          <div>
            <p
              htmlFor="lastname"
              className="text-base font-bold text-black mb-1"
            >
              Last Name
            </p>
            <input
              type="text"
              name="lastname"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p htmlFor="email" className="text-base font-bold text-black mb-1">
              Email
            </p>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="contactnumber"
              className="text-base font-bold text-black mb-1"
            >
              Contact Number
            </p>
            <input
              type="text"
              name="contactnumber"
              required
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="password"
              className="text-base font-bold text-black mb-1"
            >
              Your Password
            </p>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>
          <div>
            <p
              htmlFor="confirmPassword"
              className="text-base font-bold text-black mb-1"
            >
              Confirm Password
            </p>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="position"
              className="text-base font-bold text-black mb-1"
            >
              Position
            </p>
            <input
              type="text"
              name="position"
              required
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="personalProfile"
              className="text-base font-bold text-black mb-1"
            >
              Personal Profile
            </p>
            <input
              type="text"
              name="personalProfile"
              required
              value={personalProfile}
              onChange={(e) => setPersonalProfile(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p htmlFor="dob" className="text-base font-bold text-black mb-1">
              Date of Birth
            </p>
            <input
              type="date"
              name="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="nationality"
              className="text-base font-bold text-black mb-1"
            >
              Nationality
            </p>
            <input
              type="text"
              name="nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="maritalStatus"
              className="text-base font-bold text-black mb-1"
            >
              Marital Status
            </p>
            <input
              type="text"
              name="maritalStatus"
              value={maritalStatus}
              onChange={(e) => setMaritalStatu(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="languages"
              className="text-base font-bold text-black mb-1"
            >
              Languages
            </p>
            <input
              type="text"
              name="languages"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="religion"
              className="text-base font-bold text-black mb-1"
            >
              Religion
            </p>
            <input
              type="text"
              name="religion"
              value={religion}
              onChange={(e) => setReligion(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="address"
              className="text-base font-bold text-black mb-1"
            >
              Address
            </p>
            <input
              type="text"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="ethnicity"
              className="text-base font-bold text-black mb-1"
            >
              Ethnicity
            </p>
            <input
              type="text"
              name="ethnicity"
              value={ethnicity}
              onChange={(e) => setEthnicity(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="experience"
              className="text-base font-bold text-black mb-1"
            >
              Experience
            </p>
            <input
              type="text"
              name="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="education"
              className="text-base font-bold text-black mb-1"
            >
              Education
            </p>
            <input
              type="text"
              name="education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="licensesCertifications"
              className="text-base font-bold text-black mb-1"
            >
              Licenses Certifications
            </p>
            <input
              type="text"
              name="licensesCertifications"
              value={licensesCertifications}
              onChange={(e) => setLicensesCertifications(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="softSkills"
              className="text-base font-bold text-black mb-1"
            >
              Soft Skills
            </p>
            <input
              type="text"
              name="softSkills"
              value={softSkills}
              onChange={(e) => setSoftSkills(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="professionalExpertise"
              className="text-base font-bold text-black mb-1"
            >
              Professional Expertise
            </p>
            <input
              type="text"
              name="professionalExpertise"
              value={professionalExpertise}
              onChange={(e) => setProfessionalExpertise(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <button className="w-96 px-4 py-2 mt-5 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors">
              Create New Jobseeker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddJobseeker;
