"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import JobCard from "@/components/jobCard";
import NavBar from "@/components/navBar";
import Footer from "@/components/Footer";
import Loading from "../loading";
import JobApplicationForm from "../jobs/[jobid]/apply/JobApplicationForm";

// Helper function to format address
const formatAddress = (recruiter) => {
  const { addressLine, district, province, country, location } = recruiter;
  const parts = [];

  if (addressLine) parts.push(addressLine);

  if (country === "Sri Lanka" || !country) {
    // For Sri Lanka, show district, province, country
    if (district) parts.push(district);
    if (province && province !== district) parts.push(province);
    parts.push("Sri Lanka");
  } else {
    // For other countries, show country
    if (country) parts.push(country);
  }

  // Fallback to old location field if new fields don't exist
  const formatted = parts.filter(Boolean).join(", ");
  return formatted || location || "Location not specified";
};

function RecruiterProfile({ slug }) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const router = useRouter();
  const [recruiterDetails, setRecruiterDetails] = useState({
    id: "",
  });
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiterDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch recruiter details
        const recruiterResponse = await fetch(
          `/api/recruiterdetails/get?id=${slug}`
        );
        const recruiterData = await recruiterResponse.json();
        if (!recruiterResponse.ok) {
          throw new Error(
            recruiterData.message || "Failed to fetch recruiter details"
          );
        }
        setRecruiterDetails(recruiterData);

        // Fetch jobs for this recruiter
        const jobsResponse = await fetch(`/api/job/all?recruiterId=${slug}`);
        const jobsData = await jobsResponse.json();
        if (!jobsResponse.ok) {
          throw new Error(jobsData.message || "Failed to fetch jobs");
        }
        setJobs(jobsData.jobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchRecruiterDetails();
    }
  }, [slug]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Error: {error}</p>
        <Link
          href="/recruiter"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Return to Recruiter List
        </Link>
      </div>
    );
  }

  const handleApply = (jobId) => {
    setSelectedJobId(jobId);
    setShowApplicationForm(true);
  };

  return (
    <>
      <div className="w-full space-y-5 pb-8 pt-16 flex flex-col items-center justify-center">
        {/* Recruiter Profile Header */}
        <div className="w-full max-w-[1280px] bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="h-48 sm:h-56 relative w-full">
            <Image
              src="/cover1.png"
              alt="cover"
              fill
              style={{ objectFit: "cover" }}
              className="w-full h-full"
            />
          </div>

          <div className="relative flex flex-col items-start px-6 sm:px-14">
            {/* Logo */}
            <div className="absolute -top-12 sm:-top-16 border-4 border-[#001571] bg-white rounded-full overflow-hidden w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 flex items-center justify-center z-10">
              <div className="relative w-full h-full p-2">
                <Image
                  src={recruiterDetails.logo || "/images/default-image.jpg"}
                  alt="Logo"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>

            {/* Social Links - Desktop */}
            <div className="w-full flex justify-center sm:justify-end pt-4 min-h-[60px]">
              <div className="flex flex-wrap space-x-4 items-center justify-center sm:justify-end">
                {recruiterDetails.linkedin && (
                  <a
                    href={recruiterDetails.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/linkedin-b.png"
                      alt="linkedin"
                      className="w-6 hover:opacity-80 transition-opacity"
                    />
                  </a>
                )}
                {recruiterDetails.x && (
                  <a
                    href={recruiterDetails.x}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/x-b.png"
                      alt="xapp"
                      className="w-6 hover:opacity-80 transition-opacity"
                    />
                  </a>
                )}
                {recruiterDetails.instagram && (
                  <a
                    href={recruiterDetails.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/instagram-b.png"
                      alt="instagram"
                      className="w-6 hover:opacity-80 transition-opacity"
                    />
                  </a>
                )}
                {recruiterDetails.facebook && (
                  <a
                    href={recruiterDetails.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/facebook-b.png"
                      alt="facebook"
                      className="w-6 hover:opacity-80 transition-opacity"
                    />
                  </a>
                )}
                {recruiterDetails.github && (
                  <a
                    href={recruiterDetails.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/github-b.png"
                      alt="github"
                      className="w-6 hover:opacity-80 transition-opacity"
                    />
                  </a>
                )}
                {recruiterDetails.website && (
                  <a
                    href={recruiterDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/world-b.png"
                      alt="website"
                      className="w-6 hover:opacity-80 transition-opacity"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="pl-4 sm:pl-10 pt-8 sm:pt-14">
            <h1 className="text-center sm:text-left text-2xl sm:text-4xl md:text-3xl font-bold text-black mt-8 sm:mt-12">
              {recruiterDetails.recruiterName}
            </h1>
            <p className="text-center sm:text-left text-base text-gray-600 mt-2">
              {formatAddress(recruiterDetails)}
            </p>

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
                <div className="flex items-center">
                  <Image
                    src="/reward.png"
                    width={20}
                    height={20}
                    alt="Industry"
                    className="rounded-full"
                  />
                  <p className="text-black ml-2 font-semibold text-base">
                    {recruiterDetails.category || recruiterDetails.industry}
                  </p>
                </div>
                <div className="flex items-center">
                  <Image
                    src="/attach.png"
                    width={20}
                    height={20}
                    alt="Employees"
                    className="rounded-full"
                  />
                  <p className="text-black ml-2 font-semibold text-base">
                    {recruiterDetails.employeeRange} Employees
                  </p>
                </div>
              </div>
              {/* <div className="flex justify-center sm:justify-end w-full sm:w-auto sm:pt-2">
                <button className="bg-[#001571] text-white py-3 px-4 rounded-md font-semibold">
                  Apply Now
                </button>
              </div> */}
            </div>
          </div>

          <div className="text-left space-y-4 pl-10 pr-10 mt-10">
            <h5 className="lg:text-xl md:text-xl sm:text-2xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
              Company Description
            </h5>
            <p className="text-justify">
              {recruiterDetails.companyDescription}
            </p>
          </div>

          {/* Contact Information */}
          <div className="flex flex-wrap lg:flex-nowrap md:flex-nowrap sm:flex-nowrap space-y-4 lg:space-y-0 lg:space-x-8 md:space-y-0 md:space-x-8 sm:space-y-0 sm:space-x-8 mt-8 px-8 pb-8 lg:justify-start md:justify-start sm:justify-between">
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

        <div className="w-full max-w-[1280px] px-4 sm:px-0 pt-32 pb-20">
          <h1 className="text-2xl font-bold mb-12">Open Jobs</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <JobCard key={index} job={job} onApply={handleApply} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No open jobs available at this time.
              </p>
            )}
          </div>
        </div>
      </div>

      {showApplicationForm && (
        <JobApplicationForm
          jobid={selectedJobId}
          onClose={() => setShowApplicationForm(false)}
        />
      )}
    </>
  );
}

export default RecruiterProfile;
