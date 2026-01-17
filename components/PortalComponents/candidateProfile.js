"use client";

import { useState, useEffect } from "react";
import PortalLoading from "@/app/Portal/loading";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaMedal,
  FaTimes,
  FaTwitter,
  FaGlobe,
} from "react-icons/fa";
import Image from "next/image";
import { PiCheckCircle } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import ExperienceCard from "@/components/PortalComponents/experienceCard";
import EducationCard from "@/components/PortalComponents/educationCard";
import CertificationCard from "@/components/PortalComponents/certificationCard";
import ProfileEditFormPopup from "@/app/Portal/candidates/ProfileEditForm";
import BioEditFormPopup from "@/app/Portal/candidates/BioDataForm";
import { FiPlus, FiInfo } from "react-icons/fi";
import { GoPencil } from "react-icons/go";
import ExperienceCardEdit from "./experienceCardEdit";
import EducationCardEdit from "./educationCardEdit";
import CertificationCardEdit from "./certificationCardEdit";
import SoftSkillsCard from "./softskillsCard";
import SoftSkillsCardEdit from "./softskillsCardEdit";
import ExpertiseCard from "./expertiseCard";
import ExpertiseCardEdit from "./expertiseCardEdit";
import GenerateCV from "@/lib/GenerateCV";

// Sorting Helpers
const sortExperiences = (experiences) => {
  return experiences.sort((a, b) => {
    if (!a.endDate && b.endDate) return -1; // a is current, b is not
    if (a.endDate && !b.endDate) return 1; // b is current, a is not
    return new Date(b.startDate) - new Date(a.startDate); // both current or both past
  });
};

const sortEducations = (educations) => {
  return educations.sort((a, b) => {
    if (!a.endDate && b.endDate) return -1;
    if (a.endDate && !b.endDate) return 1;
    return new Date(b.startDate) - new Date(a.startDate);
  });
};

const SOFT_SKILLS_LIST = [
  "Communication",
  "Active listening",
  "Critical thinking",
  "Analytical thinking",
  "Creative thinking",
  "Systems thinking",
  "Strategic thinking",
  "Problem-solving",
  "Decision-making",
  "Negotiation",
  "Persuasion",
  "Conflict management",
  "Empathy",
  "Emotional intelligence",
  "Self-awareness",
  "Resilience",
  "Adaptability",
  "Flexibility",
  "Agility",
  "Integrity",
  "Accountability",
  "Dependability",
  "Attention to detail",
  "Time management",
  "Task prioritization",
  "Organization and planning",
  "Leadership",
  "People management",
  "Delegation",
  "Coaching and mentoring",
  "Talent management",
  "Teamwork",
  "Collaboration",
  "Cooperation",
  "Coordination",
  "Relationship building",
  "Trust building",
  "Stakeholder management",
  "Client management",
  "Influencing others",
  "Leading change",
  "Initiative",
  "Lifelong learning",
  "Learning agility",
  "Motivation",
  "Stress tolerance",
  "Self-control",
  "Global citizenship",
  "Customer-focused mindset",
];

const EDUCATION_QUALIFICATIONS = [
  "GCE Ordinary Level",
  "GCE Advanced Level",
  "Diploma",
  "Higher Diploma (HND / ND)",
  "Bachelor’s Degree",
  "Professional Qualification",
  "Postgraduate Diploma",
  "Master’s Degree",
  "PhD / Doctorate",
  "Vocational/Apprenticeship",
  "Other",
];

const SRI_LANKA_DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Mullaitivu",
  "Vavuniya",
  "Puttalam",
  "Kurunegala",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
  "Trincomalee",
  "Batticaloa",
  "Ampara",
];

const sortCertifications = (certifications) => {
  return certifications.sort(
    (a, b) => new Date(b.receivedDate) - new Date(a.receivedDate),
  );
};

const formatAddress = (details) => {
  const { addressLine, district, province, country, location, address } =
    details;
  const parts = [];

  if (addressLine) parts.push(addressLine);

  if (country === "Sri Lanka" || !country) {
    if (district) parts.push(district);
    if (province && province !== district) parts.push(province);
    parts.push("Sri Lanka");
  } else {
    if (location) parts.push(location); // City for non-SL
    if (country) parts.push(country);
  }

  // Fallback to old address field if new fields don't exist
  const formatted = parts.filter(Boolean).join(", ");
  return formatted || address || "Address not specified";
};

