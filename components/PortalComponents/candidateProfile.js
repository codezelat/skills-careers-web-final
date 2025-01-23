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
            <div className="bg-white rounded-3xl py-5 px-7">
                <h1 className="font-bold mb-16 text-[#001571]">My Profile</h1>
                <div>
                    <div className="">
                        {/* Background Image */}
                        <div className="bg-red-300 relative w-full h-[300px] rounded-t-3xl overflow-hidden flex items-top justify-end">
                            <Image
                                src="/recruiterbg.png"
                                alt="Background"
                                layout="fill"
                                priority
                                objectFit="cover"
                                quality={100}
                            />

                            {/* cover image edit btn */}
                            <div className="z-10 rounded-full relative overflow-hidden flex flex-wrap items-center justify-end shadow-md w-12 h-12 mt-3 mr-3">
                                <Image
                                    src="/editiconwhite.png"
                                    alt="Edit Icon"
                                    layout="fill"
                                    objectFit="contain"
                                    quality={100}
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
                                <div className="absolute top-0 right-0 w-12 h-12 rounded-full flex items-center justify-center shadow-md z-20 bg-white">
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
                                        height={40}
                                        objectFit="contain"
                                        quality={100}
                                    />
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="pr-8 sm:pr-6 flex justify-end mt-4 space-x-2 sm:space-x-4 text-blue-900 ">
                                <FaLinkedin size={30} className="cursor-pointer" />
                                <FaTwitter size={30} className="cursor-pointer" />
                                <FaInstagram size={30} className="cursor-pointer" />
                                <FaFacebook size={30} className="cursor-pointer" />
                                <FaGithub size={30} className="cursor-pointer" />
                                <FaDribbble size={30} className="cursor-pointer" />
                            </div>
                        </div>

                    </div>

                    {/* Profile Info */}
                    <div className="p-0 sm:p-0 text-left mt-10">
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
