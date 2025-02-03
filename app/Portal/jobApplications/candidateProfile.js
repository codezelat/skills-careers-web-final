"use client"
import { useState, useEffect } from "react";
import PortalLoading from "../../loading";
import { FaDribbble, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaMedal, FaTimes, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import { PiCheckCircle } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ExperienceCard from "@/components/PortalComponents/experienceCard";
import EducationCard from "@/components/PortalComponents/educationCard";
import CertificationCard from "@/components/PortalComponents/certificationCard";
import { FiPlus } from "react-icons/fi";
import { RiDownloadLine } from "react-icons/ri";

export default function CandidateProfile({ slug }) {

    const router = useRouter();
    const { data: session, status } = useSession();

    const [isDownloading, setIsDownloading] = useState(false);

    const [jobSeekerDetails, setJobseekerDetails] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const [experienceDetails, setExperienceDetails] = useState([]);
    const [educationDetails, setEducationDetails] = useState([]);
    const [certificationDetails, setCertificationDetails] = useState([]);
    const [applications, setApplications] = useState([]);

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // fetch functions
    useEffect(() => {
        if (session?.user?.email) {
            const fetchData = async () => {
                try {
                    setIsLoading(true);

                    const jobSeekerResponse = await fetch(`/api/jobseekerdetails/get?id=${slug}`);
                    if (!jobSeekerResponse.ok) throw new Error("Failed to fetch job seeker");
                    const jobSeekerData = await jobSeekerResponse.json();

                    setJobseekerDetails(jobSeekerData.jobseeker);

                    const userResponse = await fetch(`/api/users/get?id=${jobSeekerData.jobseeker.userId}`);
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
                    console.log("test", certificationData.licensesandcertifications);

                } catch (err) {
                    setError(err.message);
                    console.error("Fetch error:", err);
                } finally {
                    setIsLoading(false);
                }
            };

            if (slug) fetchData();
        }
    }, [session, slug]);

    // loading
    if (isLoading) return <PortalLoading />;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white rounded-3xl py-7 px-7">

            <div>
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

                    </div>
                    {/* Profile Image */}
                    <div className="relative flex flex-row justify-between">

                        {/* DP Image */}
                        <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-[180px] lg:h-[180px] mt-[-92px] ml-10 flex items-top justify-center relative">

                            {/* Profile picture container */}
                            <div className="relative border-4 border-[#001571] bg-white rounded-full overflow-hidden w-24 h-24 sm:w-28 sm:h-28 lg:w-[180px] lg:h-[180px]">
                                {userDetails.profileImage ? (
                                    <Image
                                        src={userDetails.profileImage}
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
                <div className="text-left space-y-6 mt-12">
                    <div className="flex flex-row items-center justify-between">
                        <h5 className="text-xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
                            Experience
                        </h5>
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
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {jobSeekerDetails.softSkills?.map((skills, index) => (
                            <div
                                key={index}
                                className="flex flex-row items-center gap-2 bg-[#E6E8F1] px-4 py-2 rounded-md text-base font-semibold text-[#001571]"
                            >
                                <FaMedal />
                                {skills}
                            </div>
                        )) ?? <p className="text-gray-500 text-sm">No soft skills data available.</p>}
                    </div>
                </div>

                {/* expertise */}
                <div className="text-left space-y-4 mt-12">
                    <div className="flex flex-row items-center justify-between">
                        <h5 className="text-xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
                            Personal Expertise
                        </h5>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {jobSeekerDetails.professionalExpertise?.map((expertise, index) => (
                            <div
                                key={index}
                                className="flex flex-row items-center gap-2 bg-[#E6E8F1] px-4 py-2 rounded-md text-base font-semibold text-[#001571]"
                            >
                                <FaMedal />
                                {expertise}
                            </div>
                        )) ?? <p className="text-gray-500 text-sm">No professional expertise data available.</p>}
                    </div>
                </div>

            </div>
        </div>
    );
}