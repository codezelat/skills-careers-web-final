"use client";
import { useState, useEffect } from "react";
import PortalLoading from "../../loading";
import {
  FaFacebook,
  FaGithub,
  FaHeart,
  FaInstagram,
  FaLinkedin,
  FaMedal,
  FaRegHeart,
  FaTimes,
  FaTwitter,
  FaGlobe,
} from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import Image from "next/image";
import { PiCheckCircle } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ExperienceCard from "@/components/PortalComponents/experienceCard";
import EducationCard from "@/components/PortalComponents/educationCard";
import CertificationCard from "@/components/PortalComponents/certificationCard";
import { FiPlus } from "react-icons/fi";
import { RiDownloadLine } from "react-icons/ri";
import { IoIosCheckmarkCircleOutline, IoMdClose } from "react-icons/io";
import { MdDownloadForOffline } from "react-icons/md";
import { TbMailFilled } from "react-icons/tb";
import { IoMail } from "react-icons/io5";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [isFavourited, setIsFavourited] = useState(false);

  // fetch functions
  useEffect(() => {
    if (session?.user?.email) {
      const fetchData = async () => {
        try {
          setIsLoading(true);

          const applicationResponse = await fetch(
            `/api/jobapplication/get?id=${slug}`
          );
          if (!applicationResponse.ok)
            throw new Error("Failed to fetch job applications");
          const applicationData = await applicationResponse.json();
          setApplications(applicationData.application);
          setApplicationStatus(applicationData.application.status);
          setIsFavourited(applicationData.application.isFavourited || false);
          console.log("single application - ", applicationData.application);

          // Check if candidate account is deleted
          if (applicationData.application.candidateDeleted) {
            setError(
              "This candidate account has been deleted. Limited information is available."
            );
            setIsLoading(false);
            return;
          }

          const jobSeekerResponse = await fetch(
            `/api/jobseekerdetails/get?id=${applicationData.application.jobseekerId}`
          );
          if (!jobSeekerResponse.ok) {
            const errorData = await jobSeekerResponse.json();
            if (errorData.isDeleted) {
              setError(
                "This candidate account has been deleted. Limited information is available."
              );
              setIsLoading(false);
              return;
            }
            throw new Error("Failed to fetch job seeker");
          }
          const jobSeekerData = await jobSeekerResponse.json();

          setJobseekerDetails(jobSeekerData.jobseeker);

          const userResponse = await fetch(
            `/api/users/get?id=${jobSeekerData.jobseeker.userId}`
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

          // Sort experiences: Current (no endDate) first, then by startDate descending
          const sortedExperiences = newExperienceData.experiences.sort(
            (a, b) => {
              if (!a.endDate && b.endDate) return -1; // a is current, b is not
              if (a.endDate && !b.endDate) return 1; // b is current, a is not
              return new Date(b.startDate) - new Date(a.startDate); // both current or both past
            }
          );
          setExperienceDetails(sortedExperiences);

          const educationResponse = await fetch(
            `/api/jobseekerdetails/education/all?id=${jobSeekerData.jobseeker._id}`
          );
          if (!educationResponse.ok)
            throw new Error("Failed to fetch experience details");
          const educationeData = await educationResponse.json();

          // Sort education: Current (no endDate) first, then by startDate descending
          const sortedEducation = educationeData.educations.sort((a, b) => {
            if (!a.endDate && b.endDate) return -1;
            if (a.endDate && !b.endDate) return 1;
            return new Date(b.startDate) - new Date(a.startDate);
          });
          setEducationDetails(sortedEducation);

          const certificationResponse = await fetch(
            `/api/jobseekerdetails/certification/all?id=${jobSeekerData.jobseeker._id}`
          );
          if (!certificationResponse.ok)
            throw new Error("Failed to fetch experience details");
          const certificationData = await certificationResponse.json();

          // Sort certifications by receivedDate descending (latest first)
          const sortedCertifications =
            certificationData.licensesandcertifications.sort(
              (a, b) => new Date(b.receivedDate) - new Date(a.receivedDate)
            );
          setCertificationDetails(sortedCertifications);
          console.log("test", sortedCertifications);
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

  // handle favorite function
  const handleToggleFavorite = async () => {
    try {
      const newFavouriteStatus = !isFavourited;

      const response = await fetch(
        `/api/jobapplication/favourite?id=${applications._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isFavourited: newFavouriteStatus,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update favorite status");

      const data = await response.json();
      console.log(data.message);
      setIsFavourited(newFavouriteStatus);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update favorite status. Please try again.");
    }
  };

  // Approve function
  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      setPendingAction("approve");

      const response = await fetch("/api/jobapplication/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobseekerEmail: applications.email,
          applicationId: slug,
          jobTitle: applications.jobTitle,
          status: "Approved",
        }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const data = await response.json();
      console.log(data.message);
      setApplicationStatus("Approved");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
      setPendingAction(null);
    }
  };

  // Decline function
  const handleDecline = async () => {
    try {
      setIsProcessing(true);
      setPendingAction("decline");

      const response = await fetch("/api/jobapplication/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobseekerEmail: applications.email,
          applicationId: slug,
          jobTitle: applications.jobTitle,
          status: "Declined",
        }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const data = await response.json();
      console.log(data.message);
      setApplicationStatus("Declined");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
      setPendingAction(null);
    }
  };

  // Download cv function
  const handleDownloadCV = async () => {
    if (!applications?.cvFileId) {
      alert("No CV available for download");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch(`/api/download-cv/${applications.cvFileId}`);
      if (!response.ok) throw new Error("Failed to download CV");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `CV_${applications.firstName.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download CV. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // loading
  if (isLoading) return <PortalLoading />;

  // Handle error - including deleted account scenario
  if (error) {
    return (
      <div className="bg-white rounded-3xl py-7 px-7">
        <div className="text-center py-20">
          <div className="mb-4 text-red-500">
            <FaTimes size={48} className="inline-block" />
          </div>
          <h2 className="text-xl font-bold text-[#001571] mb-2">
            Account Not Available
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          {applications?.candidateDeleted && (
            <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Application Details:</strong>
              </p>
              <div className="text-left text-sm space-y-1">
                <p>
                  <strong>Job:</strong> {applications.jobTitle}
                </p>
                <p>
                  <strong>Applicant:</strong> {applications.firstName}{" "}
                  {applications.lastName}
                </p>
                <p>
                  <strong>Status:</strong> {applications.status}
                </p>
                <p>
                  <strong>Applied:</strong>{" "}
                  {new Date(applications.appliedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => router.push("/Portal/jobApplications")}
            className="mt-6 px-6 py-2 bg-[#001571] text-white rounded-lg hover:bg-[#162255]"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl py-7 px-7">
      <div>
        <div className="flex flex-row items-center justify-between w-full border-b-[1px] border-[#B0B6D3] pb-6">
          <h1 className="font-semibold text-lg text-[#001571]">Application</h1>
          <div className="flex flex-row items-end gap-2">
            <>
              {/* favorite button */}
              <button
                onClick={handleToggleFavorite}
                className={`flex items-center w-[42px] h-[42px] justify-center p-2 rounded-xl transition-colors ${
                  isFavourited ? "bg-red-100" : "bg-gray-200"
                }`}
              >
                {isFavourited ? (
                  <FaHeart color="#EC221F" size={20} />
                ) : (
                  <FaRegHeart color="#001571" size={20} />
                )}
              </button>

              {/* approve and decline buttons */}
              <button
                onClick={handleApprove}
                disabled={isProcessing || applicationStatus === "Approved"}
                className={`flex flex-row items-center h-[42px] gap-2 py-2 px-6 border-0 rounded-xl text-base font-medium transition-colors ${
                  applicationStatus === "Approved"
                    ? "bg-[#001571] hover:bg-[#243584] text-white cursor-default"
                    : applicationStatus === "Declined"
                      ? "bg-gray-200 text-gray-500 hover:text-white hover:bg-[#001571]"
                      : "bg-[#001571] hover:bg-[#243584] text-white"
                } ${isProcessing ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                <IoIosCheckmarkCircleOutline size={20} />
                {pendingAction === "approve"
                  ? "Processing..."
                  : applicationStatus === "Approved"
                    ? "Approved"
                    : "Approve"}
              </button>
              <button
                onClick={handleDecline}
                disabled={isProcessing || applicationStatus === "Declined"}
                className={`flex flex-row items-center h-[42px] gap-2 py-2 px-6 border-0 rounded-xl text-base font-normal transition-colors ${
                  applicationStatus === "Declined"
                    ? "bg-[#EC221F] hover:bg-[#c63431] text-white cursor-default"
                    : applicationStatus === "Approved"
                      ? "bg-gray-200 text-gray-500 hover:text-white hover:bg-[#EC221F]"
                      : "bg-[#EC221F] hover:bg-[#c63431] text-white"
                } ${isProcessing ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                <IoMdClose size={20} />
                {pendingAction === "decline"
                  ? "Processing..."
                  : applicationStatus === "Declined"
                    ? "Declined"
                    : "Decline"}
              </button>
            </>
          </div>
        </div>
        <div className="mt-6">
          {/* Background Image */}
          <div className="bg-red-300 relative w-full h-[300px] rounded-t-2xl overflow-hidden flex items-top justify-end">
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
        <div className="flex flex-row items-center justify-between pt-8 sm:pt-14">
          <div>
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
          <div className="flex flex-row gap-2">
            <button
              onClick={handleDownloadCV}
              className="flex flex-row items-center gap-2 py-3 px-6 border-0 rounded-xl bg-[#001571] hover:bg-[#162255] text-base font-normal text-white"
            >
              <MdDownloadForOffline size={20} />
              {isDownloading ? "Downloading..." : "Download CV"}
            </button>
            <button
              onClick={() => {
                if (jobSeekerDetails.email) {
                  window.location.href = `mailto:${jobSeekerDetails.email}?subject=Regarding Your Job Application&body=Dear ${userDetails.firstName} ${userDetails.lastName},`;
                } else {
                  alert("No email address available for this candidate.");
                }
              }}
              className="flex flex-row items-center gap-2 py-3 px-6 border-0 rounded-xl bg-[#001571] hover:bg-[#162255] text-base font-normal text-white"
            >
              <IoMail size={20} />
              Send an Email
            </button>
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
            )) ?? (
              <p className="text-gray-500 text-sm">
                No professional expertise data available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
