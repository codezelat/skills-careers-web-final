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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    setFileError("");

    if (file) {
      if (
        ![
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type)
      ) {
        setFileError("Please upload only PDF or DOC/DOCX files");
        setSelectedFile(null);
        event.target.value = null;
        return;
      }

      if (file.size > maxSize) {
        setFileError("File size should be less than 5MB");
        setSelectedFile(null);
        event.target.value = null;
        return;
      }

      setSelectedFile(file);
    }
  };

  async function submitHandler(event) {
    event.preventDefault();

    const jobseekerId = id;

    if (!selectedFile) {
      setFileError("Please upload your CV");
      return;
    }

    if (status === "authenticated") {
      try {
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
        console.log(result);
        alert(result.message);

        setFirstName("");
        setLastName("");
        setEmail("");
        setContactNumber("");
        setSelectedFile(null);

        router.push(`/jobs/${jobid}`);
      } catch (error) {
        console.log(error.message);
        alert(error.message);
      }
    } else if (status === "loading") {
      alert("Please wait till user logs...");
    } else if (status === "unauthenticated") {
      alert("Please Login to apply");
    }
  }

  const handleCloseForm = () => {
    router.push(`/jobs/${jobid}`);
  };

  return (
    <>
      <div className="p-4">

        <div className="grid justify-items-center bg-white shadow-lg rounded-lg p-4 m-2">
          <button
            onClick={handleCloseForm}
            className="px-2 py-1 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
          >
            close
          </button>
          <h1 className="text-2xl font-bold mb-8">
            Applying  {recruiterDetails.recruiterName} - {jobSeekerDetails.firstName || "lol"}
          </h1>
          <p className="text-base font-bold text-gray-600 mb-1">
            Job Name: {jobDetails.jobTitle}
          </p>

          <form onSubmit={submitHandler}>
            <div>
              <p
                htmlFor="jobname"
                className="text-base font-bold text-black mb-1"
              >
                Job Name
              </p>
              <input
                type="text"
                id="jobname"
                required
                disabled
                value={jobDetails.jobTitle}
                className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
              />
            </div>

            <div className="mb-4">
              <p htmlFor="cv" className="text-base font-bold text-black mb-1">
                Upload Resume/CV
              </p>
              <input
                type="file"
                id="cv"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="w-96"
              />
              {fileError && (
                <p className="text-red-500 text-sm mt-1">{fileError}</p>
              )}
              {selectedFile && (
                <p className="text-green-500 text-sm mt-1">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>

            <div>
              <p
                htmlFor="firstname"
                className="text-base font-bold text-black mb-1"
              >
                First Name
              </p>
              <input
                type="text"
                id="firstname"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
              />
            </div>

            <div>
              <p
                htmlFor="lastname"
                className="text-base font-bold text-black mb-1"
              >
                Last Name
              </p>
              <input
                type="text"
                id="lastname"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
              />
            </div>

            <div>
              <p htmlFor="email" className="text-base font-bold text-black mb-1">
                Email
              </p>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
              />
            </div>

            <div>
              <p
                htmlFor="contactnumber"
                className="text-base font-bold text-black mb-1"
              >
                Contact Number
              </p>
              <input
                type="text"
                id="contactnumber"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
              />
            </div>

            <button className="w-96 px-4 py-2 mt-5 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ApplicationForm;
