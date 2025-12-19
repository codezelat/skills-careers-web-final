"use client"

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

async function applyJob(
  jobId,
  jobTitle,
  recruiterId,
  jobseekerId,
  cvFile,
  firstName,
  lastName,
  email,
  contactNumber
) {
  const formData = new FormData();
  formData.append("jobId", jobId);
  formData.append("jobTitle", jobTitle);
  formData.append("recruiterId", recruiterId);
  formData.append("jobseekerId", jobseekerId);
  formData.append("cv", cvFile);
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("email", email);
  formData.append("contactNumber", contactNumber);

  const response = await fetch("/api/jobapplication/add", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export default function JobApplicationForm({ onClose, jobid }) {
  const [selectedJob, setSelectedJob] = useState("");
  const [resume, setResume] = useState(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect recruiters from accessing this page
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "recruiter") {
      Swal.fire({
        icon: "warning",
        title: "Access Denied",
        text: "Recruiters cannot apply for jobs",
      });
      router.push(`/jobs`); // Redirect to the jobs page or a relevant page
    }
  }, [session, status, router, jobid]);

  const [jobDetails, setJobDetails] = useState({
    id: "",
    jobTitle: "",
    recruiterId: "",
  });

  const [recruiterDetails, setRecruiterDetails] = useState({
    recruiterName: "",
    email: "",
    logo: "",
  });

  const [jobSeekerDetails, setJobseekerDetails] = useState({});

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/job/get?id=${jobid}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch job details");
        }

        setJobDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobid) {
      fetchJobDetails();
    }
  }, [jobid]);

  useEffect(() => {
    const fetchRecruiterDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/recruiterdetails/get?id=${jobDetails.recruiterId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch job details");
        }

        setRecruiterDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobDetails.recruiterId) {
      fetchRecruiterDetails();
    }
  }, [jobDetails.recruiterId]);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchJobSeekerDetails = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/jobseekerdetails/get?userId=${session.user.id}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch job details");
          }

          setJobseekerDetails(data.jobseeker);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchJobSeekerDetails();
    }
  }, [session]);

  // if (isLoading) {
  //   return <div className="text-center py-4">Loading Application Form ...</div>;
  // }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    setFileError("");

    if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      setFileError("Please upload only PDF or DOC/DOCX files");
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSize) {
      setFileError("File size should be less than 5MB");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  async function submitHandler(event) {
    event.preventDefault();

    const jobseekerId = jobSeekerDetails._id;

    if (!selectedFile) {
      setFileError("Please upload your CV");
      return;
    }

    if (status === "authenticated") {
      try {
        setIsSubmitting(true);
        const result = await applyJob(
          jobid,
          jobDetails.jobTitle,
          jobDetails.recruiterId,
          jobseekerId,
          selectedFile,
          firstName,
          lastName,
          email,
          contactNumber
        );

        await Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: result.message,
          confirmButtonColor: "#001571",
        });

        setFirstName("");
        setLastName("");
        setEmail("");
        setContactNumber("");
        setSelectedFile(null);

        router.push(`/jobs/${jobid}`);
      } catch (error) {
        console.log(error.message);
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: error.message,
          confirmButtonColor: "#EF4444",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else if (status === "loading") {
      Swal.fire({
        icon: "info",
        title: "Please Wait",
        text: "Please wait till user logs...",
      });
    } else if (status === "unauthenticated") {
      Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "Please Login to apply",
        confirmButtonColor: "#001571",
      });
    }
  }

  const handleCloseForm = () => {
    router.push(`/jobs/${jobid}`);
  };

  return (
    <div className="fixed w-full inset-0 flex items-end justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="relative w-full max-h-[85vh] bg-white rounded-t-lg shadow-lg overflow-y-auto p-8">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <FaTimes size={24} />
        </button>

        {isLoading ? (
          // Display loading indicator while content is loading
          <div className="flex justify-center items-center h-full">
            <p className="text-lg font-bold text-blue-900">Loading...</p>
          </div>
        ) : (
          // Display content when loading is complete
          <>
            <h2 className="text-center text-2xl font-semibold mb-6 text-blue-900">
              Apply for {recruiterDetails.recruiterName}
            </h2>

            <form onSubmit={submitHandler}>
              <div className="mb-4 mt-4">
                <label className="block text-sm font-semibold text-blue-900">
                  Select Job
                </label>
                <input
                  type="text"
                  id="jobname"
                  required
                  disabled
                  value={jobDetails.jobTitle}
                  className="mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg font-medium"
                />
              </div>

              <div className="mb-4 mt-4">
                <label className="block text-sm font-semibold text-blue-900">
                  Resume/CV
                </label>
                <div
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md transition-colors hover:bg-gray-50"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="space-y-3 text-center">
                    {/* File upload UI */}
                    <div className="flex justify-center items-center">
                      <Image
                        src="/images/downloadIcon.png"
                        alt="download"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="text-sm text-blue-900">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-blue-900 hover:text-indigo-500"
                      >
                        <span>
                          Click or drag file to this area to upload your Resume
                        </span>
                        <input
                          type="file"
                          id="cv"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                        />
                        {/* Hidden input needs label association or trigger */}
                        <label htmlFor="cv" className="absolute inset-0 cursor-pointer"></label>
                        {fileError && (
                          <p className="text-red-500 text-sm mt-1">{fileError}</p>
                        )}
                        {selectedFile && (
                          <p className="text-green-500 text-sm mt-1">
                            Selected file: {selectedFile.name}
                          </p>
                        )}
                      </label>
                    </div>
                    <p className="text-xs text-blue-900">
                      Please make sure to upload a PDF
                    </p>
                  </div>
                </div>
              </div>

              {/* Input fields for first name, last name, etc. */}
              <div>
                <label className="block text-sm mt-4 font-semibold text-blue-900">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-m focus:ring-blue-900 focus:border-blue-900 sm:text-lg"
                />
              </div>

              <div>
                <label className="block mt-4 text-sm font-semibold text-blue-900">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 sm:text-lg"
                />
              </div>

              <div className="mb-4 mt-4">
                <label className="block text-sm font-semibold text-blue-900">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-2 sm:text-lg"
                />
              </div>

              <div className="mb-6 mt-4">
                <label className="block text-sm font-semibold text-blue-900">
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contactnumber"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="mt-2 block w-full border-2 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-lg"
                />
              </div>

              <div className="flex justify-start gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-900 text-white px-4 py-2 rounded-md border-2 font-medium hover:bg-indigo-700 flex items-center gap-2 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="bg-gray-200 text-blue-900 px-4 py-2 rounded-md font-medium hover:bg-gray-300 border-blue-900 border-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back to Profile
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>

  );
}
