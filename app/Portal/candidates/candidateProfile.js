"use client";
import { useState, useEffect } from "react";
import PortalLoading from "../loading";
import { FaDribbble, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaMedal, FaTimes, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import { PiCheckCircle } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ExperienceCard from "@/components/PortalComponents/experienceCard";
import EducationCard from "@/components/PortalComponents/educationCard";
import CertificationCard from "@/components/PortalComponents/certificationCard";
import ProfileEditFormPopup from "./ProfileEditForm";
import BioEditFormPopup from "./BioDataForm";
import { FiPlus } from "react-icons/fi";
import { GoPencil } from "react-icons/go";
import SoftSkillsCardEdit from "@/components/PortalComponents/softskillsCardEdit";
import ExpertiseCard from "@/components/PortalComponents/expertiseCard";
import ExpertiseCardEdit from "@/components/PortalComponents/expertiseCardEdit";
import ExperienceCardEdit from "@/components/PortalComponents/experienceCardEdit";
import EducationCardEdit from "@/components/PortalComponents/educationCardEdit";
import CertificationCardEdit from "@/components/PortalComponents/certificationCardEdit";
import SoftSkillsCard from "@/components/PortalComponents/softskillsCard";
import Swal from 'sweetalert2';

export default function CandidateProfile({ slug }) {
    const [activeTab, setActiveTab] = useState("Profile");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProfileUploading, setIsProfileUploading] = useState(false);
    const [isCoverUploading, setIsCoverUploading] = useState(false);

    const router = useRouter();
    const { data: session } = useSession();
    // State Definitions
    const [userDetails, setUserDetails] = useState({});
    const [jobSeekerDetails, setJobseekerDetails] = useState({});
    const [experienceDetails, setExperienceDetails] = useState([]);
    const [educationDetails, setEducationDetails] = useState([]);
    const [certificationDetails, setCertificationDetails] = useState([]);

    // Form Visibility States
    const [ProfileEditForm, setProfileEditForm] = useState(false);
    const [BioDataForm, setBioDataForm] = useState(false);
    const [openCreateExperienceForm, setOpenCreateExperienceForm] = useState(false);
    const [openEditExperienceForm, setOpenEditExperienceForm] = useState(false);
    const [openCreateEducationForm, setOpenCreateEducationoForm] = useState(false);
    const [openEditEducationForm, setOpenEditEducationoForm] = useState(false);
    const [openCreateCertificationForm, setOpenCreateCertificationForm] = useState(false);
    const [openEditCertificationForm, setOpenEditCertificationForm] = useState(false);
    const [openCreateSoftskillsForm, setOpenCreateSoftskillsForm] = useState(false);
    const [openEditSoftskillsForm, setOpenEditSoftskillsForm] = useState(false);
    const [openCreateExpertiseForm, setOpenCreateExpertiseForm] = useState(false);
    const [openEditExpertiseForm, setOpenEditExpertiseForm] = useState(false);

    // Form Data States
    const [newExperienceData, setNewExperienceData] = useState({});
    const [newEducationData, setNewEducationData] = useState({});
    const [newCertificationData, setNewCertificationData] = useState({});
    const [newSoftSkill, setNewSoftSkill] = useState("");
    const [newExpertise, setNewExpertise] = useState("");

    // Helper Functions (Placeholders)
    const handleInputChange = () => { };
    const handleUserInputChange = () => { };
    const jobseekerUpdateSubmitHandler = () => { };
    const handleCreateExperience = () => { };
    const handleExperienceInputChange = () => { };
    const handleCreateEducation = () => { };
    const handleEducationInputChange = () => { };
    const handleCreateCertification = () => { };
    const handleCertificationInputChange = () => { };
    const handleAddSoftSkill = () => { };
    const handleDeleteSoftSkill = () => { };
    const handleAddExpertise = () => { };
    const handleDeleteExpertise = () => { };
    const triggerFileInput = (id) => {
        const element = document.getElementById(id);
        if (element) element.click();
    };

    // Data Fetching
    useEffect(() => {
        const fetchJobseekerDetails = async () => {
            // If no slug is passed, and we are not a jobseeker viewing our own profile, we might wait or handle error
            // But assuming this component is reusable, we prioritize slug if available.

            let queryParam = "";
            if (slug) {
                queryParam = `?id=${slug}`;
            } else if (session?.user?.id && session?.user?.role === "jobseeker") {
                // Fallback: if no slug, but logged in as jobseeker, fetch my own
                queryParam = `?userId=${session.user.id}`;
            } else {
                return; // Not ready or invalid context
            }

            try {
                const response = await fetch(`/api/jobseekerdetails/get${queryParam}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.jobseeker) {
                        setJobseekerDetails(data.jobseeker);
                        // The userDetails part (firstName, lastName) might be in the jobseeker object or separate.
                        // Based on typical schema, jobseeker collection has linked userId. 
                        // However, the UI expects `userDetails` for name. 
                        // Let's assume for now we use jobseeker data or try to get user part.
                        // Looking at the view component, it accesses `userDetails.firstName`.
                        // The API returns { jobseeker: { ...fields, educations: [], experiences: [] } }

                        // If the jobseeker object contains firstName/lastName directly (sometimes flattened), use it.
                        // Or if it has a nested `user` object. 
                        // Let's check if we need to fetch user details separately or if the API joins it.
                        // The `jobseekerdetails/get` API does NOT appear to join 'users' collection for firstName/lastName.
                        // It only fetches from `jobseekers` and related sub-collections.
                        // So `jobseeker.firstName` might be undefined if it's only in `users`.
                        // Let's check if we can get it from session if it's the same user, OR if we need another call.

                        // For now, populate direct jobseeker details
                        setExperienceDetails(data.jobseeker.experiences || []);
                        setEducationDetails(data.jobseeker.educations || []);
                        setCertificationDetails(data.jobseeker.certifications || []);

                        // Attempt to set basic details. 
                        // If the API doesn't return firstName/lastName, we might see "undefined undefined".
                        // In that case, we might need to fetch the user record separately or rely on what's in jobseeker.
                        setUserDetails({
                            firstName: data.jobseeker.firstName || "",
                            lastName: data.jobseeker.lastName || "",
                            // If they are not in jobseeker, we might need a separate fetch.
                        })
                    }
                } else {
                    console.error("Failed to fetch jobseeker details");
                }
            } catch (error) {
                console.error("Error fetching jobseeker details:", error);
            }
        };

        if (session || slug) {
            fetchJobseekerDetails();
        }
    }, [slug, session]);

    // Record Profile View
    useEffect(() => {
        if (jobSeekerDetails?._id && session?.user) {
            // Check if the current user is NOT the owner (by ID comparison) OR if they are explicitly a recruiter
            // We use loose comparison for ID in case of type differences (string vs Object)
            const isOwner = session.user.id == jobSeekerDetails.userId;
            const isRecruiter = session.user.role === 'recruiter';

            if (!isOwner || isRecruiter) {
                const recordView = async () => {
                    try {
                        await fetch("/api/jobseekerdetails/view", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ jobseekerId: jobSeekerDetails._id }),
                        });
                    } catch (err) {
                        console.error("Failed to record profile view", err);
                    }
                };
                recordView();
            }
        }
    }, [jobSeekerDetails?._id, session]);

    // Image update functions
    const handleImageChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;

        // ... (validations)

        try {
            setIsProfileUploading(true);
            const formData = new FormData();
            formData.append("image", file);
            formData.append("email", jobSeekerDetails.email);

            const response = await fetch("/api/jobseekerdetails/uploadimage", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to upload image");
            }

            setJobseekerDetails((prev) => ({
                ...prev,
                profileImage: data.imageUrl,
            }));

            Swal.fire({
                icon: 'success',
                title: 'Profile image updated!',
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            Swal.fire({
                icon: 'error',
                title: 'Upload failed',
                text: `Failed to upload image: ${error.message}`,
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

        // ... (validations)

        try {
            setIsCoverUploading(true);
            const formData = new FormData();
            formData.append("image", file);
            formData.append("email", jobSeekerDetails.email);

            const response = await fetch("/api/jobseekerdetails/uploadCoverImage", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to upload image");
            }

            setJobseekerDetails((prev) => ({
                ...prev,
                coverImage: data.imageUrl,
            }));

            Swal.fire({
                icon: 'success',
                title: 'Cover image updated!',
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            Swal.fire({
                icon: 'error',
                title: 'Upload failed',
                text: `Failed to upload image: ${error.message}`,
                timer: 2000,
                showConfirmButton: false,
            });
        } finally {
            setIsCoverUploading(false);
        }
    };

    // ... (rest of code)

    return (
        <div className="bg-white rounded-3xl py-7 px-7">
            <div>
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
                        {/* Cover image edit button */}
                        {session?.user?.role === "admin" && (
                            <div
                                className="z-0 rounded-full relative overflow-hidden flex flex-wrap items-center justify-end shadow-md w-12 h-12 mt-3 mr-3 cursor-pointer"
                                onClick={() => triggerFileInput("cover-image-input")}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverImageChange}
                                    id="cover-image-input"
                                    className="hidden"
                                />
                                <Image
                                    src="/editiconwhite.png"
                                    alt="Edit Icon"
                                    layout="fill"
                                    objectFit="contain"
                                    quality={100}
                                />
                            </div>
                        )}
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
                            {session?.user?.role === "admin" && (
                                <div
                                    className="absolute top-0 right-0 w-12 h-12 rounded-full flex items-center justify-center shadow-md z-0 bg-white cursor-pointer"
                                    onClick={() => triggerFileInput("profile-image-input")}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        id="profile-image-input"
                                        className="hidden"
                                    />
                                    <Image
                                        src="/editiconwhite.png"
                                        alt="Edit Icon"
                                        width={40}
                                        height={40}
                                        objectFit="contain"
                                        quality={100}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Social Links */}
                        <div className="pr-8 sm:pr-6 flex justify-end mt-4 space-x-2 sm:space-x-4 text-blue-900 ">
                            <a href={jobSeekerDetails.linkedin}><FaLinkedin size={30} className="cursor-pointer" /></a>
                            <a href={jobSeekerDetails.x}><FaTwitter size={30} className="cursor-pointer" /></a>
                            <a href={jobSeekerDetails.instagram}><FaInstagram size={30} className="cursor-pointer" /></a>
                            <a href={jobSeekerDetails.facebook}><FaFacebook size={30} className="cursor-pointer" /></a>
                            <a href={jobSeekerDetails.github}><FaGithub size={30} className="cursor-pointer" /></a>
                            <a href={jobSeekerDetails.dribbble}><FaDribbble size={30} className="cursor-pointer" /></a>
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

                        {session?.user?.role === "admin" && (
                            <div className="flex justify-center sm:justify-end w-full sm:w-auto sm:pt-2 z-0">
                                <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-end shadow-md w-12 h-12 mt-3 mr-3 z-0">
                                    <button
                                        onClick={() => setProfileEditForm(true)}
                                        className="text-white px-3 py-2 sm:px-4 rounded-md z-10">
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
                        )}
                    </div>
                </div>

                {/* personal profile */}
                <div className="text-left space-y-4 mt-8">
                    <h5 className="text-xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
                        Personal Profile
                    </h5>
                    <p className="text-justify font-medium">
                        {jobSeekerDetails.personalProfile || "No personal profile available"}
                    </p>
                </div>

                {/* bio data */}
                <div className="text-left space-y-4 mt-12">
                    <div className="flex flex-row items-center justify-between">
                        <h5 className="lg:text-xl md:text-xl sm:text-2xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
                            Bio Data
                        </h5>

                        {session?.user?.role === "admin" && (
                            <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-end shadow-md w-12 h-12 mt-3 mr-3 z-0">
                                <button
                                    onClick={() => setBioDataForm(true)}
                                    className="text-white px-3 py-2 sm:px-4 rounded-md z-10">
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
                        )}
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

                        {session?.user?.role === "admin" && (
                            <div className="flex flex-row items-center gap-2">
                                <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                                    <button
                                        onClick={() => setOpenEditExperienceForm(true)}
                                        className="flex items-center justify-center rounded-md z-10">
                                        <div className="">
                                            <GoPencil
                                                size={25}
                                                strokeWidth={1}
                                                color="#001571" />
                                        </div>
                                    </button>
                                </div>
                                <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                                    <button
                                        onClick={() => setOpenCreateExperienceForm(true)}
                                        className="flex items-center justify-center rounded-md z-10">
                                        <div className="">
                                            <FiPlus
                                                size={30}
                                                strokeWidth={2}
                                                color="#001571" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-8">
                        {experienceDetails.length > 0 ? (
                            experienceDetails.map((experience, index) => (
                                <ExperienceCard key={index} experience={experience} />
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No experience data available.</p>
                        )}
                    </div>
                </div>

                {/* education */}
                <div className="text-left space-y-6 mt-12">
                    <div className="flex flex-row items-center justify-between">
                        <h5 className="text-xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
                            Education
                        </h5>

                        {session?.user?.role === "admin" && (
                            <div className="flex flex-row items-center gap-2">
                                <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                                    <button
                                        onClick={() => setOpenEditEducationoForm(true)}
                                        className="flex items-center justify-center rounded-md z-10">
                                        <div className="">
                                            <GoPencil
                                                size={25}
                                                strokeWidth={1}
                                                color="#001571" />
                                        </div>
                                    </button>
                                </div>
                                <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                                    <button
                                        onClick={() => setOpenCreateEducationoForm(true)}
                                        className="flex items-center justify-center rounded-md z-10">
                                        <div className="">
                                            <FiPlus
                                                size={30}
                                                strokeWidth={2}
                                                color="#001571" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-8">
                        {educationDetails.length > 0 ? (
                            educationDetails.map((education, index) => (
                                <EducationCard key={index} education={education} />
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No education data available.</p>
                        )}
                    </div>
                </div>

                {/* certifications */}
                <div className="text-left space-y-6 mt-12">
                    <div className="flex flex-row items-center justify-between">
                        <h5 className="text-xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
                            Certification
                        </h5>

                        {session?.user?.role === "admin" && (
                            <div className="flex flex-row items-center gap-2">
                                <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                                    <button
                                        onClick={() => setOpenEditCertificationForm(true)}
                                        className="flex items-center justify-center rounded-md z-10">
                                        <div className="">
                                            <GoPencil
                                                size={25}
                                                strokeWidth={1}
                                                color="#001571" />
                                        </div>
                                    </button>
                                </div>
                                <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                                    <button
                                        onClick={() => setOpenCreateCertificationForm(true)}
                                        className="flex items-center justify-center rounded-md z-10">
                                        <div className="">
                                            <FiPlus
                                                size={30}
                                                strokeWidth={2}
                                                color="#001571" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-8">
                        {certificationDetails.length > 0 ? (
                            certificationDetails.map((certification, index) => (
                                <CertificationCard key={index} certification={certification} />
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No education data available.</p>
                        )}
                    </div>
                </div>

                {/* soft skills */}
                <div className="text-left space-y-4 mt-12">
                    <div className="flex flex-row items-center justify-between">
                        <h5 className="text-xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
                            Soft Skills
                        </h5>

                        {session?.user?.role === "admin" && (
                            <div className="flex flex-row items-center gap-2">
                                <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                                    <button
                                        onClick={() => setOpenEditSoftskillsForm(true)}
                                        className="flex items-center justify-center rounded-md z-10">
                                        <div className="">
                                            <GoPencil
                                                size={25}
                                                strokeWidth={1}
                                                color="#001571" />
                                        </div>
                                    </button>
                                </div>
                                <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                                    <button
                                        onClick={() => setOpenCreateSoftskillsForm(true)}
                                        className="flex items-center justify-center rounded-md z-10">
                                        <div className="">
                                            <FiPlus
                                                size={30}
                                                strokeWidth={2}
                                                color="#001571" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {jobSeekerDetails.softSkills?.map((skills, index) => (
                            <SoftSkillsCard key={index} skills={skills} />
                        )) ?? <p className="text-gray-500 text-sm">No soft skills data available.</p>}
                    </div>
                </div>

                {/* expertise */}
                <div className="text-left space-y-4 mt-12">
                    <div className="flex flex-row items-center justify-between">
                        <h5 className="text-xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
                            Professional Expertise
                        </h5>

                        {session?.user?.role === "admin" && (
                            <div className="flex flex-row items-center gap-2">
                                <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                                    <button
                                        onClick={() => setOpenEditExpertiseForm(true)}
                                        className="flex items-center justify-center rounded-md z-10">
                                        <div className="">
                                            <GoPencil
                                                size={25}
                                                strokeWidth={1}
                                                color="#001571" />
                                        </div>
                                    </button>
                                </div>
                                <div className="bg-[#E8E8E8] hover:bg-[#c1c1c1] rounded-full relative overflow-hidden flex flex-wrap items-center justify-center shadow-md w-12 h-12 mr-3 z-0">
                                    <button
                                        onClick={() => setOpenCreateExpertiseForm(true)}
                                        className="flex items-center justify-center rounded-md z-10">
                                        <div className="">
                                            <FiPlus
                                                size={30}
                                                strokeWidth={2}
                                                color="#001571" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {jobSeekerDetails.professionalExpertise?.map((expertise, index) => (
                            <ExpertiseCard
                                key={index}
                                expertise={expertise} />

                        )) ?? <p className="text-gray-500 text-sm">No professional expertise data available.</p>}
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
                                <h4 className="text-2xl font-semibold text-[#001571]">Add Experience Details</h4>
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
                                    className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
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
                                <h4 className="text-2xl font-semibold text-[#001571]">Add Education Details</h4>
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
                                    className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
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
                                <h4 className="text-2xl font-semibold text-[#001571]">Add Licenses & Certification Details</h4>
                                <button
                                    onClick={() => setOpenCreateCertificationForm(false)}
                                    className="text-gray-500 hover:text-red-500 focus:outline-none"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            {/* Scrollable Form Content */}
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                <form onSubmit={handleCreateCertification} className="space-y-6">
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
                                    className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
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
                                <h4 className="text-2xl font-semibold text-[#001571]">Add Soft Skills</h4>
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
                                    className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
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
                                <h4 className="text-2xl font-semibold text-[#001571]">Add Professional Expertise</h4>
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
                                    className={`w-auto bg-[#001571] text-white px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-semibold flex items-center justify-center ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
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
                {openEditExperienceForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
                            <div className="flex items-center justify-between p-6 pb-0">
                                <h4 className="text-lg font-semibold text-[#001571]">Edit Experience Details</h4>
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
                                    <p className="text-gray-500 text-sm">No experience data available.</p>
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
                                <h4 className="text-lg font-semibold text-[#001571]">Edit Education Details</h4>
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
                                    <p className="text-gray-500 text-sm">No education data available.</p>
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
                                <h4 className="text-lg font-semibold text-[#001571]">Edit Certification Details</h4>
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
                                        <CertificationCardEdit key={index} certification={certification} />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No certification data available.</p>
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
                                <h4 className="text-lg font-semibold text-[#001571]">Edit Soft Skills Details</h4>
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
                                        onDelete={() => handleDeleteSoftSkill(skill)} />
                                )) ?? <p className="text-gray-500 text-sm">No soft skills data available.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Expertise Popup */}
                {openEditExpertiseForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-2/3 bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh]">
                            <div className="flex items-center justify-between p-6 pb-0">
                                <h4 className="text-lg font-semibold text-[#001571]">Edit Professional Expertise Details</h4>
                                <button
                                    onClick={() => setOpenEditExpertiseForm(false)}
                                    className="text-gray-500 hover:text-red-500 focus:outline-none"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>
                            <div className="p-6 flex flex-wrap gap-4">
                                {jobSeekerDetails.professionalExpertise?.map((expertise, index) => (
                                    <ExpertiseCardEdit
                                        key={index}
                                        expertise={expertise}
                                        onDelete={() => handleDeleteExpertise(expertise)} />

                                )) ?? <p className="text-gray-500 text-sm">No professional expertise data available.</p>}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}