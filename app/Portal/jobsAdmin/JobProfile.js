"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import {
  FaDribbble,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTimes,
  FaTwitter,
} from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { PiCheckCircle } from "react-icons/pi";
import PortalLoading from "../loading";
import Swal from "sweetalert2";
import sriLankaDistricts from "@/data/sriLankaDistricts.json";

export default function JobProfile({ slug }) {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [jobDetails, setJobDetails] = useState([]);
  const [recruiterDetails, setRecruiterDetails] = useState([]);
  const [editedJobDetails, setEditedJobDetails] = useState({});
  const [customLocation, setCustomLocation] = useState("");

  const [editProfileForm, setEditProfileForm] = useState();
  const [editDescriptionForm, setDescriptionForm] = useState();
  const [editShortDescriptionForm, setShortDescriptionForm] = useState();
  const [editResponsibilitiesForm, setResponsibilitiesForm] = useState();
  const [editQualificationsForm, setQualificationsForm] = useState();
  const [editPerksForm, setPerksForm] = useState();

  useEffect(() => {
    if (session?.user?.email) {
      const fetchData = async () => {
        try {
          const jobResponse = await fetch(`/api/job/get?id=${slug}`);
          if (!jobResponse.ok) throw new Error("Failed to fetch job");
          const jobData = await jobResponse.json();

          const validDistricts = sriLankaDistricts.map((d) => d.value);
          const isValidDistrict = validDistricts.includes(jobData.location);

          setJobDetails(jobData);
          setEditedJobDetails({
            ...jobData,
            location: isValidDistrict ? jobData.location : "Other",
          });

          if (!isValidDistrict) {
            setCustomLocation(jobData.location);
          }

          const recruiterResponse = await fetch(
            `/api/recruiterdetails/get?id=${jobData.recruiterId}`
          );
          if (!recruiterResponse.ok)
            throw new Error("Failed to fetch recruiter");
          const recruiterData = await recruiterResponse.json();
          setRecruiterDetails(recruiterData);

          console.log(recruiterData);
        } catch (err) {
          setError(err.message);
          console.error("Fetch error:", err);
        } finally {
          setIsLoading(false);
        }
      };

      if (slug) fetchData();
    }
  }, [session, slug]);

  // Edit job details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedJobDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "location" && value !== "Other") {
      setCustomLocation("");
    }
  };
  const handleShortDescriptionInputChange = (e) => {
    const { name, value } = e.target;
    const words = value.trim().split(/\s+/);

    if (words.length <= 15) {
      setEditedJobDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Swal.fire({
      title: "Updating Job...",
      text: "Please wait while we update the job details.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const finalLocation =
        editedJobDetails.location === "Other"
          ? customLocation
          : editedJobDetails.location;

      const response = await fetch("/api/job/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: slug,
          ...editedJobDetails,
          location: finalLocation,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update job");
      }

      const data = await response.json();

      setJobDetails(editedJobDetails);
      setEditProfileForm(false);
      setDescriptionForm(false);
      setShortDescriptionForm(false);
      setQualificationsForm(false);
      setPerksForm(false);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Job updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating job:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update job",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // date
  const date = new Date(editedJobDetails.postedDate).getDate();
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date(editedJobDetails.postedDate);
  let month = monthName[d.getMonth()];
  const year = new Date(editedJobDetails.postedDate).getFullYear();
  const postedDate = `${date} ${month} ${year}`;

  const viewRecruiterProfile = () => {
    router.push(`/Portal/recruiter/${jobDetails.recruiterId}`);
  };

  if (isLoading) {
    return <PortalLoading />;
  }

  return (
    <>
      <div className="bg-white rounded-3xl py-7 px-7">
        <h1 className="flex justify-end font-semibold text-base">
          {postedDate || "Date not available"}
        </h1>
        <div className="flex flex-row items-center justify-between">
          <div className="relative flex flex-col w-[200px] h-[100px]">
            {recruiterDetails.logo ? (
              <Image
                src={recruiterDetails.logo}
                alt="Background"
                fill
                style={{ objectFit: "contain", objectPosition: "left center" }}
                priority
                quality={100}
              />
            ) : (
              <Image
                src="/default-avatar.jpg"
                alt="Background"
                fill
                style={{ objectFit: "contain", objectPosition: "left center" }}
                priority
                quality={100}
              />
            )}
          </div>
          <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 z-0">
            <button
              onClick={() => setEditProfileForm(true)}
              className="flex items-center justify-center rounded-md z-10"
            >
              <div className="flex gap-2">
                <MdOutlineEdit size={30} color="#001571" />
              </div>
            </button>
          </div>
        </div>
        <div className="flex flex-row w-full items-center justify-between mt-10 pb-5 border-b-2 border-[#B0B6D3]">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-10">
              <h1 className="text-[24px] font-bold text-[#001571]">
                {editedJobDetails.jobTitle}
              </h1>
              <div>
                {editedJobDetails.jobTypes &&
                  editedJobDetails.jobTypes.map((type, index) => (
                    <span
                      key={index}
                      className={`px-4 py-[6px] rounded-lg mr-2 text-white ${index % 2 === 0 ? "bg-[#001571]" : "bg-[#00B6B4]"
                        }`}
                    >
                      {type}
                    </span>
                  ))}
              </div>
            </div>
            <div className="text-base font-bold text-black">
              {recruiterDetails.recruiterName} | {editedJobDetails.location} |{" "}
              <span className="text-[#001571]">{editedJobDetails.jobCategory}</span>
            </div>
          </div>
          <button
            onClick={viewRecruiterProfile}
            className="flex flex-row items-center justify-center gap-2 px-5 rounded-md border-[#001571] border-[3px] font-bold text-sm text-[#001571] leading-tight h-12"
          >
            View Company Profile
            <span className="">
              <BsArrowUpRightCircleFill size={20} color="#001571" />
            </span>
          </button>
        </div>

        {/* Description */}
        <div className="flex flex-col w-full mt-10 pb-5 border-b-2 border-[#B0B6D3] gap-5">
          <div className="flex flex-row items-center justify-between w-full">
            <h1 className="flex items-center text-lg font-bold">
              Job Description
            </h1>
            <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
              <button
                onClick={() => setDescriptionForm(true)}
                className="flex items-center justify-center rounded-md z-10"
              >
                <div className="flex gap-2">
                  <MdOutlineEdit size={30} color="#001571" />
                </div>
              </button>
            </div>
          </div>
          <div className="text-base font-semibold">
            {jobDetails.jobDescription || "No description available"}
          </div>
        </div>

        {/* Short Description */}
        <div className="flex flex-col w-full mt-10 pb-5 gap-5">
          <div className="flex flex-row items-center justify-between w-full">
            <h1 className="flex items-center text-lg font-bold">
              Short Description
            </h1>
            <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
              <button
                onClick={() => setShortDescriptionForm(true)}
                className="flex items-center justify-center rounded-md z-10"
              >
                <div className="flex gap-2">
                  <MdOutlineEdit size={30} color="#001571" />
                </div>
              </button>
            </div>
          </div>
          <div className="text-base font-semibold">
            {editedJobDetails.shortDescription ||
              "No perks & benefits available"}
          </div>
        </div>

        {/* Responsibilities */}
        <div className="flex flex-col w-full mt-10 pb-5 border-b-2 border-[#B0B6D3] gap-5">
          <div className="flex flex-row items-center justify-between w-full">
            <h1 className="flex items-center text-lg font-bold">
              Key Responsibilities
            </h1>
            <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
              <button
                onClick={() => setResponsibilitiesForm(true)}
                className="flex items-center justify-center rounded-md z-10"
              >
                <div className="flex gap-2">
                  <MdOutlineEdit size={30} color="#001571" />
                </div>
              </button>
            </div>
          </div>
          <div className="text-base font-semibold">
            {editedJobDetails.keyResponsibilities ||
              "No responsibilities available"}
          </div>
        </div>

        {/* Qualifications */}
        <div className="flex flex-col w-full mt-10 pb-5 border-b-2 border-[#B0B6D3] gap-5">
          <div className="flex flex-row items-center justify-between w-full">
            <h1 className="flex items-center text-lg font-bold">
              Required Qualifications
            </h1>
            <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
              <button
                onClick={() => setQualificationsForm(true)}
                className="flex items-center justify-center rounded-md z-10"
              >
                <div className="flex gap-2">
                  <MdOutlineEdit size={30} color="#001571" />
                </div>
              </button>
            </div>
          </div>
          <div className="text-base font-semibold">
            {editedJobDetails.requiredQualifications ||
              "No qualifications available"}
          </div>
        </div>

        {/* Perks & Benefits */}
        <div className="flex flex-col w-full mt-10 pb-5 gap-5">
          <div className="flex flex-row items-center justify-between w-full">
            <h1 className="flex items-center text-lg font-bold">
              Perks & Benefits
            </h1>
            <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
              <button
                onClick={() => setPerksForm(true)}
                className="flex items-center justify-center rounded-md z-10"
              >
                <div className="flex gap-2">
                  <MdOutlineEdit size={30} color="#001571" />
                </div>
              </button>
            </div>
          </div>
          <div className="text-base font-semibold">
            {editedJobDetails.perksAndBenefits ||
              "No perks & benefits available"}
          </div>
        </div>
      </div>

      {/* Profile content edit form */}
      {editProfileForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          {/* Popup Container */}
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h4 className="text-2xl font-semibold text-[#001571]">
                Edit Job Profile
              </h4>
              <button
                onClick={() => setEditProfileForm(false)}
                className="text-gray-500 hover:text-red-500 focus:outline-none"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={editedJobDetails.jobTitle || ""}
                    onChange={handleInputChange}
                    className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    Location
                  </label>
                  <select
                    name="location"
                    value={editedJobDetails.location || ""}
                    onChange={handleInputChange}
                    className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  >
                    <option value="">Select a location</option>
                    {sriLankaDistricts.map((district) => (
                      <option key={district.value} value={district.value}>
                        {district.label}
                      </option>
                    ))}
                  </select>
                  {editedJobDetails.location === "Other" && (
                    <input
                      type="text"
                      placeholder="Please specify location"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    Posted Date
                  </label>
                  <input
                    type="date"
                    name="postedDate"
                    value={editedJobDetails.postedDate || ""}
                    onChange={handleInputChange}
                    className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#001571] mb-2">
                    Job Type
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      "On Site",
                      "Hybrid",
                      "Remote",
                      "Full-Time",
                      "Part-Time",
                      "Freelance",
                    ].map((type, index) => {
                      const isChecked =
                        editedJobDetails.jobTypes?.includes(type);
                      return (
                        <label
                          key={index}
                          className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all
                                                        ${isChecked
                              ? "bg-[#001571] text-white" // Checked state
                              : "bg-white text-black border border-gray-400 hover:bg-gray-100"
                            } // Unchecked state`}
                        >
                          <input
                            type="checkbox"
                            name="jobTypes"
                            value={type}
                            checked={isChecked}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setEditedJobDetails((prev) => ({
                                ...prev,
                                jobTypes: checked
                                  ? [...(prev.jobTypes || []), type]
                                  : prev.jobTypes.filter((t) => t !== type),
                              }));
                            }}
                            className="hidden"
                          />
                          <span className="text-sm">{type}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                  }`}
              >
                {isSubmitting ? "Saving..." : "Save"}
                <span className="ml-2">
                  <PiCheckCircle size={20} />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Description edit form */}
      {editDescriptionForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          {/* Popup Container */}
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h4 className="text-2xl font-semibold text-[#001571]">
                Edit Job Description
              </h4>
              <button
                onClick={() => setDescriptionForm(false)}
                className="text-gray-500 hover:text-red-500 focus:outline-none"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    Job Description
                  </label>
                  <textarea
                    type="text"
                    name="jobDescription"
                    value={editedJobDetails.jobDescription || ""}
                    onChange={handleInputChange}
                    className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                  }`}
              >
                {isSubmitting ? "Saving..." : "Save"}
                <span className="ml-2">
                  <PiCheckCircle size={20} />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* short description edit form */}
      {editShortDescriptionForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          {/* Popup Container */}
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h4 className="text-2xl font-semibold text-[#001571]">
                Edit Short Description
              </h4>
              <button
                onClick={() => setShortDescriptionForm(false)}
                className="text-gray-500 hover:text-red-500 focus:outline-none"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    Short Description
                  </label>
                  <textarea
                    type="text"
                    name="shortDescription"
                    value={editedJobDetails.shortDescription || ""}
                    placeholder="Should be less than 15 words..."
                    onChange={handleShortDescriptionInputChange}
                    className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                  }`}
              >
                {isSubmitting ? "Saving..." : "Save"}
                <span className="ml-2">
                  <PiCheckCircle size={20} />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsibilities edit form */}
      {editResponsibilitiesForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          {/* Popup Container */}
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h4 className="text-2xl font-semibold text-[#001571]">
                Edit Key Responsibilities
              </h4>
              <button
                onClick={() => setResponsibilitiesForm(false)}
                className="text-gray-500 hover:text-red-500 focus:outline-none"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    Key Responsibilities
                  </label>
                  <textarea
                    type="text"
                    name="keyResponsibilities"
                    value={editedJobDetails.keyResponsibilities || ""}
                    onChange={handleInputChange}
                    className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                  }`}
              >
                {isSubmitting ? "Saving..." : "Save"}
                <span className="ml-2">
                  <PiCheckCircle size={20} />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Qualifications edit form */}
      {editQualificationsForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          {/* Popup Container */}
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h4 className="text-2xl font-semibold text-[#001571]">
                Edit Required Qualifications
              </h4>
              <button
                onClick={() => setQualificationsForm(false)}
                className="text-gray-500 hover:text-red-500 focus:outline-none"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    Required Qualifications
                  </label>
                  <textarea
                    type="text"
                    name="requiredQualifications"
                    value={editedJobDetails.requiredQualifications || ""}
                    onChange={handleInputChange}
                    className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                  }`}
              >
                {isSubmitting ? "Saving..." : "Save"}
                <span className="ml-2">
                  <PiCheckCircle size={20} />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Perks edit form */}
      {editPerksForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          {/* Popup Container */}
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h4 className="text-2xl font-semibold text-[#001571]">
                Edit Perks & Benefits
              </h4>
              <button
                onClick={() => setPerksForm(false)}
                className="text-gray-500 hover:text-red-500 focus:outline-none"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    Perks & Benefits
                  </label>
                  <textarea
                    type="text"
                    name="perksAndBenefits"
                    value={editedJobDetails.perksAndBenefits || ""}
                    onChange={handleInputChange}
                    className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                  }`}
              >
                {isSubmitting ? "Saving..." : "Save"}
                <span className="ml-2">
                  <PiCheckCircle size={20} />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
