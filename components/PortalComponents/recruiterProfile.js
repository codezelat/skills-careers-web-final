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


export default function RecruiterProfile() {

    const router = useRouter();
    const { data: session, status } = useSession();
    console.log(status);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [recruiterDetails, setRecruiterDetails] = useState({
        id: "",
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
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login"); // Redirect to login if unauthenticated
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user?.email) {
            const fetchRecruiterDetails = async () => {
                try {
                    const response = await fetch(
                        `/api/recruiterdetails/get?userId=${session.user.id}`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setRecruiterDetails(data);
                    } else {
                        console.error("Failed to fetch recruiter details");
                    }
                } catch (error) {
                    console.error("Error fetching recruiter details:", error);
                }
            };
            fetchRecruiterDetails();
        }
    }, [session]);

    useEffect(() => {
        if (recruiterDetails.id) {
            const fetchJobs = async () => {
                try {
                    const response = await fetch(
                        `/api/job/all?recruiterId=${recruiterDetails.id}&showAll=true`
                    );
                    if (!response.ok) {
                        throw new Error("Failed to fetch jobs.");
                    }
                    const data = await response.json();
                    setJobs(data.jobs);
                } catch (err) {
                    setError(err.message);
                    console.error("Error fetching jobs:", err);
                }
            };
            fetchJobs();
        }
    }, [recruiterDetails.id]);

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

    return (
        <>
            <div className="bg-white rounded-3xl py-7 px-7">
                <div>
                    <div className="">
                        {/* Background Image */}
                        <div className="bg-red-300 relative w-full h-[300px] rounded-t-2xl overflow-hidden flex items-top justify-end">
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
                                <div className="absolute top-0 right-0 w-12 h-12 rounded-full flex items-center justify-center shadow-md z-20 bg-white">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        id="logo-image-input"
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

                    <div className="pt-8 sm:pt-14">
                        <h1 className="text-center sm:text-left text-2xl sm:text-4xl md:text-3xl font-bold text-black mt-8 sm:mt-12">
                            {recruiterDetails.recruiterName}
                        </h1>

                        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between pr-2 sm:pr-5 space-y-4 sm:space-y-0 mt-5 text-sm w-full">
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
                                {/* <div className="flex items-center">
                                    <Image
                                        src="/reward.png"
                                        width={20}
                                        height={20}
                                        alt="Industry"
                                        className="rounded-full"
                                    />
                                    <p className="text-black ml-2 font-semibold text-base">
                                        Technology & Development
                                    </p>
                                </div> */}
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
                            <div className="flex justify-center sm:justify-end w-full sm:w-auto sm:pt-2">
                                <div className="z-10 bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-end shadow-md w-12 h-12 mt-3 mr-3">
                                    <Image
                                        src="/editiconwhite.png"
                                        alt="Edit Icon"
                                        layout="fill"
                                        objectFit="contain"
                                        quality={100}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* <div className="text-left space-y-4 mt-10">
                        <h5 className="lg:text-xl md:text-xl sm:text-2xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
                            Company Description
                        </h5>
                        <p className="text-justify font-medium">
                            I am a dedicated and results-driven Senior UX/UI Designer with
                            over 5 years of experience in creating user-friendly and
                            aesthetically pleasing digital products. My expertise lies in
                            designing intuitive interfaces for web and mobile applications,
                            conducting user research, and collaborating with cross-functional
                            teams to deliver seamless user experiences. I have a passion for
                            combining creativity with data-driven insights to solve complex
                            design challenges. Throughout my career, I have worked with
                            innovative companies like InnovateTech Solutions and BrightPath
                            Marketing, leading design projects that significantly improved
                            user engagement and product usability. I am always eager to learn
                            new trends in design and technology, and I strive to create
                            designs that not only meet business goals but also delight users.
                            In my free time, I enjoy mentoring junior designers, contributing
                            to open-source projects, and exploring the latest developments in
                            UX design.
                        </p>
                    </div> */}

                    {/* Contact Information */}
                    <div className="flex flex-wrap lg:flex-nowrap md:flex-nowrap sm:flex-nowrap space-y-4 lg:space-y-0 lg:space-x-8 md:space-y-0 md:space-x-8 sm:space-y-0 sm:space-x-8 mt-8 pb-8 lg:justify-start md:justify-start sm:justify-between">
                        <div className="flex items-center w-full lg:w-auto">
                            <button className="w-full lg:w-auto bg-[#001571] text-white py-3 px-4 rounded-md font-semibold text-center">
                                {recruiterDetails.contactNumber}
                            </button>
                        </div>
                        <div className="flex items-center w-full lg:w-auto">
                            <button className="w-full lg:w-auto bg-[#001571] text-white py-3 px-4 rounded-md font-semibold text-center">
                                {recruiterDetails.email}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
