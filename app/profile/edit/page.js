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
import { countries } from "@/lib/countries";
import sriLankaDistricts from "@/data/sriLankaDistricts.json";
import { FaTimes } from "react-icons/fa";

const LANGUAGES_LIST = ["Sinhala", "Tamil", "English"];

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

  // Language Handling State & Logic
  const [otherLanguage, setOtherLanguage] = useState("");
  const [showOtherLanguage, setShowOtherLanguage] = useState(false);

  const currentLanguages = jobSeekerDetails.languages
    ? jobSeekerDetails.languages
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  const updateLanguages = (newLanguages) => {
    const event = {
      target: {
        name: "languages",
        value: newLanguages.join(", "),
      },
    };
    handleInputChange(event);
  };

  const handleLanguageSelect = (e) => {
    const value = e.target.value;
    if (!value) return;

    if (value === "Other") {
      setShowOtherLanguage(true);
      return;
    }

    if (!currentLanguages.includes(value)) {
      updateLanguages([...currentLanguages, value]);
    }
    // Reset select
    e.target.value = "";
  };

  const handleAddOtherLanguage = () => {
    if (
      otherLanguage.trim() &&
      !currentLanguages.includes(otherLanguage.trim())
    ) {
      updateLanguages([...currentLanguages, otherLanguage.trim()]);
      setOtherLanguage("");
      setShowOtherLanguage(false);
    }
  };

  const removeLanguage = (langToRemove) => {
    updateLanguages(currentLanguages.filter((l) => l !== langToRemove));
  };

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

              <div className="flex flex-wrap gap-2 mb-2 p-2 border-2 border-gray-400 rounded min-h-[46px]">
                {currentLanguages.map((lang, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => removeLanguage(lang)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                ))}

                {currentLanguages.length === 0 && (
                  <span className="text-gray-400 text-sm py-1 px-2">
                    Select languages below
                  </span>
                )}
              </div>

              {!showOtherLanguage ? (
                <select
                  onChange={handleLanguageSelect}
                  className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Language to Add
                  </option>
                  {LANGUAGES_LIST.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                  <option value="Other">Other (Add Custom)</option>
                </select>
              ) : (
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={otherLanguage}
                    onChange={(e) => setOtherLanguage(e.target.value)}
                    placeholder="Type language..."
                    className="flex-1 px-2 py-1 border-solid border-2 border-gray-400 outline-none rounded"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddOtherLanguage();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddOtherLanguage}
                    className="bg-blue-900 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-blue-800"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtherLanguage("");
                      setShowOtherLanguage(false);
                    }}
                    className="text-gray-500 hover:text-gray-700 px-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
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

            {/* Structured Address Fields */}
            <div className="md:col-span-2 space-y-4">
              {/* Country Selection */}
              <div>
                <p className="text-base font-bold text-black mb-1">Country</p>
                <select
                  name="country"
                  value={jobSeekerDetails.country || "Sri Lanka"}
                  onChange={(e) => {
                    const country = e.target.value;
                    handleInputChange({
                      target: { name: "country", value: country },
                    });
                    if (country !== "Sri Lanka") {
                      handleInputChange({
                        target: { name: "district", value: "" },
                      });
                      handleInputChange({
                        target: { name: "province", value: "" },
                      });
                      handleInputChange({
                        target: { name: "location", value: "" },
                      });
                    } else {
                      handleInputChange({
                        target: { name: "location", value: "" },
                      });
                    }
                  }}
                  className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                >
                  {countries.map((country) => (
                    <option key={country.value} value={country.label}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address Line */}
              <div>
                <p className="text-base font-bold text-black mb-1">
                  Address Line
                </p>
                <input
                  type="text"
                  name="addressLine"
                  className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                  value={jobSeekerDetails.addressLine || ""}
                  onChange={handleInputChange}
                  placeholder="Street address, building name, etc."
                />
              </div>

              {/* District/City & Province */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(jobSeekerDetails.country || "Sri Lanka") === "Sri Lanka" ? (
                  <>
                    <div>
                      <p className="text-base font-bold text-black mb-1">
                        City (District)
                      </p>
                      <select
                        name="district"
                        value={jobSeekerDetails.district || ""}
                        onChange={(e) => {
                          const district = e.target.value;
                          const selectedDistrict = sriLankaDistricts.find(
                            (d) => d.value === district
                          );
                          if (selectedDistrict) {
                            handleInputChange({
                              target: {
                                name: "district",
                                value: selectedDistrict.district,
                              },
                            });
                            handleInputChange({
                              target: {
                                name: "province",
                                value: selectedDistrict.province,
                              },
                            });
                          } else {
                            handleInputChange({
                              target: { name: "district", value: district },
                            });
                          }
                        }}
                        className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                      >
                        <option value="">Select City</option>
                        {sriLankaDistricts.map((district) => (
                          <option key={district.value} value={district.value}>
                            {district.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <p className="text-base font-bold text-black mb-1">
                        Province
                      </p>
                      <input
                        type="text"
                        name="province"
                        className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded bg-gray-100"
                        value={jobSeekerDetails.province || ""}
                        readOnly
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-base font-bold text-black mb-1">
                        City
                      </p>
                      <input
                        type="text"
                        name="location"
                        className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                        value={jobSeekerDetails.location || ""}
                        onChange={handleInputChange}
                        placeholder="Enter City"
                      />
                    </div>
                    <div>
                      <p className="text-base font-bold text-black mb-1">
                        Province/State
                      </p>
                      <input
                        type="text"
                        name="province"
                        className="px-2 py-1 w-full border-solid border-2 border-gray-400 outline-none rounded"
                        value={jobSeekerDetails.province || ""}
                        onChange={handleInputChange}
                        placeholder="Enter Province or State"
                      />
                    </div>
                  </>
                )}
              </div>
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
