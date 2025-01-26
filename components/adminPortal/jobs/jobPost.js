import Image from "next/image";
import { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import EditJobPosts from "./editJobPosts";
import EditJobDescription from "./editJobDescription";
import EditKeyResponsibilities from "./editKeyResponsibilities";
import EditQualifications from "./editQualification";
import EditBenifits from "./editBenifits";

export default function JobPost({job}) {
  const [showJobDesEditForm, setShowJobDesEditForm] = useState(false);
  const [showJobEditForm, setShowJobEditForm] = useState(false);
  const [showResponsibilityEditForm, setShowResponsibilityEditForm] =
    useState(false);
  const [showRequirementEditForm, setShowRequirementEditForm] = useState(false);
  const [showPerkEditForm, setShowPerkEditForm] = useState(false);

  const [jobDetails, setJobDetails] = useState({
    _id: "",
    jobTitle: "",
    recruiterId: "",
    location: "",
    jobCategory: "",
    jobTypes: "",
    jobDescription: "",
    keyResponsibilities: "",
    jobExperience: "",
    salaryRs: "",
    salaryCents: "",
    createdAt: "",
  });

  const [recruiterDetails, setRecruiterDetails] = useState({
    recruiterName: "",
    email: "",
    profileImage: "",
  });

  const [applications, setApplications] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    setJobDetails(job);
  }, [job]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch recruiter details after getting job details
        if (jobDetails.recruiterId) {
          const recruiterResponse = await fetch(
            `/api/recruiterdetails/get?id=${jobDetails.recruiterId}`
          );
          if (recruiterResponse.ok) {
            const data = await recruiterResponse.json();
            setRecruiterDetails(data.recruiter);
          }
        }

        if (jobDetails.recruiterId && jobDetails._id) {
          // Fetch applications after getting job details
          const applicationsResponse = await fetch(
            `/api/jobapplication/get?jobId=${jobDetails._id}&recruiterId=${jobDetails.recruiterId}`
          );
          const applicationsData = await applicationsResponse.json();

          if (!applicationsResponse.ok) {
            throw new Error(
              applicationsData.message || "Failed to fetch applications"
            );
          }
          setApplications(applicationsData.applications);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobDetails?._id) {
      fetchJobDetails();
    }
  }, [jobDetails?._id]);

  const handleViewRecruiter = () => {
    // Open the recruiter profile in a new tab
    window.open(`/recruiters/${jobDetails.recruiterId}`, "_blank");
  };

  const handleJobSelect = () => {
    setSelectedJob(jobDetails);
  };

  const handleCloseProfile = () => {
    setSelectedJob(null);
  };
    

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden p-6">
      
          <div key={jobDetails?._id}>
            <div className="flex flex-grow justify-end">
              {/* Date on the top right */}
              <p className="text-gray-900 font-semibold">{jobDetails?.createdAt}</p>
            </div>

            <div className="flex flex-grow justify-between">
              {/* Logo on the top left */}
              <Image
                src={recruiterDetails?.profileImage || "/images/default-image.jpg"}
                alt="Profile Image"
                width={140}
                height={40}
              />
              <div>
                <button
                  onClick={() => setShowJobEditForm(true)}
                  className="text-whiterounded-md"
                >
                  <div className="flex items-center gap-2 bg-[#E8E8E8] w-8 h-8 md:w-12 md:h-12 rounded-full justify-center">
                    <FaPencilAlt className="text-[#001571]" />
                  </div>
                </button>
              </div>
            </div>
            <div className="flex flex-grow justify-between">
              <div className="flex space-x-10">
                <h3 className="text-2xl font-bold text-blue-900 mt-6 mb-2">
                  {jobDetails?.jobTitle}
                </h3>
                {/*<div className="flex space-x-2 mb-4 mt-6">
                  {jobDetails.jobTypes.map((type, index) => (
                    <span
                      key={index}
                      className={px-2 py-1 rounded-md text-xs mt-2 font-medium items-center ${
                        type === "Full Time"
                          ? "bg-[#001571] text-white"
                          : type === "On Site"
                          ? "bg-[#00B6B4] text-white"
                          : ""
                      }}
                    >
                      {type}
                    </span>
                  ))}
                </div>*/}
              </div>
              <div>
                <button className="border-2 border-[#001571] px-5 py-2 mt-6">
                  <div className="flex flex-row space-x-2 items-center">
                    <p className="font-semibold text-[#001571]">
                      View Company Profile
                    </p>
                    <Image
                      src="/images/arrowblue.png"
                      alt="arrow"
                      width={30}
                      height={10}
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="flex flex-grow space-x-5">
              <p className="font-bold text-gray-800 font-sans">
                {recruiterDetails.recruiterName}
              </p>
              <p className="font-bold">|</p>
              <p className="text-gray-800 font-bold font-sans">
                {jobDetails?.location}
              </p>
            </div>
            <div className="border-t-2 border-gray-300 mt-3 mb-3" />
            <div className="flex flex-grow justify-between">
              <p className="font-semibold mb-6 font-2xl">Job Description</p>
              <div>
                <button
                  onClick={() => setShowJobDesEditForm(true)}
                  className="text-white rounded-md"
                >
                  <div className="flex items-center gap-2 bg-[#E8E8E8] w-8 h-8 md:w-12 md:h-12 rounded-full justify-center">
                    <FaPencilAlt className="text-[#001571]" />
                  </div>
                </button>
              </div>
            </div>
            <p className="mb-8">{jobDetails?.jobDescription}</p>
          </div>
        

        <div className="border-t-2 border-gray-300 mt-2 mb-6" />

        <div className="flex flex-grow justify-between">
          <p className="font-semibold mb-6 font-2xl">Key Responsibilities</p>
          <div>
            <button
              onClick={() => setShowResponsibilityEditForm(true)}
              className=" text-white  rounded-md"
            >
              <div className="flex items-center gap-2  bg-[#E8E8E8] w-8 h-8 md:w-12 md:h-12 rounded-full justify-center">
                <FaPencilAlt className="text-[#001571]" />
              </div>
            </button>
          </div>
        </div>

          <div>
          <p className=" mb-8 ">{jobDetails?.keyResponsibilities}</p>
          </div>
        
        <div className="border-t-2 border-gray-300 mt-6 mb-6" />

        <div className="flex flex-grow justify-between">
          <p className="font-semibold mb-6 font-2xl">Required Qualifications</p>
          <div>
            <button
              onClick={() => setShowRequirementEditForm(true)}
              className=" text-white  rounded-md"
            >
              <div className="flex items-center gap-2  bg-[#E8E8E8] w-8 h-8 md:w-12 md:h-12 rounded-full justify-center">
                <FaPencilAlt className="text-[#001571]" />
              </div>
            </button>
          </div>
        </div>
        
          <div>
          <p className=" mb-8 ">{recruiterDetails.EditQualifications}</p>
          </div>
      

        <div className="border-t-2 border-gray-300 mt-6 mb-6" />

        <div className="flex flex-grow justify-between">
          <p className="font-semibold mb-6 font-2xl">Perks & Benifits</p>
          <div>
            <button
              onClick={() => setShowPerkEditForm(true)}
              className=" text-white"
            >
              <div className="flex items-center gap-2  bg-[#E8E8E8] w-8 h-8 md:w-12 md:h-12 rounded-full justify-center">
                <FaPencilAlt className="text-[#001571]" />
              </div>
            </button>
          </div>
        </div>
       
          <div>
          <p className=" mb-8 ">{jobDetails?.jobDescription}</p>
          </div>

        {/* Edit Job Form Popup */}
        {showJobEditForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
              <EditJobPosts onClose={() => setShowJobEditForm(false)} />
            </div>
          </div>
        )}

        {/* Edit Job Description Popup */}
        {showJobDesEditForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
              <EditJobDescription onClose={() => setShowJobDesEditForm(false)} />
            </div>
          </div>
        )}

        {/* Edit Job Responsibilities Popup */}
        {showResponsibilityEditForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
              <EditKeyResponsibilities
                onClose={() => setShowResponsibilityEditForm(false)}
              />
            </div>
          </div>
        )}

        {/* Edit Required qualification Popup */}
        {showRequirementEditForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
              <EditQualifications
                onClose={() => setShowRequirementEditForm(false)}
              />
            </div>
          </div>
        )}

        {/* Edit Perks & benifits Popup */}
        {showPerkEditForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
              <EditBenifits onClose={() => setShowPerkEditForm(false)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
} 