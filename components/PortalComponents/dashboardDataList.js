'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InquiryCard from "./inquiryCard";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import Link from "next/link";
import Error from "next/error";
import PortalLoading from "@/app/Portal/loading";
import JobCard from "./portalJobCard";
import PortalApplicationCard from "./portalApplicationCard";

export default function DashboardDataList() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [inquiries, setInquiries] = useState([]);
  const [jobapplications, setJobapplication] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [filteredJobApplications, setFilteredJobApplications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
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

  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  });

  // fetch recruiter posted jobs
  useEffect(() => {
    if (session?.user?.email) {
      const fetchJobs = async () => {
        try {
          const recruiterResponse = await fetch(`/api/recruiterdetails/get?userId=${session.user.id}`);
          if (!recruiterResponse.ok) throw new Error("Failed to fetch recruiter");
          const recruiterData = await recruiterResponse.json();
          setRecruiterDetails(recruiterData);

          const response = await fetch(
            `/api/job/all?recruiterId=${recruiterData.id}&showAll=true`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch jobs.");
          }
          const data = await response.json();
          setJobs(data.jobs);
          console.log("jobs", data)
        } catch (err) {
          setError(err.message);
          console.error("Error fetching jobs:", err);
        } finally {
          // setLoading(false);
        }
      };
      fetchJobs();
    }
  }, [session]);

  // fetch candidate applied job applications
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;

      try {
        const jobseekerUrl = `/api/jobseekerdetails/get?userId=${session.user.id}`;
        const jobseekerResponse = await fetch(jobseekerUrl);
        if (!jobseekerResponse.ok) throw new Error('Failed to fetch jobseeker');
        const jobseekerData = await jobseekerResponse.json();

        const applicationUrl = `/api/applications/get?jobseekerId=${jobseekerData.jobseeker._id}`;
        const applicationResponse = await fetch(applicationUrl);
        if (!applicationResponse.ok) throw new Error('Failed to fetch');
        const applicationdata = await applicationResponse.json();
        console.log("application : ", applicationdata);

        if (applicationdata.success) {
          const formatted = applicationdata.applications.map(app => ({
            ...app,
            id: app._id.toString(),
            date: new Date(app.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }).toUpperCase()
          }));

          setApplications(formatted);
          setFilteredApplications(formatted);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchData();
    }
  }, [session?.user?.id]);

  // fetch admin inquiries
  useEffect(() => {
    if (session?.user?.email) {
      const fetchInquiries = async () => {
        try {
          setIsLoading(true);
          const response = await fetch("/api/inquiry/all");

          if (!response.ok) {
            throw new Error("Failed to fetch Inquiries.");
          }

          const data = await response.json();
          setInquiries(data.inquiries);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchInquiries();
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchFilteredInquiries = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `/api/inquiry/all?id=${session.user.id}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch Inquiries.");
          }

          const data = await response.json();
          setFilteredInquiries(data.inquiries);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchFilteredInquiries();
    }
  }, [session]);

  const handleInquirySelect = (inquiry) => {
    setSelectedInquiry(inquiry);
  };

  const handleCloseInquiry = () => {
    setSelectedInquiry(null);
  };

  if (isLoading) {
    return <PortalLoading />;
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-3xl p-4 mt-10">
        {/* content */}

        {/* inquiry list */}
        {session?.user?.role === "admin" && (
          <>
            <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
              <p>Help & Contact inquires</p>
              <Link href="/Portal/inquiries">
                <p className="flex">
                  View All
                  <span className="ml-3 mt-1">
                    <IoIosArrowDroprightCircle />
                  </span>
                </p>
              </Link>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[#8A93BE] text-base font-semibold text-left">
                    <th className="py-3 pl-12 w-[25%]">Profile Name</th>
                    <th className="py-3 w-[20%]">User Type</th>
                    <th className="py-3 w-[20%]">Date</th>
                    <th className="py-3 w-[20%]">Time</th>
                    <th className="py-3 w-[15%]">Action</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="grid gap-4 grid-cols-1">
              {inquiries.length > 0 ? (
                inquiries.map((inquiry, index) => (
                  <InquiryCard
                    key={index}
                    inquiry={inquiry}
                    onViewInquiry={() => handleInquirySelect(inquiry)}
                  />
                ))
              ) : (
                <p className="text-lg text-center font-bold text-red-500 py-20">
                  No Inquiries found.
                </p>
              )}
            </div>
          </>
        )}

        {/* Latest Application list */}
        {session?.user?.role === "jobseeker" && (
          <>
            <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
              <p>Latest Applications</p>
              <Link href="/Portal/jobApplications">
                <p className="flex">
                  View All
                  <span className="ml-3 mt-1">
                    <IoIosArrowDroprightCircle />
                  </span>
                </p>
              </Link>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[#8A93BE] text-base font-semibold text-left">
                    <th className="py-3 w-[20%]">Position</th>
                    <th className="py-3 w-[20%]">Recruiter Name</th>
                    <th className="py-3 w-[20%]">Applied Date</th>
                    <th className="py-3 w-[20%]">Status</th>
                    <th className="py-3 w-[20%]">Actions</th>
                  </tr>
                </thead>
              </table>
            </div>

            {/* Application data  */}
            <div className="grid gap-4 grid-cols-1">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((application) => (
                  <PortalApplicationCard
                    key={application.id}
                    application={application}
                  />
                ))
              ) : (
                <p className="text-lg text-center font-bold text-red-500 py-20">
                  No applications found.
                </p>
              )}
            </div>
          </>
        )}

        {/* Latest job post list */}
        {session?.user?.role === "recruiter" && (
          <>
            <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
              <p>Latest Job Posts</p>
              <Link href="/Portal/jobsRecruiter">
                <p className="flex">
                  View All
                  <span className="ml-3 mt-1">
                    <IoIosArrowDroprightCircle />
                  </span>
                </p>
              </Link>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[#8A93BE] text-base font-semibold text-left">
                    <th className="py-3 w-[3%]"></th>
                    <th className="py-3 w-[24.25%]">Position</th>
                    <th className="py-3 w-[24.25%]">Published Date</th>
                    <th className="py-3 w-[24.25%]">Applications</th>
                    <th className="py-3 w-[24.25%]">Actions</th>
                  </tr>
                </thead>
              </table>
            </div>
            {/* Job posts data  */}
            <div className="grid gap-4 grid-cols-1">
              {jobs.length > 0 ? (
                jobs
                  .map((job, index) => (
                    <JobCard
                      key={index}
                      job={job}
                    />
                  ))
              ) : (
                <p className="text-lg text-center font-bold text-red-500 py-20">
                  No jobs found.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
