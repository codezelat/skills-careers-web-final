"use client";

import NavBar from "@/components/navBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

function ApplicationForm({ jobid }) {
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
      alert("Recruiters cannot apply for jobs");
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

  const [jobSeekerDetails, setJobseekerDetails] = useState({})

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

    if (session?.user?.id) {
      fetchJobSeekerDetails();
    }
  }, [session]);

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

  if (isLoading) {
    return <div className="text-center py-4">Loading Application Form ...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

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
    if (file) validateAndSetFile(file);
  };

  // ... (keep submitHandler, but add progress simulation if needed)
  async function submitHandler(event) {
    event.preventDefault();
    const jobseekerId = session?.user?.id; // Fix: use session user id
    // ...
    // Inside submit logic:
    // Simulated progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress > 90) clearInterval(interval);
      setUploadProgress(progress);
    }, 200);

    try {
      // ... applyJob call ... (rest of logic)
      // success
      setUploadProgress(100);
      clearInterval(interval);
      // ...
    } catch (error) {
      clearInterval(interval);
      setUploadProgress(0);
      // ...
    }
  }

  // NOTE: I will apply the full component logic in replacement chunk to ensure all hooks are present.

  return (
    <div className="p-4 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#001571]">
            Apply for {jobDetails.jobTitle}
          </h1>
          <button
            onClick={handleCloseForm}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Read-only Job Details */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Recruiter</p>
          <p className="font-semibold text-[#001571]">{recruiterDetails.recruiterName}</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          {/* CV Upload Section */}
          <div>
            <label className="block text-sm font-bold text-[#001571] mb-2">
              Upload Resume/CV
            </label>

            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
                }`}
            >
              {!selectedFile ? (
                <>
                  <p className="text-gray-600 mb-2">Drag & Drop your CV here</p>
                  <p className="text-sm text-gray-400 mb-4">or</p>
                  <label className="cursor-pointer bg-[#001571] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition">
                    Browse Files
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-4">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
                </>
              ) : (
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                  <span className="text-green-700 font-medium truncate max-w-[80%]">
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}

            {/* Progress Bar */}
            {status === "loading" || isSubmitting && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-center text-gray-500 mt-1">Uploading...</p>
              </div>
            )}
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#001571] mb-1">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#001571] mb-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#001571] mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#001571] mb-1">Contact Number</label>
              <input
                type="text"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className="w-full bg-[#001571] text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? "Submitting Application..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;
