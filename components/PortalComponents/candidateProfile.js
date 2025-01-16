"use client"

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    FaLinkedin,
    FaTwitter,
    FaInstagram,
    FaFacebook,
    FaGithub,
    FaDribbble,
    FaMedal,
} from "react-icons/fa";


export default function CandidateProfile() {

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
        experience: "",
        education: "",
        licensesCertifications: "",
        softSkills: "",
        professionalExpertise: "",
        profileImage: "", // Added profile image field
    });

    const [appliedJobs, setAppliedJobs] = useState([]);
    const [error, setError] = useState(null);

    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login"); // Redirect to login if unauthenticated
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.email) {
            const fetchJobSeekerDetails = async (e) => {
                try {
                    const response = await fetch(
                        `/api/jobseekerdetails/get?email=${session.user.email}`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setJobSeekerDetails(data);
                    } else {
                        console.error("Failed to fetch job seeker details");
                    }
                } catch (error) {
                    console.error("Error fetching job seeker details:", error);
                }
            };

            fetchJobSeekerDetails();
        }
    }, [session]);

    useEffect(() => {
        if (session?.user?.id) {
            const fetchAppliedJobs = async () => {
                try {
                    const response = await fetch(
                        `/api/job/appliedjobs?id=${session.user.id}`
                    );
                    if (!response.ok) {
                        throw new Error("Failed to fetch applied jobs.");
                    }
                    const data = await response.json();
                    setAppliedJobs(data.appliedJobs);
                } catch (err) {
                    setError(err.message);
                    console.error("Error fetching jobs:", err);
                }
            };
            fetchAppliedJobs();
        }
    }, [session]);

    // In your Profile component
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
            formData.append("email", session.user.email);

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
            setJobSeekerDetails((prev) => ({
                ...prev,
                profileImage: data.imageUrl,
            }));

            alert("Profile image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            alert(`Failed to upload image: ${error.message}`);
        }
    };

    return (
        <>
            <div className="bg-white rounded-3xl p-6 ">
                <h1 className="font-bold mb-16 text-[#001571]">My Profile</h1>
                <div>
                    <div className="relative">
                        {/* Background Image */}
                        <Image
                            src="/recruiterbg.png"
                            alt="Background"
                            width={1200}
                            height={400}
                            className="w-full h-auto sm:h-48 object-cover rounded-t-3xl"
                        />
                        {/* Edit Image */}
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white rounded-full overflow-hidden w-[30px] sm:w-[30px] h-[30px] sm:h-[30px] flex items-center justify-center shadow-md">
                            <Image
                                src="/editiconwhite.png"
                                alt="Edit Icon"
                                width={40}
                                height={40}
                            />
                        </div>
                        {/* Profile Image */}
                        <div className="relative">
                            {/* DP Image */}
                            <div className="absolute transform -mt-10 sm:-mt-16 ml-4 sm:ml-10 lg:ml-10 border-4 border-[#001571] bg-white rounded-full overflow-hidden w-24 h-24 sm:w-28 sm:h-28 lg:w-[180px] lg:h-[180px] flex items-center justify-center">
                                {jobSeekerDetails.profileImage ? (
                                    <Image
                                        src={jobSeekerDetails.profileImage}
                                        alt="Profile"
                                        width={300}
                                        height={190}
                                        className="fill"
                                    />
                                ) : (
                                    <Image
                                        src="/default-avatar.jpg"
                                        alt="Profile"
                                        width={300}
                                        height={190}
                                        className="fill"
                                    />
                                )}

                            </div>

                            {/* Edit Icon */}
                            <div className="absolute -top-9 left-[155px] transform translate-x-1/2 -translate-y-1/2 w-20 h-8 sm:w-10 sm:h-30  rounded-full  items-center justify-center shadow-md">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    id="profile-image-input"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                {/* Edit Icon */}
                                <Image
                                    src="/editiconwhite.png"
                                    alt="Edit Icon"
                                    width={40}
                                    height={20}
                                    className="z-10" // Ensure the icon stays on top
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media Icons */}
                    <div className="pr-8 sm:pr-6 flex justify-end mt-4 space-x-2 sm:space-x-4 text-blue-900">
                        <FaLinkedin size={30} className="cursor-pointer" />
                        <FaTwitter size={30} className="cursor-pointer" />
                        <FaInstagram size={30} className="cursor-pointer" />
                        <FaFacebook size={30} className="cursor-pointer" />
                        <FaGithub size={30} className="cursor-pointer" />
                        <FaDribbble size={30} className="cursor-pointer" />
                    </div>

                    {/* Profile Info */}
                    <div className="p-0 sm:p-0 text-left mt-28">
                        <div>
                            <div className="flex flex-row justify-between items-center">
                                <div>
                                    <h3 className="text-lg sm:text-2xl font-bold">
                                        {jobSeekerDetails.firstName} {jobSeekerDetails.lastName}
                                    </h3>
                                    <div className="flex flex-row space-x-3 font-semibold text-base mt-1">
                                        <p>occupation</p>
                                        <p>|</p>
                                        <p>passion</p>
                                    </div>
                                </div>
                                <button
                                    // onClick={() => setShowApplicationForm(true)}
                                    className=" text-white rounded-md"
                                >
                                    <div className="flex items-center">
                                        <Image
                                            src="/editicon.png"
                                            alt="arrow"
                                            width={50}
                                            height={16}
                                        />
                                    </div>
                                </button>
                            </div>

                            <h3 className="mt-12 text-blue-900 text-base sm:text-lg font-bold">
                                Personal Profile
                            </h3>
                            <p className="text-gray-800 mt-2 sm:mt-3 mb-4 sm:mb-6 font-sans">
                                {jobSeekerDetails.personalProfile}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
