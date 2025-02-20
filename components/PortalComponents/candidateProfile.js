"use client";

import { useState, useEffect } from "react";
import PortalLoading from "@/app/Portal/loading";
import {
  FaDribbble,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaMedal,
  FaTimes,
  FaTwitter,
} from "react-icons/fa";
import Image from "next/image";
import { PiCheckCircle } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ExperienceCard from "@/components/PortalComponents/experienceCard";
import EducationCard from "@/components/PortalComponents/educationCard";
import CertificationCard from "@/components/PortalComponents/certificationCard";
import ProfileEditFormPopup from "@/app/Portal/candidates/ProfileEditForm";
import BioEditFormPopup from "@/app/Portal/candidates/BioDataForm";
import { FiPlus } from "react-icons/fi";
import { GoPencil } from "react-icons/go";
import ExperienceCardEdit from "./experienceCardEdit";
import EducationCardEdit from "./educationCardEdit";
import CertificationCardEdit from "./certificationCardEdit";
import SoftSkillsCard from "./softskillsCard";
import SoftSkillsCardEdit from "./softskillsCardEdit";
import ExpertiseCard from "./expertiseCard";
import ExpertiseCardEdit from "./expertiseCardEdit";
import GenerateCV from "@/lib/GenerateCV";

export default function CandidateProfile() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  const [ProfileEditForm, setProfileEditForm] = useState(false);
  const [BioDataForm, setBioDataForm] = useState(false);
  const [openCreateExperienceForm, setOpenCreateExperienceForm] =
    useState(false);
  const [openEditxperienceForm, setOpenEditExperienceForm] = useState(false);
  const [openCreateEducationForm, setOpenCreateEducationoForm] =
    useState(false);
  const [openEditEducationForm, setOpenEditEducationoForm] = useState(false);
  const [openCreateCertificationForm, setOpenCreateCertificationForm] =
    useState(false);
  const [openEditCertificationForm, setOpenEditCertificationForm] =
    useState(false);
  const [openCreateSoftskillsForm, setOpenCreateSoftskillsForm] =
    useState(false);
  const [openEditSoftskillsForm, setOpenEditSoftskillsForm] = useState(false);
  const [openCreateExpertiseForm, setOpenCreateExpertiseForm] = useState(false);
  const [openEditExpertiseForm, setOpenEditExpertiseForm] = useState(false);

  const [jobSeekerDetails, setJobseekerDetails] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [experienceDetails, setExperienceDetails] = useState([]);
  const [educationDetails, setEducationDetails] = useState([]);
  const [certificationDetails, setCertificationDetails] = useState([]);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // fetch functions
  useEffect(() => {
    if (session?.user?.email) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          console.log(session.user.id);
          const jobSeekerResponse = await fetch(
            `/api/jobseekerdetails/get?userId=${session.user.id}`
          );
          if (!jobSeekerResponse.ok)
            throw new Error("Failed to fetch job seeker");
          const jobSeekerData = await jobSeekerResponse.json();
          console.log("test", jobSeekerData.jobseeker);

          setJobseekerDetails(jobSeekerData.jobseeker);

          const userResponse = await fetch(
            `/api/users/get?id=${session.user.id}`
          );
          if (!userResponse.ok) throw new Error("Failed to fetch user");
          const userData = await userResponse.json();

          setUserDetails(userData.user);

          const experienceResponse = await fetch(
            `/api/jobseekerdetails/experience/all?id=${jobSeekerData.jobseeker._id}`
          );
          if (!experienceResponse.ok)
            throw new Error("Failed to fetch experience details");
          const newExperienceData = await experienceResponse.json();

          setExperienceDetails(newExperienceData.experiences);

          const educationResponse = await fetch(
            `/api/jobseekerdetails/education/all?id=${jobSeekerData.jobseeker._id}`
          );
          if (!educationResponse.ok)
            throw new Error("Failed to fetch experience details");
          const educationeData = await educationResponse.json();

          setEducationDetails(educationeData.educations);

          const certificationResponse = await fetch(
            `/api/jobseekerdetails/certification/all?id=${jobSeekerData.jobseeker._id}`
          );
          if (!certificationResponse.ok)
            throw new Error("Failed to fetch experience details");
          const certificationData = await certificationResponse.json();

          setCertificationDetails(certificationData.licensesandcertifications);
        } catch (err) {
          setError(err.message);
          console.error("Fetch error:", err);
        } finally {
          setIsLoading(false);
        }
      };

      if (session.user.id) fetchData();
    }
  }, [session, session.user.id]);

  // image updae functions
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
      formData.append("email", jobSeekerDetails.email);

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
      setJobseekerDetails((prev) => ({
        ...prev,
        profileImage: data.imageUrl,
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
      formData.append("email", jobSeekerDetails.email);

      console.log("Starting image upload...");
      const response = await fetch("/api/jobseekerdetails/uploadCoverImage", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      console.log("Upload successful:", data);
      setJobseekerDetails((prev) => ({
        ...prev,
        coverImage: data.imageUrl,
      }));

      alert("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image: ${error.message}`);
    }
  };

  // profile personal info update functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobseekerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const jobseekerUpdateSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update userDetails
      const userResponse = await fetch(`/api/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      // Update jobSeekerDetails
      const jobSeekerResponse = await fetch(`/api/jobseekerdetails/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobSeekerDetails),
      });

      // Check if both updates were successful
      if (userResponse.ok && jobSeekerResponse.ok) {
        alert("Details updated successfully!");
        setProfileEditForm(false); // Close the edit form if needed
      } else {
        alert("Failed to update details!");
      }
    } catch (error) {
      console.error("Error updating details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate age
  useEffect(() => {
    if (jobSeekerDetails.dob) {
      const today = new Date();
      const birthDate = new Date(jobSeekerDetails.dob);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();

      // Adjust if the birthday hasn't occurred yet this year
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      // Update the age in the state
      handleInputChange({
        target: {
          name: "age",
          value: calculatedAge.toString(),
        },
      });
    }
  }, [jobSeekerDetails.dob]);

  // Create new experience
  const [newExperienceData, setNewExperienceData] = useState({
    position: "",
    companyName: "",
    description: "",
    country: "",
    city: "",
    startDate: "",
    endDate: "",
  });
  const handleCreateExperience = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/jobseekerdetails/experience/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobseekerId: jobSeekerDetails._id,
          ...newExperienceData,
        }),
      });

      if (!response.ok) throw new Error("Failed to add experience");

      const experienceResponse = await fetch(
        `/api/jobseekerdetails/experience/all?id=${jobSeekerDetails._id}`
      );
      const updatedExperienceData = await experienceResponse.json();
      setExperienceDetails(updatedExperienceData.experiences);

      setOpenCreateExperienceForm(false);
      setNewExperienceData({
        position: "",
        companyName: "",
        description: "",
        country: "",
        city: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Error adding experience:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleExperienceInputChange = (e) => {
    const { name, value } = e.target;
    setNewExperienceData((prev) => ({ ...prev, [name]: value }));
  };

  // Create new education
  const [newEducationData, setNewEducationData] = useState({
    educationName: "",
    location: "",
    startDate: "",
    endDate: "",
  });
  const handleCreateEducation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/jobseekerdetails/education/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobseekerId: jobSeekerDetails._id,
          ...newEducationData,
        }),
      });

      if (!response.ok) throw new Error("Failed to add education");

      const educationResponse = await fetch(
        `/api/jobseekerdetails/education/all?id=${jobSeekerDetails._id}`
      );
      const updatedEducationData = await educationResponse.json();
      setExperienceDetails(updatedEducationData.educations);

      setOpenCreateEducationoForm(false);
      setNewEducationData({
        educationName: "",
        location: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Error adding education:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    setNewEducationData((prev) => ({ ...prev, [name]: value }));
  };

  // Create new Certification
  const [newCertificationData, setNewCertificationData] = useState({
    certificateName: "",
    organizationName: "",
    receivedDate: "",
  });
  const handleCreateCertification = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/jobseekerdetails/certification/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobseekerId: jobSeekerDetails._id,
          ...newCertificationData,
        }),
      });

      if (!response.ok) throw new Error("Failed to add education");

      const certificationResponse = await fetch(
        `/api/jobseekerdetails/education/all?id=${jobSeekerDetails._id}`
      );
      const updatedCertificationData = await certificationResponse.json();
      setNewCertificationData(
        updatedCertificationData.licensesandcertifications
      );

      setOpenCreateCertificationForm(false);
      setNewCertificationData({
        certificateName: "",
        organizationName: "",
        receivedDate: "",
      });
    } catch (error) {
      console.error("Error adding education:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCertificationInputChange = (e) => {
    const { name, value } = e.target;
    setNewCertificationData((prev) => ({ ...prev, [name]: value }));
  };

  // Create soft skill
  const [newSoftSkill, setNewSoftSkill] = useState("");
  const handleAddSoftSkill = async (e) => {
    e.preventDefault();

    if (!newSoftSkill.trim()) {
      alert("Please enter a soft skill.");
      return;
    }

    try {
      setIsSubmitting(true);

      const updatedSoftSkills = [
        ...(jobSeekerDetails.softSkills || []),
        newSoftSkill,
      ];

      const updatedJobSeekerDetails = {
        ...jobSeekerDetails,
        softSkills: updatedSoftSkills,
      };

      const response = await fetch("/api/jobseekerdetails/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedJobSeekerDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to update soft skills.");
      }

      setJobseekerDetails(updatedJobSeekerDetails);
      setNewSoftSkill("");
      setOpenCreateSoftskillsForm(false);
    } catch (error) {
      console.error("Error adding soft skill:", error);
      alert(`Failed to add soft skill: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // delete soft skill
  const handleDeleteSoftSkill = async (skillToRemove) => {
    try {
      const updatedSoftSkills = jobSeekerDetails.softSkills.filter(
        (skill) => skill !== skillToRemove
      );

      const updatedJobSeekerDetails = {
        ...jobSeekerDetails,
        softSkills: updatedSoftSkills,
      };
      setJobseekerDetails(updatedJobSeekerDetails);

      const response = await fetch("/api/jobseekerdetails/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedJobSeekerDetails),
      });

      if (!response.ok) throw new Error("Failed to delete soft skill");
    } catch (error) {
      console.error("Error deleting soft skill:", error);
    }
  };

  // Create expertise
  const [newExpertise, setNewExpertise] = useState("");
  const handleAddExpertise = async (e) => {
    e.preventDefault();

    if (!newExpertise.trim()) {
      alert("Please enter an expertise");
      return;
    }

    try {
      setIsSubmitting(true);

      const updatedExpertise = [
        ...(jobSeekerDetails.professionalExpertise || []),
        newExpertise,
      ];

      const updatedJobSeekerDetails = {
        ...jobSeekerDetails,
        professionalExpertise: updatedExpertise,
      };

      const response = await fetch("/api/jobseekerdetails/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedJobSeekerDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to update expertise");
      }

      setJobseekerDetails(updatedJobSeekerDetails);
      setNewExpertise("");
      setOpenCreateExpertiseForm(false);
    } catch (error) {
      console.error("Error adding expertise", error);
      alert(`Failed to add expertise : ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // delete soft skill
  const handleDeleteExpertise = async (expertiseToRemove) => {
    try {
      const updatedExpertise = jobSeekerDetails.professionalExpertise.filter(
        (expertise) => expertise !== expertiseToRemove
      );

      const updatedJobSeekerDetails = {
        ...jobSeekerDetails,
        professionalExpertise: updatedExpertise,
      };
      setJobseekerDetails(updatedJobSeekerDetails);

      const response = await fetch("/api/jobseekerdetails/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedJobSeekerDetails),
      });

      if (!response.ok) throw new Error("Failed to delete expertise");
    } catch (error) {
      console.error("Error deleting expertise:", error);
    }
  };

  // loading
  if (isLoading) return <PortalLoading />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  // CV Details
  const cvData = {
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    email: jobSeekerDetails.email,
    headline: jobSeekerDetails.position,
    personalProfile: jobSeekerDetails.personalProfile,
    contactNumber: jobSeekerDetails.contactNumber,
    gender: jobSeekerDetails.gender,
    dob: jobSeekerDetails.dob,
    nationality: jobSeekerDetails.nationality,
    maritalStatus: jobSeekerDetails.maritalStatus,
    languages: jobSeekerDetails.languages,
    religion: jobSeekerDetails.religion,
    address: jobSeekerDetails.address,
    ethnicity: jobSeekerDetails.ethnicity,
    linkedin: jobSeekerDetails.linkedin,
    x: jobSeekerDetails.x,
    instagram: jobSeekerDetails.instagram,
    facebook: jobSeekerDetails.facebook,
    github: jobSeekerDetails.github,
    dribble: jobSeekerDetails.dribble,
    softSkills: jobSeekerDetails.softSkills,
    professionalExpertise: jobSeekerDetails.professionalExpertise,
    // ... other basic fields ...

    candidate_experience: experienceDetails,
    candidate_education: educationDetails,
    candidate_certifications: certificationDetails,
  };

  return (
    <div className="bg-white rounded-3xl py-7 px-7">
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-black text-base font-semibold">My Profile</p>
          <button
            onClick={() => GenerateCV(cvData)}
            className="px-6 py-3 bg-[#001571] text-white text-sm font-medium rounded-md"
          >
            Generate CV
          </button>
        </div>
        <div className="">
          {/* Background Image */}
          <div className="bg-red-300 relative w-full h-[300px] rounded-t-2xl overflow-hidden flex items-top justify-end">
            {jobSeekerDetails.coverImage ? (
              <Image
                src={jobSeekerDetails.coverImage}
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
                {jobSeekerDetails.profileImage ? (
                  <Image
                    src={jobSeekerDetails.profileImage}
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
              <a href={jobSeekerDetails.linkedin}>
                <FaLinkedin size={30} className="cursor-pointer" />
              </a>
              <a href={jobSeekerDetails.x}>
                <FaTwitter size={30} className="cursor-pointer" />
              </a>
              <a href={jobSeekerDetails.instagram}>
                <FaInstagram size={30} className="cursor-pointer" />
              </a>
              <a href={jobSeekerDetails.facebook}>
                <FaFacebook size={30} className="cursor-pointer" />
              </a>
              <a href={jobSeekerDetails.github}>
                <FaGithub size={30} className="cursor-pointer" />
              </a>
              <a href={jobSeekerDetails.dribbble}>
                <FaDribbble size={30} className="cursor-pointer" />
              </a>
            </div>
          </div>
        </div>

        {/* title */}
        <div className="pt-8 sm:pt-14">
          <h1 className="text-center sm:text-left text-2xl sm:text-4xl md:text-3xl font-bold text-black">
            {userDetails.firstName} {userDetails.lastName}
          </h1>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between space-y-4 sm:space-y-0 mt-0 text-sm w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start space-y-4 sm:space-y-0 space-x-0 sm:space-x-4">
              <div className="flex items-center">
                <p className="text-black font-semibold text-lg">
                  {jobSeekerDetails.position || "No position available"}
                </p>
              </div>
            </div>
            <div className="flex justify-center sm:justify-end w-full sm:w-auto sm:pt-2 z-0">
              <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-end shadow-md w-12 h-12 mt-3 mr-3 z-0">
                <button
                  onClick={() => setProfileEditForm(true)}
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

        {/* personal profile */}
        <div className="text-left space-y-4 mt-8">
          <h5 className="text-xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
            Personal Profile
          </h5>
          <p className="text-justify font-medium">
            {jobSeekerDetails.personalProfile ||
              "No personal profile available"}
          </p>
        </div>

        {/* bio data */}
        <div className="text-left space-y-4 mt-12">
          <div className="flex flex-row items-center justify-between">
            <h5 className="lg:text-xl md:text-xl sm:text-2xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
              Bio Data
            </h5>
            <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-end shadow-md w-12 h-12 mt-3 mr-3 z-0">
              <button
                onClick={() => setBioDataForm(true)}
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
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-base font-semibold">
            {/* First Column */}
            <div className="space-y-3">
              <div>Birthday - {jobSeekerDetails.dob}</div>
              <div>Nationality - {jobSeekerDetails.nationality}</div>
              <div>Languages - {jobSeekerDetails.languages}</div>
              <div> Address - {jobSeekerDetails.address}</div>
            </div>

            {/* Second Column */}
            <div className="space-y-3">
              <div>Age - {jobSeekerDetails.age}</div>
              <div>Marital Status - {jobSeekerDetails.maritalStatus}</div>
              <div>Religion - {jobSeekerDetails.religion}</div>
              <div>Ethnicity - {jobSeekerDetails.ethnicity}</div>
            </div>
          </div>
        </div>

        {/* experience */}
        <div className="text-left space-y-10 mt-12">
          <div className="flex flex-row items-center justify-between">
            <h5 className="flex flex-row items-center text-xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
              Experience
            </h5>
            <div className="flex flex-row items-center gap-2">
              <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                <button
                  onClick={() => setOpenEditExperienceForm(true)}
                  className="flex items-center justify-center rounded-md z-10"
                >
                  <div className="">
                    <GoPencil size={25} strokeWidth={1} color="#001571" />
                  </div>
                </button>
              </div>
              <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                <button
                  onClick={() => setOpenCreateExperienceForm(true)}
                  className="flex items-center justify-center rounded-md z-10"
                >
                  <div className="">
                    <FiPlus size={30} strokeWidth={2} color="#001571" />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {experienceDetails.length > 0 ? (
              experienceDetails.map((experience, index) => (
                <ExperienceCard key={index} experience={experience} />
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No experience data available.
              </p>
            )}
          </div>
        </div>

        {/* education */}
        <div className="text-left space-y-6 mt-12">
          <div className="flex flex-row items-center justify-between">
            <h5 className="text-xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
              Education
            </h5>
            <div className="flex flex-row items-center gap-2">
              <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                <button
                  onClick={() => setOpenEditEducationoForm(true)}
                  className="flex items-center justify-center rounded-md z-10"
                >
                  <div className="">
                    <GoPencil size={25} strokeWidth={1} color="#001571" />
                  </div>
                </button>
              </div>
              <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                <button
                  onClick={() => setOpenCreateEducationoForm(true)}
                  className="flex items-center justify-center rounded-md z-10"
                >
                  <div className="">
                    <FiPlus size={30} strokeWidth={2} color="#001571" />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {educationDetails.length > 0 ? (
              educationDetails.map((education, index) => (
                <EducationCard key={index} education={education} />
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No education data available.
              </p>
            )}
          </div>
        </div>

        {/* certifications */}
        <div className="text-left space-y-6 mt-12">
          <div className="flex flex-row items-center justify-between">
            <h5 className="text-xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
              Certification
            </h5>
            <div className="flex flex-row items-center gap-2">
              <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                <button
                  onClick={() => setOpenEditCertificationForm(true)}
                  className="flex items-center justify-center rounded-md z-10"
                >
                  <div className="">
                    <GoPencil size={25} strokeWidth={1} color="#001571" />
                  </div>
                </button>
              </div>
              <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                <button
                  onClick={() => setOpenCreateCertificationForm(true)}
                  className="flex items-center justify-center rounded-md z-10"
                >
                  <div className="">
                    <FiPlus size={30} strokeWidth={2} color="#001571" />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {certificationDetails.length > 0 ? (
              certificationDetails.map((certification, index) => (
                <CertificationCard key={index} certification={certification} />
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No education data available.
              </p>
            )}
          </div>
        </div>

        {/* soft skills */}
        <div className="text-left space-y-4 mt-12">
          <div className="flex flex-row items-center justify-between">
            <h5 className="text-xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
              Soft Skills
            </h5>
            <div className="flex flex-row items-center gap-2">
              <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                <button
                  onClick={() => setOpenEditSoftskillsForm(true)}
                  className="flex items-center justify-center rounded-md z-10"
                >
                  <div className="">
                    <GoPencil size={25} strokeWidth={1} color="#001571" />
                  </div>
                </button>
              </div>
              <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                <button
                  onClick={() => setOpenCreateSoftskillsForm(true)}
                  className="flex items-center justify-center rounded-md z-10"
                >
                  <div className="">
                    <FiPlus size={30} strokeWidth={2} color="#001571" />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {jobSeekerDetails.softSkills?.map((skills, index) => (
              <SoftSkillsCard key={index} skills={skills} />
            )) ?? (
              <p className="text-gray-500 text-sm">
                No soft skills data available.
              </p>
            )}
          </div>
        </div>

        {/* expertise */}
        <div className="text-left space-y-4 mt-12">
          <div className="flex flex-row items-center justify-between">
            <h5 className="text-xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
              Professional Expertise
            </h5>
            <div className="flex flex-row items-center gap-2">
              <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                <button
                  onClick={() => setOpenEditExpertiseForm(true)}
                  className="flex items-center justify-center rounded-md z-10"
                >
                  <div className="">
                    <GoPencil size={25} strokeWidth={1} color="#001571" />
                  </div>
                </button>
              </div>
              <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                <button
                  onClick={() => setOpenCreateExpertiseForm(true)}
                  className="flex items-center justify-center rounded-md z-10"
                >
                  <div className="">
                    <FiPlus size={30} strokeWidth={2} color="#001571" />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {jobSeekerDetails.professionalExpertise?.map((expertise, index) => (
              <ExpertiseCard key={index} expertise={expertise} />
            )) ?? (
              <p className="text-gray-500 text-sm">
                No professional expertise data available.
              </p>
            )}
          </div>
        </div>

        {/* Edit Profile Form Popup */}
        {ProfileEditForm && (
          <ProfileEditFormPopup
            userDetails={userDetails}
            jobSeekerDetails={jobSeekerDetails}
            handleInputChange={handleInputChange}
            handleUserInputChange={handleUserInputChange}
            jobseekerUpdateSubmitHandler={jobseekerUpdateSubmitHandler}
            isSubmitting={isSubmitting}
            onClose={() => setProfileEditForm(false)}
          />
        )}

        {/* Edit Bio Data Form Popup */}
        {BioDataForm && (
          <BioEditFormPopup
            jobSeekerDetails={jobSeekerDetails}
            handleInputChange={handleInputChange}
            jobseekerUpdateSubmitHandler={jobseekerUpdateSubmitHandler}
            isSubmitting={isSubmitting}
            onClose={() => setBioDataForm(false)}
          />
        )}

        {/* Add Experience Form Popup */}
        {openCreateExperienceForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {/* Popup Container */}
            <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h4 className="text-2xl font-semibold text-[#001571]">
                  Add Experience Details
                </h4>
                <button
                  onClick={() => setOpenCreateExperienceForm(false)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <form onSubmit={handleCreateExperience} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={newExperienceData.position}
                      onChange={handleExperienceInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={newExperienceData.companyName}
                      onChange={handleExperienceInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Description
                    </label>
                    <textarea
                      type="text"
                      name="description"
                      value={newExperienceData.description}
                      onChange={handleExperienceInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#001571]">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={newExperienceData.country}
                        onChange={handleExperienceInputChange}
                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#001571]">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={newExperienceData.city}
                        onChange={handleExperienceInputChange}
                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#001571]">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={newExperienceData.startDate}
                        onChange={handleExperienceInputChange}
                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#001571]">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={newExperienceData.endDate}
                        onChange={handleExperienceInputChange}
                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  onClick={handleCreateExperience}
                  disabled={isSubmitting}
                  className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${
                    isSubmitting
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

        {/* Add Education Form Popup */}
        {openCreateEducationForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {/* Popup Container */}
            <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h4 className="text-2xl font-semibold text-[#001571]">
                  Add Education Details
                </h4>
                <button
                  onClick={() => setOpenCreateEducationoForm(false)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <form onSubmit={handleCreateEducation} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Education Qualification
                    </label>
                    <input
                      type="text"
                      name="educationName"
                      placeholder="O/L, A/L or degree name..."
                      value={newEducationData.educationName}
                      onChange={handleEducationInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Organization
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Name and location..."
                      value={newEducationData.location}
                      onChange={handleEducationInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#001571]">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={newEducationData.startDate}
                        onChange={handleEducationInputChange}
                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#001571]">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={newEducationData.endDate}
                        onChange={handleEducationInputChange}
                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  onClick={handleCreateEducation}
                  disabled={isSubmitting}
                  className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${
                    isSubmitting
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

        {/* Add Certification Form Popup */}
        {openCreateCertificationForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {/* Popup Container */}
            <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h4 className="text-2xl font-semibold text-[#001571]">
                  Add Licenses & Certification Details
                </h4>
                <button
                  onClick={() => setOpenCreateCertificationForm(false)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <form
                  onSubmit={handleCreateCertification}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      License Or Certification Name
                    </label>
                    <input
                      type="text"
                      name="certificateName"
                      value={newCertificationData.certificateName}
                      onChange={handleCertificationInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      value={newCertificationData.organizationName}
                      onChange={handleCertificationInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Received Date
                    </label>
                    <input
                      type="date"
                      name="receivedDate"
                      value={newCertificationData.receivedDate}
                      onChange={handleCertificationInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    />
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  onClick={handleCreateCertification}
                  disabled={isSubmitting}
                  className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${
                    isSubmitting
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

        {/* Add Soft Skills Form Popup */}
        {openCreateSoftskillsForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {/* Popup Container */}
            <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h4 className="text-2xl font-semibold text-[#001571]">
                  Add Soft Skills
                </h4>
                <button
                  onClick={() => setOpenCreateSoftskillsForm(false)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <form onSubmit={handleAddSoftSkill} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Soft Skills
                    </label>
                    <input
                      type="text"
                      name="softSkill"
                      value={newSoftSkill}
                      onChange={(e) => setNewSoftSkill(e.target.value)}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      placeholder="Enter a soft skill (e.g., Communication, Teamwork)"
                    />
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  onClick={handleAddSoftSkill}
                  disabled={isSubmitting}
                  className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${
                    isSubmitting
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

        {/* Add Expertise Form Popup */}
        {openCreateExpertiseForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            {/* Popup Container */}
            <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h4 className="text-2xl font-semibold text-[#001571]">
                  Add Professional Expertise
                </h4>
                <button
                  onClick={() => setOpenCreateExpertiseForm(false)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <form onSubmit={handleAddExpertise} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#001571]">
                      Professional Expertise
                    </label>
                    <input
                      type="text"
                      name="professionalExpertise"
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    />
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  type="submit"
                  onClick={handleAddExpertise}
                  disabled={isSubmitting}
                  className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${
                    isSubmitting
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

        {/* Edit Experience Popup */}
        {openEditxperienceForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 pb-0">
                <h4 className="text-lg font-semibold text-[#001571]">
                  Edit Experience Details
                </h4>
                <button
                  onClick={() => setOpenEditExperienceForm(false)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                {experienceDetails.length > 0 ? (
                  experienceDetails.map((experience, index) => (
                    <ExperienceCardEdit key={index} experience={experience} />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No experience data available.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Education Popup */}
        {openEditEducationForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 pb-0">
                <h4 className="text-lg font-semibold text-[#001571]">
                  Edit Education Details
                </h4>
                <button
                  onClick={() => setOpenEditEducationoForm(false)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                {educationDetails.length > 0 ? (
                  educationDetails.map((education, index) => (
                    <EducationCardEdit key={index} education={education} />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No education data available.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Certification Popup */}
        {openEditCertificationForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 pb-0">
                <h4 className="text-lg font-semibold text-[#001571]">
                  Edit Certification Details
                </h4>
                <button
                  onClick={() => setOpenEditCertificationForm(false)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                {certificationDetails.length > 0 ? (
                  certificationDetails.map((certification, index) => (
                    <CertificationCardEdit
                      key={index}
                      certification={certification}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    No certification data available.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Softskills Popup */}
        {openEditSoftskillsForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 pb-0">
                <h4 className="text-lg font-semibold text-[#001571]">
                  Edit Soft Skills Details
                </h4>
                <button
                  onClick={() => setOpenEditSoftskillsForm(false)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <div className="p-6 flex flex-wrap gap-4">
                {jobSeekerDetails.softSkills?.map((skill, index) => (
                  <SoftSkillsCardEdit
                    key={index}
                    skill={skill}
                    onDelete={() => handleDeleteSoftSkill(skill)}
                  />
                )) ?? (
                  <p className="text-gray-500 text-sm">
                    No soft skills data available.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Expertise Popup */}
        {openEditExpertiseForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 pb-0">
                <h4 className="text-lg font-semibold text-[#001571]">
                  Edit Professional Expertise Details
                </h4>
                <button
                  onClick={() => setOpenEditExpertiseForm(false)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <div className="p-6 flex flex-wrap gap-4">
                {jobSeekerDetails.professionalExpertise?.map(
                  (expertise, index) => (
                    <ExpertiseCardEdit
                      key={index}
                      expertise={expertise}
                      onDelete={() => handleDeleteExpertise(expertise)}
                    />
                  )
                ) ?? (
                  <p className="text-gray-500 text-sm">
                    No professional expertise data available.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
