"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PortalLoading from "@/app/Portal/loading";
import {
  FaDribbble,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTimes,
  FaTwitter,
} from "react-icons/fa";
import Image from "next/image";
import { PiCheckCircle } from "react-icons/pi";
import RecruiterEdit from "@/app/Portal/recruiter/recruiterEdit";

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
    industry: "",
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
      alert("File size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
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

      alert("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image: ${error.message}`);
    }
  };

  const handleCoverImageChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
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

      alert("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image: ${error.message}`);
    }
  };

  // Recruiter details update
  const handleInputChange = (e) => {
    e.preventDefault();
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
        alert("Details updated successfully!");
        setShowApplicationForm(false);
      } else {
        alert("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating recruiter details:", error);
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
                  layout="fill"
                  priority
                  objectFit="cover"
                  quality={100}
                />
              ) : (
                <Image
                  src="/recruiterbg.png"
                  alt="Background"
                  layout="fill"
                  priority
                  objectFit="cover"
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
                  layout="fill"
                  objectFit="contain"
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
                      layout="fill"
                      priority
                      objectFit="cover"
                      quality={100}
                      className="fill"
                    />
                  ) : (
                    <Image
                      src="/default-avatar.jpg"
                      alt="Profile"
                      layout="fill"
                      priority
                      objectFit="cover"
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
                    objectFit="contain"
                    quality={100}
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="pr-8 sm:pr-6 flex justify-end mt-4 space-x-2 sm:space-x-4 text-blue-900 ">
                <a href={recruiterDetails.linkedin}>
                  <FaLinkedin size={30} className="cursor-pointer" />
                </a>
                <a href={recruiterDetails.x}>
                  <FaTwitter size={30} className="cursor-pointer" />
                </a>
                <a href={recruiterDetails.instagram}>
                  <FaInstagram size={30} className="cursor-pointer" />
                </a>
                <a href={recruiterDetails.facebook}>
                  <FaFacebook size={30} className="cursor-pointer" />
                </a>
                <a href={recruiterDetails.github}>
                  <FaGithub size={30} className="cursor-pointer" />
                </a>
                <a href={recruiterDetails.dribbble}>
                  <FaDribbble size={30} className="cursor-pointer" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 sm:pt-14">
            <h1 className="text-center sm:text-left text-2xl sm:text-4xl md:text-3xl font-bold text-black">
              {recruiterDetails.recruiterName} {recruiterDetails.location}
            </h1>

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
                    {recruiterDetails.industry}
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
                        layout="fill"
                        objectFit="contain"
                        quality={100}
                      />
                    </div>
                  </button>
                  <Image
                    src="/editiconwhite.png"
                    alt="Edit Icon"
                    layout="fill"
                    objectFit="contain"
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
