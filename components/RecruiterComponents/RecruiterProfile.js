"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import RecruiterEdit from "./RecruiterEdit";
import { useState } from "react";
import {
  FaDribbble,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import EditProfileForm from "./EditProfileForm";

function RecruiterProfile({ recruiter, onClose }) {
  const [recruiterDetails, setRecruiterDetails] = useState({
    _id: "",
    recruiterName: "",
    employeeRange: "",
    email: "",
    contactNumber: "",
    website: "",
    companyDescription: "",
    industry: "",
    location: "",
    logo: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    x: "",
  });
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);


  useEffect(() => {
    if (recruiter) {
      setRecruiterDetails(recruiter);
    }
  }, [recruiter]);

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

      console.log("Starting image upload...");
      const response = await fetch("/api/recruiter/uploadimage", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      console.log("Upload successful:", data);
      setRecruiterDetails((prev) => ({
        ...prev,
        logo: data.imageUrl,
      }));

      alert("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image: ${error.message}`);
    }
  };

  const handleRecruiterSelect = () => {
    setSelectedRecruiter(recruiterDetails);
  };

  const handleCloseProfile = () => {
    setSelectedRecruiter(null);
  };

  return (
    <>
      <div>
        <div className="relative">
          {/* Background Image */}
          <Image
            src="/images/recruiterbg.png"
            alt="Background"
            width={1200}
            height={300}
            className="w-full h-32 sm:h-48 object-cover"
          />
          {/* Edit Image */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white rounded-full overflow-hidden w-[30px] sm:w-[30px] h-[30px] sm:h-[30px] flex items-center justify-center shadow-md">
            <Image
              src="/images/miyuri_img/editiconwhite.png"
              alt="Edit Icon"
              width={40}
              height={40}
            />
          </div>
          {/* Profile Image */}
          <div className="relative">
            {/* DP Image */}
            <div className="absolute transform -mt-10 sm:-mt-16 ml-4 sm:ml-10 lg:ml-20 border-4 border-[#001571] bg-white rounded-full overflow-hidden w-24 h-24 sm:w-28 sm:h-28 lg:w-[180px] lg:h-[180px] flex items-center justify-center">
              <Image
                src={recruiterDetails.logo}
                alt="Profile"
                width={300}
                height={190}
                className="fill"
              />
            </div>

            {/* Edit Icon */}
            <div className="absolute -top-9 left-[200px] transform translate-x-1/2 -translate-y-1/2 w-20 h-8 sm:w-10 sm:h-30  rounded-full  items-center justify-center shadow-md">
              <Image
                src="/images/miyuri_img/editiconwhite.png"
                alt="Edit Icon"
                width={40}
                height={20}
              />
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="pr-8 sm:pr-6 flex justify-end mt-4 space-x-2 sm:space-x-4 text-blue-900">
          <FaLinkedin size={20} className="cursor-pointer" />
          <FaTwitter size={20} className="cursor-pointer" />
          <FaInstagram size={20} className="cursor-pointer" />
          <FaFacebook size={20} className="cursor-pointer" />
          <FaGithub size={20} className="cursor-pointer" />
          <FaDribbble size={20} className="cursor-pointer" />
        </div>

        {/* Profile Info */}
        <div className="p-4 sm:p-10 text-left mt-20">
          {recruiters.map((recruiter) => (
            <div key={recruiter.id}>
              <h3 className="text-lg sm:text-xl font-bold text-blue-900">
                {recruiterDetails.recruiterName || "N/A"}{" "}
                <span className="text-blue-500">✓</span>
              </h3>

              {/* Container for details and Apply Now button */}
              <div className="flex flex-col lg:flex-row sm:flex-col md:flex-row justify-between items-start sm:items-start mt-4  gap-4">
                {/* Details section */}
                <div className="flex flex-col lg:flex-row sm:flex-col md:flex-col sm:gap-8 items-start sm:items-start">
                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/miyuri_img/location.png"
                      alt="location"
                      width={20}
                      height={20}
                    />
                    <p className="text-gray-800 font-semibold">
                      {recruiterDetails.location}
                    </p>
                  </div>
                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/miyuri_img/category.png"
                      alt="industry"
                      width={20}
                      height={20}
                    />
                    <p className="text-gray-800 font-semibold">
                      {recruiterDetails.industry || "N/A"}
                    </p>
                  </div>
                  {/* Employee Range */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/images/miyuri_img/user-octagon.png"
                      alt="employees"
                      width={20}
                      height={20}
                    />
                    <p className="text-gray-800 font-semibold">
                      {recruiterDetails.employeeRange || "N/A"}
                    </p>
                  </div>
                </div>
                {/* Edit Button */}
                <div>
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className=" text-white   px-3 py-2 sm:px-4 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/miyuri_img/editicon.png"
                        alt="arrow"
                        width={50}
                        height={16}
                      />
                    </div>
                  </button>
                </div>
              </div>
              <h3 className="mt-5 text-blue-900 text-lg sm:text-xl font-bold">
                Company Description
              </h3>
              <p className="text-gray-800 mt-4 sm:mt-8 mb-4 sm:mb-6 font-sans">
                {recruiterDetails.companyDescription || "N/A"}
              </p>
            </div>
          ))}
        </div>
                {/* Edit Profile Form Popup */}
                {showApplicationForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
              <EditProfileForm onClose={() => setShowApplicationForm(false)} />
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default RecruiterProfile;
