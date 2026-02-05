"use client";

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
  const [profileMissing, setProfileMissing] = useState(false);
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
          const response = await fetch(
            `/api/jobseekerdetails/get?userId=${session.user.id}`
          );
          const data = await response.json();

          if (!response.ok) {
            if (response.status === 404) {
              if (session?.user?.role !== "admin") {
                setProfileMissing(true);
              }
              return;
            }
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

  // Auto-fill form fields with job seeker profile details
  useEffect(() => {
    // Check if we have a saved draft for this job
    const savedJobId = localStorage.getItem("savedApplication_jobId");

    // Only auto-fill from profile if NO draft exists for this job
    if (savedJobId !== jobid && jobSeekerDetails && Object.keys(jobSeekerDetails).length > 0) {
      setFirstName(
        jobSeekerDetails.firstName || session?.user?.firstName || ""
      );
      setLastName(jobSeekerDetails.lastName || session?.user?.lastName || "");
      setEmail(jobSeekerDetails.email || session?.user?.email || "");
      setContactNumber(jobSeekerDetails.contactNumber || "");
    }
  }, [jobSeekerDetails, session, jobid]);

  // Restore form data from localStorage if available
  useEffect(() => {
    const savedJobId = localStorage.getItem("savedApplication_jobId");
    if (savedJobId === jobid) {
      const savedFirstName = localStorage.getItem("savedApplication_firstName");
      const savedLastName = localStorage.getItem("savedApplication_lastName");
      const savedEmail = localStorage.getItem("savedApplication_email");
      const savedContactNumber = localStorage.getItem("savedApplication_contactNumber");

      if (savedFirstName) setFirstName(savedFirstName);
      if (savedLastName) setLastName(savedLastName);
      if (savedEmail) setEmail(savedEmail);
      if (savedContactNumber) setContactNumber(savedContactNumber);

      // optional: clear storage after restoring
      // localStorage.removeItem("savedApplication_jobId");
      // localStorage.removeItem("savedApplication_firstName");
      // ...
    }
  }, [jobid]);

  // if (isLoading) {
  //   return <div className="text-center py-4">Loading Application Form ...</div>;
  // }

  if (profileMissing) {
    return (
      <div className="fixed w-full inset-0 flex items-end justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="relative w-full max-h-[85vh] bg-white rounded-t-lg shadow-lg overflow-y-auto p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          >
            <FaTimes size={24} />
          </button>
          <div className="mb-4 text-yellow-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-blue-900">
            Profile Incomplete
          </h2>
          <p className="mb-6 text-gray-600 max-w-md">
            You need to complete your job seeker profile before you can apply for
            jobs. This helps recruiters know more about you.
          </p>
          <button
            onClick={() => {
              // Close the modal first? Or just redirect?
              // Redirecting is better
              router.push("/profile/edit");
            }}
            className="bg-blue-900 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-800 transition-colors shadow-md"
          >
            Create My Profile
          </button>
        </div>
      </div>
    );
  }

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

    if (status === "authenticated") {
      if (!selectedFile) {
        setFileError("Please upload your CV");
        return;
      }
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

        // Clear local storage if submission is successful
        localStorage.removeItem("savedApplication_jobId");
        localStorage.removeItem("savedApplication_firstName");
        localStorage.removeItem("savedApplication_lastName");
        localStorage.removeItem("savedApplication_email");
        localStorage.removeItem("savedApplication_contactNumber");

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
        text: "Please login to apply for this job",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#001571",
      }).then((result) => {
        if (result.isConfirmed) {
          // Save form data to localStorage
          localStorage.setItem("savedApplication_jobId", jobid);
          localStorage.setItem("savedApplication_firstName", firstName);
          localStorage.setItem("savedApplication_lastName", lastName);
          localStorage.setItem("savedApplication_email", email);
          localStorage.setItem("savedApplication_contactNumber", contactNumber);

          // Redirect to login with proper callbackUrl
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set("apply", "true");
          currentUrl.searchParams.set("jobId", jobid);

          const callbackUrl = encodeURIComponent(currentUrl.pathname + currentUrl.search);

          router.push(`/login?callbackUrl=${callbackUrl}`);
        }
      });
    }
  }

  const handleCloseForm = () => {
    // If we have query params tailored for auto-open, we might want to clean them up on close
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.get("apply")) {
      currentUrl.searchParams.delete("apply");
      currentUrl.searchParams.delete("jobId");
      router.push(currentUrl.pathname + currentUrl.search);
    }

    // Default close behavior
    if (onClose) {
      onClose();
    } else {
      router.push(`/jobs/${jobid}`);
    }
  };

  return (
    <div className="fixed w-full inset-0 flex items-end justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="relative w-full max-h-[85vh] bg-white rounded-t-lg shadow-lg overflow-y-auto p-8">
        {/* Close icon */}
        <button
          onClick={handleCloseForm}
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
                  readOnly
                  value={jobDetails.jobTitle}
                  className="mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm sm:text-lg font-medium bg-gray-50 text-gray-900 cursor-not-allowed"
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
                        htmlFor="cv"
                        className="cursor-pointer rounded-md font-medium text-blue-900 hover:text-indigo-500"
                      >
                        Click or drag file to this area to upload your Resume
                      </label>
                      <input
                        type="file"
                        id="cv"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                      />
                      {fileError && (
                        <p className="text-red-500 text-sm mt-1">
                          {fileError}
                        </p>
                      )}
                      {selectedFile && (
                        <p className="text-green-500 text-sm mt-1">
                          Selected file: {selectedFile.name}
                        </p>
                      )}
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
                  className={`bg-blue-900 text-white px-4 py-2 rounded-md border-2 font-medium hover:bg-indigo-700 flex items-center gap-2 ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
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
                  onClick={handleCloseForm}
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