export default function CandidateProfile() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { data: session, status, update } = useSession(); // Add update method

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
  const [showExpertiseInfoCreate, setShowExpertiseInfoCreate] = useState(false);
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

          let jobSeekerData = null;

          const jobSeekerResponse = await fetch(
            `/api/jobseekerdetails/get?userId=${session.user.id}`,
          );

          if (!jobSeekerResponse.ok) {
            // If jobseeker profile doesn't exist, create one
            if (jobSeekerResponse.status === 404) {
              console.log("Creating jobseeker profile for OAuth user...");
              const createResponse = await fetch("/api/jobseekerdetails", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: session.user.id,
                  email: session.user.email,
                  firstName: session.user.firstName,
                  lastName: session.user.lastName,
                  profileImage: session.user.profileImage,
                }),
              });

              if (createResponse.ok) {
                // Retry fetching after creation
                const retryResponse = await fetch(
                  `/api/jobseekerdetails/get?userId=${session.user.id}`,
                );
                if (retryResponse.ok) {
                  jobSeekerData = await retryResponse.json();
                  setJobseekerDetails(jobSeekerData.jobseeker);
                } else {
                  throw new Error("Failed to fetch job seeker after creation");
                }
              } else {
                throw new Error("Failed to create job seeker profile");
              }
            } else {
              throw new Error("Failed to fetch job seeker");
            }
          } else {
            jobSeekerData = await jobSeekerResponse.json();
            console.log("test", jobSeekerData.jobseeker);
            setJobseekerDetails(jobSeekerData.jobseeker);
          }

          const userResponse = await fetch(
            `/api/users/get?id=${session.user.id}`,
          );
          if (!userResponse.ok) throw new Error("Failed to fetch user");
          const userData = await userResponse.json();

          // Set userDetails with contactNumber from jobseeker data
          setUserDetails({
            ...userData.user,
            contactNumber: jobSeekerData?.jobseeker?.contactNumber || "",
          });

          const experienceResponse = await fetch(
            `/api/jobseekerdetails/experience/all?id=${jobSeekerData.jobseeker._id}`,
          );
          if (!experienceResponse.ok)
            throw new Error("Failed to fetch experience details");
          const newExperienceData = await experienceResponse.json();

          // Sort experiences: Current (no endDate) first, then by startDate descending
          const sortedExperiences = sortExperiences(
            newExperienceData.experiences,
          );
          setExperienceDetails(sortedExperiences);

          const educationResponse = await fetch(
            `/api/jobseekerdetails/education/all?id=${jobSeekerData.jobseeker._id}`,
          );
          if (!educationResponse.ok)
            throw new Error("Failed to fetch experience details");
          const educationeData = await educationResponse.json();

          // Sort education: Current (no endDate) first, then by startDate descending
          const sortedEducation = sortEducations(educationeData.educations);
          setEducationDetails(sortedEducation);

          const certificationResponse = await fetch(
            `/api/jobseekerdetails/certification/all?id=${jobSeekerData.jobseeker._id}`,
          );
          if (!certificationResponse.ok)
            throw new Error("Failed to fetch experience details");
          const certificationData = await certificationResponse.json();

          // Sort certifications by receivedDate descending (latest first)
          const sortedCertifications = sortCertifications(
            certificationData.licensesandcertifications,
          );
          setCertificationDetails(sortedCertifications);
        } catch (err) {
          setError(err.message);
          console.error("Fetch error:", err);
        } finally {
          setIsLoading(false);
        }
      };

      if (session?.user?.id) fetchData();
    }
  }, [
    session?.user?.id,
    session?.user?.email,
    session?.user?.firstName,
    session?.user?.lastName,
    session?.user?.profileImage,
  ]);

  // image updae functions
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
      setIsProfileUploading(true);
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

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Profile image uploaded successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      // Update session with new image
      await update({
        ...session,
        user: {
          ...session?.user,
          profileImage: data.imageUrl,
        },
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
    } finally {
      setIsProfileUploading(false);
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
      setIsCoverUploading(true);
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
    } finally {
      setIsCoverUploading(false);
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
      // Update userDetails (firstName, lastName only - contactNumber goes to jobseeker)
      const userResponse = await fetch(`/api/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userDetails.email || jobSeekerDetails.email,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
        }),
      });

      // Update jobSeekerDetails including contactNumber
      const jobSeekerResponse = await fetch(`/api/jobseekerdetails/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...jobSeekerDetails,
          contactNumber: userDetails.contactNumber, // Get contactNumber from userDetails state
        }),
      });

      // Check if both updates were successful
      if (userResponse.ok && jobSeekerResponse.ok) {
        // Update local state to reflect the changes
        setJobseekerDetails((prev) => ({
          ...prev,
          contactNumber: userDetails.contactNumber,
        }));

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Details updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        setProfileEditForm(false); // Close the edit form if needed
        setBioDataForm(false); // Close the bio data form if needed
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update details!",
        });
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
        `/api/jobseekerdetails/experience/all?id=${jobSeekerDetails._id}`,
      );
      const updatedExperienceData = await experienceResponse.json();
      setExperienceDetails(sortExperiences(updatedExperienceData.experiences));

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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error: ${error.message}`,
      });
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
  const [isOtherEducation, setIsOtherEducation] = useState(false);

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
        `/api/jobseekerdetails/education/all?id=${jobSeekerDetails._id}`,
      );
      const updatedEducationData = await educationResponse.json();
      setEducationDetails(sortEducations(updatedEducationData.educations));

      setOpenCreateEducationoForm(false);
      setNewEducationData({
        educationName: "",
        location: "",
        startDate: "",
        endDate: "",
      });
      setIsOtherEducation(false);
    } catch (error) {
      console.error("Error adding education:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "educationQualificationSelect") {
      if (value === "Other") {
        setIsOtherEducation(true);
        setNewEducationData((prev) => ({ ...prev, educationName: "" }));
      } else {
        setIsOtherEducation(false);
        setNewEducationData((prev) => ({ ...prev, educationName: value }));
      }
    } else {
      setNewEducationData((prev) => ({ ...prev, [name]: value }));
    }
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
        `/api/jobseekerdetails/certification/all?id=${jobSeekerDetails._id}`,
      );
      const updatedCertificationData = await certificationResponse.json();
      setCertificationDetails(
        sortCertifications(updatedCertificationData.licensesandcertifications),
      );

      setOpenCreateCertificationForm(false);
      setNewCertificationData({
        certificateName: "",
        organizationName: "",
        receivedDate: "",
      });
    } catch (error) {
      console.error("Error adding certification:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error: ${error.message}`,
      });
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
  const [softSkillSuggestions, setSoftSkillSuggestions] = useState([]);
  const [showSoftSkillSuggestions, setShowSoftSkillSuggestions] =
    useState(false);

  const handleSoftSkillInputChange = (e) => {
    const value = e.target.value;
    setNewSoftSkill(value);

    if (value.trim()) {
      const filtered = SOFT_SKILLS_LIST.filter(
        (skill) =>
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !jobSeekerDetails.softSkills?.includes(skill),
      );
      setSoftSkillSuggestions(filtered);
      setShowSoftSkillSuggestions(true);
    } else {
      setSoftSkillSuggestions([]);
      setShowSoftSkillSuggestions(false);
    }
  };

  const selectSoftSkillRequest = (skill) => {
    setNewSoftSkill(skill);
    setShowSoftSkillSuggestions(false);
  };

  const handleAddSoftSkill = async (e) => {
    e.preventDefault();

    if (!newSoftSkill.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please enter a soft skill.",
      });
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to add soft skill: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // delete soft skill
  const handleDeleteSoftSkill = async (skillToRemove) => {
    try {
      const updatedSoftSkills = jobSeekerDetails.softSkills.filter(
        (skill) => skill !== skillToRemove,
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
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please enter an expertise",
      });
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to add expertise : ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // delete soft skill
  const handleDeleteExpertise = async (expertiseToRemove) => {
    try {
      const updatedExpertise = jobSeekerDetails.professionalExpertise.filter(
        (expertise) => expertise !== expertiseToRemove,
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

  // update soft skill
  const handleUpdateSoftSkill = async (oldSkill, newSkill) => {
    try {
      const updatedSoftSkills = jobSeekerDetails.softSkills.map((skill) =>
        skill === oldSkill ? newSkill : skill,
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

      if (!response.ok) throw new Error("Failed to update soft skill");
    } catch (error) {
      console.error("Error updating soft skill:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update soft skill",
      });
    }
  };

  // update expertise
  const handleUpdateExpertise = async (oldExpertise, newExpertise) => {
    try {
      const updatedExpertise = jobSeekerDetails.professionalExpertise.map(
        (exp) => (exp === oldExpertise ? newExpertise : exp),
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

      if (!response.ok) throw new Error("Failed to update expertise");
    } catch (error) {
      console.error("Error updating expertise:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update expertise",
      });
    }
  };

  // update experience
  const handleUpdateExperience = (updatedExperience) => {
    setExperienceDetails((prev) =>
      sortExperiences(
        prev.map((exp) =>
          exp._id === updatedExperience._id ? updatedExperience : exp,
        ),
      ),
    );
  };

  // delete experience
  const handleDeleteExperience = (experienceId) => {
    setExperienceDetails((prev) =>
      sortExperiences(prev.filter((exp) => exp._id !== experienceId)),
    );
  };

  // update education
  const handleUpdateEducation = (updatedEducation) => {
    setEducationDetails((prev) =>
      sortEducations(
        prev.map((edu) =>
          edu._id === updatedEducation._id ? updatedEducation : edu,
        ),
      ),
    );
  };

  // delete education
  const handleDeleteEducation = (educationId) => {
    setEducationDetails((prev) =>
      sortEducations(prev.filter((edu) => edu._id !== educationId)),
    );
  };

  // update certification
  const handleUpdateCertification = (updatedCertification) => {
    setCertificationDetails((prev) =>
      sortCertifications(
        prev.map((cert) =>
          cert._id === updatedCertification._id ? updatedCertification : cert,
        ),
      ),
    );
  };

  // delete certification
  const handleDeleteCertification = (certificationId) => {
    setCertificationDetails((prev) =>
      sortCertifications(prev.filter((cert) => cert._id !== certificationId)),
    );
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
    address: formatAddress(jobSeekerDetails),
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
            {isCoverUploading && (
              <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center">
                <div className="text-white font-semibold flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                  Uploading Cover...
                </div>
              </div>
            )}
            {jobSeekerDetails.coverImage ? (
              <Image
                src={jobSeekerDetails.coverImage}
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
                {isProfileUploading && (
                  <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center">
                    <div className="text-white text-xs font-semibold flex flex-col items-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-1"></div>
                      Uploading...
                    </div>
                  </div>
                )}
                {jobSeekerDetails.profileImage ? (
                  <Image
                    src={jobSeekerDetails.profileImage}
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
              {jobSeekerDetails.linkedin && (
                <a
                  href={jobSeekerDetails.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin
                    size={24}
                    className="cursor-pointer hover:text-blue-700"
                  />
                </a>
              )}
              {jobSeekerDetails.x && (
                <a
                  href={jobSeekerDetails.x}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter
                    size={24}
                    className="cursor-pointer hover:text-blue-700"
                  />
                </a>
              )}
              {jobSeekerDetails.instagram && (
                <a
                  href={jobSeekerDetails.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram
                    size={24}
                    className="cursor-pointer hover:text-blue-700"
                  />
                </a>
              )}
              {jobSeekerDetails.facebook && (
                <a
                  href={jobSeekerDetails.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook
                    size={24}
                    className="cursor-pointer hover:text-blue-700"
                  />
                </a>
              )}
              {jobSeekerDetails.github && (
                <a
                  href={jobSeekerDetails.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub
                    size={30}
                    className="cursor-pointer hover:text-blue-700"
                  />
                </a>
              )}
              {jobSeekerDetails.dribbble && (
                <a
                  href={jobSeekerDetails.dribbble}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGlobe
                    size={24}
                    className="cursor-pointer hover:text-blue-700"
                  />
                </a>
              )}
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

        {/* Preferred Job Types */}
        {jobSeekerDetails.preferredJobTypes &&
          jobSeekerDetails.preferredJobTypes.length > 0 && (
            <div className="text-left space-y-4 mt-8">
              <h5 className="text-xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
                Preferred Job Types
              </h5>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {jobSeekerDetails.preferredJobTypes.map((type, index) => (
                  <span
                    key={index}
                    className="bg-[#001571] text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-base font-semibold">
            {/* First Column */}
            <div className="space-y-3">
              <div>Birthday - {jobSeekerDetails.dob}</div>
              <div>Nationality - {jobSeekerDetails.nationality}</div>
              <div>Languages - {jobSeekerDetails.languages}</div>
              <div>Address - {formatAddress(jobSeekerDetails)}</div>
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            {/* Popup Container */}
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
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
                      <select
                        name="country"
                        value={newExperienceData.country}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewExperienceData((prev) => ({
                            ...prev,
                            country: val,
                            city: val === "Sri Lanka" ? "" : prev.city, // Reset city if switching to Sri Lanka to force selection
                          }));
                        }}
                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      >
                        <option value="" disabled>
                          Select Country
                        </option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="International">International</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#001571]">
                        City
                      </label>
                      {newExperienceData.country === "Sri Lanka" ? (
                        <select
                          name="city"
                          value={newExperienceData.city}
                          onChange={handleExperienceInputChange}
                          className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                        >
                          <option value="" disabled>
                            Select District
                          </option>
                          {SRI_LANKA_DISTRICTS.map((district, index) => (
                            <option key={index} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="city"
                          placeholder={
                            newExperienceData.country === "International"
                              ? "Enter city..."
                              : "Select country first"
                          }
                          value={newExperienceData.city}
                          onChange={handleExperienceInputChange}
                          disabled={!newExperienceData.country}
                          className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                        />
                      )}
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            {/* Popup Container */}
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
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
                    <select
                      name="educationQualificationSelect"
                      value={
                        isOtherEducation
                          ? "Other"
                          : EDUCATION_QUALIFICATIONS.includes(
                                newEducationData.educationName,
                              )
                            ? newEducationData.educationName
                            : ""
                      }
                      onChange={handleEducationInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                    >
                      <option value="" disabled>
                        Select Qualification
                      </option>
                      {EDUCATION_QUALIFICATIONS.map((qual, index) => (
                        <option key={index} value={qual}>
                          {qual}
                        </option>
                      ))}
                    </select>
                    {isOtherEducation && (
                      <input
                        type="text"
                        name="educationName"
                        placeholder="Enter your qualification..."
                        value={newEducationData.educationName}
                        onChange={handleEducationInputChange}
                        className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      />
                    )}
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            {/* Popup Container */}
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            {/* Popup Container */}
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
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
                  <div className="relative">
                    <label className="block text-sm font-semibold text-[#001571]">
                      Soft Skills
                    </label>
                    <input
                      type="text"
                      name="softSkill"
                      value={newSoftSkill}
                      onChange={handleSoftSkillInputChange}
                      className="mt-2 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                      placeholder="Enter a soft skill (e.g., Communication, Teamwork)"
                    />
                    {showSoftSkillSuggestions &&
                      softSkillSuggestions.length > 0 && (
                        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                          {softSkillSuggestions.map((skill, index) => (
                            <li
                              key={index}
                              onClick={() => selectSoftSkillRequest(skill)}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                            >
                              {skill}
                            </li>
                          ))}
                        </ul>
                      )}
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            {/* Popup Container */}
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
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
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <label className="block text-sm font-semibold text-[#001571]">
                        Professional Expertise
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setShowExpertiseInfoCreate(!showExpertiseInfoCreate)
                        }
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiInfo size={18} />
                      </button>
                    </div>
                    {showExpertiseInfoCreate && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900 relative">
                        <button
                          type="button"
                          onClick={() => setShowExpertiseInfoCreate(false)}
                          className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
                        >
                          <FaTimes size={14} />
                        </button>
                        <p className="font-semibold mb-1">
                          Your job/technical skills
                        </p>
                        <p className="text-xs">
                          Example: Java, SQL, Accounting, Project Management
                        </p>
                      </div>
                    )}
                    <input
                      type="text"
                      name="professionalExpertise"
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      onFocus={() => setShowExpertiseInfoCreate(true)}
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
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
                    <ExperienceCardEdit
                      key={index}
                      experience={experience}
                      onDelete={handleDeleteExperience}
                      onUpdate={handleUpdateExperience}
                    />
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
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
                    <EducationCardEdit
                      key={index}
                      education={education}
                      onDelete={handleDeleteEducation}
                      onUpdate={handleUpdateEducation}
                    />
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
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
                      onDelete={handleDeleteCertification}
                      onUpdate={handleUpdateCertification}
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
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
                    onUpdate={handleUpdateSoftSkill}
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
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
                      onUpdate={handleUpdateExpertise}
                    />
                  ),
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
