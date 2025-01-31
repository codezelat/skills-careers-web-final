"use client"

import { useState, useEffect } from "react";
import PortalLoading from "@/app/Portal/loading";
import { FaDribbble, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaMedal, FaTimes, FaTwitter } from "react-icons/fa";
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


export default function CandidateProfile() {

    const [activeTab, setActiveTab] = useState("Profile");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const { data: session, status } = useSession();

    const [ProfileEditForm, setProfileEditForm] = useState(false);
    const [BioDataForm, setBioDataForm] = useState(false);
    const [openCreateExperienceForm, setOpenCreateExperienceForm] = useState(false);
    const [openCreateEducationForm, setOpenCreateEducationoForm] = useState(false);
    const [openCreateCertificationForm, setOpenCreateCertificationForm] = useState(false);
    const [openCreateSoftskillsForm, setOpenCreateSoftskillsForm] = useState(false);
    const [openCreateExpertiseForm, setOpenCreateExpertiseForm] = useState(false);

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
                    console.log(session.user.id)
                    const jobSeekerResponse = await fetch(`/api/jobseekerdetails/get?userId=${session.user.id}`);
                    if (!jobSeekerResponse.ok) throw new Error("Failed to fetch job seeker");
                    const jobSeekerData = await jobSeekerResponse.json();
                    console.log("test", jobSeekerData.jobseeker)

                    setJobseekerDetails(jobSeekerData.jobseeker);

                    const userResponse = await fetch(`/api/users/get?id=${session.user.id}`);
                    if (!userResponse.ok) throw new Error("Failed to fetch user");
                    const userData = await userResponse.json();

                    setUserDetails(userData.user);

                    const experienceResponse = await fetch(`/api/jobseekerdetails/experience/all?id=${jobSeekerData.jobseeker._id}`);
                    if (!experienceResponse.ok) throw new Error("Failed to fetch experience details");
                    const newExperienceData = await experienceResponse.json();

                    setExperienceDetails(newExperienceData.experiences);

                    const educationResponse = await fetch(`/api/jobseekerdetails/education/all?id=${jobSeekerData.jobseeker._id}`);
                    if (!educationResponse.ok) throw new Error("Failed to fetch experience details");
                    const educationeData = await educationResponse.json();

                    setEducationDetails(educationeData.educations);

                    const certificationResponse = await fetch(`/api/jobseekerdetails/certification/all?id=${jobSeekerData.jobseeker._id}`);
                    if (!certificationResponse.ok) throw new Error("Failed to fetch experience details");
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

        // Update userDetails for firstName/lastName fields
        if (name === "firstName" || name === "lastName") {
            setUserDetails((prev) => ({ ...prev, [name]: value }));
        }
        // Update jobSeekerDetails for all other fields
        else {
            setJobseekerDetails((prev) => ({ ...prev, [name]: value }));
        }
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
            const response = await fetch('/api/jobseekerdetails/experience/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobseekerId: jobSeekerDetails._id,
                    ...newExperienceData
                }),
            });

            if (!response.ok) throw new Error('Failed to add experience');

            const experienceResponse = await fetch(`/api/jobseekerdetails/experience/all?id=${jobSeekerDetails._id}`);
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
            console.error('Error adding experience:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleExperienceInputChange = (e) => {
        const { name, value } = e.target;
        setNewExperienceData(prev => ({ ...prev, [name]: value }));
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
            const response = await fetch('/api/jobseekerdetails/education/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobseekerId: jobSeekerDetails._id,
                    ...newEducationData
                }),
            });

            if (!response.ok) throw new Error('Failed to add education');

            const educationResponse = await fetch(`/api/jobseekerdetails/education/all?id=${jobSeekerDetails._id}`);
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
            console.error('Error adding education:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleEducationInputChange = (e) => {
        const { name, value } = e.target;
        setNewEducationData(prev => ({ ...prev, [name]: value }));
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
            const response = await fetch('/api/jobseekerdetails/certification/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobseekerId: jobSeekerDetails._id,
                    ...newCertificationData
                }),
            });

            if (!response.ok) throw new Error('Failed to add education');

            const certificationResponse = await fetch(`/api/jobseekerdetails/education/all?id=${jobSeekerDetails._id}`);
            const updatedCertificationData = await certificationResponse.json();
            setNewCertificationData(updatedCertificationData.licensesandcertifications);

            setOpenCreateCertificationForm(false);
            setNewCertificationData({
                certificateName: "",
                organizationName: "",
                receivedDate: "",
            });

        } catch (error) {
            console.error('Error adding education:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleCertificationInputChange = (e) => {
        const { name, value } = e.target;
        setNewCertificationData(prev => ({ ...prev, [name]: value }));
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

            const updatedSoftSkills = [...(jobSeekerDetails.softSkills || []), newSoftSkill];

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

            const updatedExpertise = [...(jobSeekerDetails.professionalExpertise || []), newExpertise];

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

    // loading
    if (isLoading) return <PortalLoading />;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white rounded-3xl py-7 px-7">
            <div className="min-h-screen">

            </div>
        </div>
    );
}
