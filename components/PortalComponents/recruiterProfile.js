"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PortalLoading from "@/app/Portal/loading";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTimes,
  FaTwitter,
  FaGlobe,
} from "react-icons/fa";
import Image from "next/image";
import { PiCheckCircle } from "react-icons/pi";
import RecruiterEdit from "@/app/Portal/recruiter/recruiterEdit";
import Swal from "sweetalert2";

// Helper function to format address
const formatAddress = (recruiter) => {
  const { addressLine, district, province, country, location } = recruiter;
  const parts = [];

  if (addressLine) parts.push(addressLine);

  if (country === "Sri Lanka" || !country) {
    // For Sri Lanka, show district, province, country
    if (district) parts.push(district);
    if (province && province !== district) parts.push(province);
    parts.push("Sri Lanka");
  } else {
    // For other countries, show country
    if (country) parts.push(country);
  }

  // Fallback to old location field if new fields don't exist
  const formatted = parts.filter(Boolean).join(", ");
  return formatted || location || "Location not specified";
};

export default function RecruiterProfile({ slug }) {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showCredentialsForm, setShowCredentialsForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recruiterDetails, setRecruiterDetails] = useState({
    _id: "",
    recruiterName: "",
    email: "",
    employeeRange: "",
    contactNumber: "",
    telephoneNumber: "",
    userId: "",
    createdAt: "",
    location: "",
    country: "Sri Lanka",
    district: "",
    province: "",
    addressLine: "",
    industry: "",
    category: "",
    membership: "",
    coverImage: "",
    website: "",
    companyDescription: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    x: "",
    github: "",
    dribbble: "",
  });

  const [userDetails, setUserDetails] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    profileImage: "",
  });

  useEffect(() => {
    if (session?.user?.email) {
      const fetchDetails = async () => {
        try {
          const recruiterResponse = await fetch(
            `/api/recruiterdetails/get?userId=${session.user.id}`
          );
          const recruiterData = await recruiterResponse.json();

          if (!recruiterResponse.ok) {
            throw new Error(
              recruiterData.message || "Failed to fetch recruiter details"
            );
          }

          setRecruiterDetails(recruiterData);

          const userResponse = await fetch(
            `/api/users/get?id=${session.user.id}`
          );
          const userData = await userResponse.json();

          if (!userResponse.ok) {
            throw new Error(userData.message || "Failed to fetch user details");
          }

          setUserDetails(userData);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDetails();
    }
  }, [session, slug]);

  const handleImageChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "File size should be less than 5MB.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please upload an image file.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("email", recruiterDetails.email);

      console.log("Starting image upload...");
      const response = await fetch("/api/recruiterdetails/uploadimage", {
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

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Profile image uploaded successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      // Force session refresh
      window.dispatchEvent(new Event("visibilitychange"));
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to upload image.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleCoverImageChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "File size should be less than 5MB.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please upload an image file.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("email", recruiterDetails.email);

      console.log("Starting image upload...");
      const response = await fetch("/api/recruiterdetails/uploadCoverImage", {
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
        coverImage: data.imageUrl,
      }));

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Background image uploaded successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to upload image.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // Recruiter details update
  const handleInputChange = (e) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
    const { name, value } = e.target;
    setRecruiterDetails((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/recruiterdetails/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recruiterDetails),
      });
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Details updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        setShowApplicationForm(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update details.",
        });
      }
    } catch (error) {
      console.error("Error updating recruiter details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating details.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PortalLoading />;
  }

  return (
    <>
      <div className="bg-white rounded-3xl py-7 px-7">
        <div>
          <div className="">
            {/* Background Image */}
            <div className="bg-red-300 relative w-full h-[300px] rounded-t-2xl overflow-hidden flex items-top justify-end">
              {recruiterDetails.coverImage ? (
                <Image
                  src={recruiterDetails.coverImage}
                  alt="Background"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  quality={100}
                />
              ) : (
                <Image
                  src="/recruiterbg.png"
                  alt="Background"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  quality={100}
                />
              )}
              {/* cover image edit btn */}
              <div className="z-0 rounded-full relative overflow-hidden flex flex-wrap items-center justify-end shadow-md w-12 h-12 mt-3 mr-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  id="logo-image-input"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <Image
                  id="cover-image-input"
                  src="/editiconwhite.png"
                  alt="Edit Icon"
                  fill
                  style={{ objectFit: "contain" }}
                  quality={100}
                  className="cursor-pointer"
                />
              </div>
            </div>
            {/* Profile Image */}
            <div className="relative flex flex-row justify-between">
              {/* DP Image */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-[180px] lg:h-[180px] mt-[-92px] ml-10 flex items-top justify-center relative">
                {/* Profile picture container */}
                <div className="relative border-4 border-[#001571] bg-white rounded-full overflow-hidden w-24 h-24 sm:w-28 sm:h-28 lg:w-[180px] lg:h-[180px]">
                  {recruiterDetails.logo ? (
                    <Image
                      src={recruiterDetails.logo}
                      alt="Profile"
                      fill
                      priority
                      style={{ objectFit: "cover" }}
                      quality={100}
                      className="fill"
                    />
                  ) : (
                    <Image
                      src="/default-avatar.jpg"
                      alt="Profile"
                      fill
                      priority
                      style={{ objectFit: "cover" }}
                      quality={100}
                      className="fill"
                    />
                  )}
                </div>

                {/* Profile picture edit icon */}
                <div className="absolute top-0 right-0 w-12 h-12 rounded-full flex items-center justify-center shadow-md z-0 bg-white">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="logo-image-input"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {/* Edit Icon */}
                  <Image
                    src="/editiconwhite.png"
                    alt="Edit Icon"
                    width={40}
                    height={40}
                    quality={100}
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="pr-8 sm:pr-6 flex justify-end mt-4 space-x-2 sm:space-x-4 text-blue-900 ">
                {recruiterDetails.linkedin && (
                  <a
                    href={recruiterDetails.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin
                      size={24}
                      className="cursor-pointer hover:opacity-80"
                    />
                  </a>
                )}
                {recruiterDetails.x && (
                  <a
                    href={recruiterDetails.x}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter
                      size={24}
                      className="cursor-pointer hover:opacity-80"
                    />
                  </a>
                )}
                {recruiterDetails.instagram && (
                  <a
                    href={recruiterDetails.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram
                      size={24}
                      className="cursor-pointer hover:opacity-80"
                    />
                  </a>
                )}
                <a
                  href={recruiterDetails.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook
                    size={24}
                    className="cursor-pointer hover:opacity-80"
                  />
                </a>
                )}
                {recruiterDetails.github && (
                  <a
                    href={recruiterDetails.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub
                      size={24}
                      className="cursor-pointer hover:opacity-80"
                    />
                  </a>
                )}
                {recruiterDetails.website && (
                  <a
                    href={recruiterDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGlobe
                      size={24}
                      className="cursor-pointer hover:opacity-80"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 sm:pt-14">
            <h1 className="text-center sm:text-left text-2xl sm:text-4xl md:text-3xl font-bold text-black">
              {recruiterDetails.recruiterName}
            </h1>
            <p className="text-center sm:text-left text-base text-gray-600 mt-2">
              {formatAddress(recruiterDetails)}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between pr-2 sm:pr-5 space-y-4 sm:space-y-0 mt-0 text-sm w-full">
              <div className="flex flex-wrap items-center justify-center sm:justify-start space-y-4 sm:space-y-0 space-x-0 sm:space-x-4">
                <div className="flex items-center">
                  <Image
                    src="/worldsearch.png"
                    width={20}
                    height={20}
                    alt="Website"
                    className="rounded-full"
                  />
                  <p className="text-black ml-2 font-semibold text-base">
                    {recruiterDetails.email}
                  </p>
                </div>
                <div className="flex items-center">
                  <Image
                    src="/reward.png"
                    width={20}
                    height={20}
                    alt="Industry"
                    className="rounded-full"
                  />
                  <p className="text-black ml-2 font-semibold text-base">
                    {recruiterDetails.category || recruiterDetails.industry}
                  </p>
                </div>
                <div className="flex items-center">
                  <Image
                    src="/attach.png"
                    width={20}
                    height={20}
                    alt="Employees"
                    className="rounded-full"
                  />
                  <p className="text-black ml-2 font-semibold text-base">
                    {recruiterDetails.employeeRange}
                  </p>
                </div>
              </div>
              <div className="flex justify-center sm:justify-end w-full sm:w-auto sm:pt-2 z-0">
                <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-end shadow-md w-12 h-12 mt-3 mr-3 z-0">
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="text-white px-3 py-2 sm:px-4 rounded-md z-10"
                  >
                    <div className="flex gap-2">
                      <Image
                        src="/editiconwhite.png"
                        alt="Edit Icon"
                        fill
                        style={{ objectFit: "contain" }}
                        quality={100}
                      />
                    </div>
                  </button>
                  <Image
                    src="/editiconwhite.png"
                    alt="Edit Icon"
                    fill
                    style={{ objectFit: "contain" }}
                    quality={100}
                    className="z-0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-left space-y-4 mt-10">
            <h5 className="lg:text-xl md:text-xl sm:text-2xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
              Company Description
            </h5>
            <p className="text-justify font-medium">
              {recruiterDetails.companyDescription}
            </p>
          </div>

          {/* Edit Profile Form Popup */}
          {showApplicationForm && (
            <RecruiterEdit
              recruiterDetails={recruiterDetails}
              onClose={() => setShowApplicationForm(false)}
              onSubmit={submitHandler}
              onInputChange={handleInputChange}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </>
  );
}
