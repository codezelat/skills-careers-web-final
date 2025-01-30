'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InquiryCard from "./inquiryCard";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import Link from "next/link";
import Error from "next/error";
import PortalLoading from "@/app/Portal/loading";

export default function DashboardDataList() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [inquiries, setInquiries] = useState([]);
   const [jobapplications , setJobapplication] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [filteredJobApplications, setFilteredJobApplications] = useState([]);

  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  });

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
      const fetchJobApplications = async () => {
        try {
          setIsLoading(true);
          const response = await fetch("/api/jobapplication/all");

          if (!response.ok) {
            throw new Error("Failed to fetch jobapplication.");
          }

          const data = await response.json();
          setJobapplication(data.jobapplications);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchJobApplications();
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
  useEffect(() => {
    if (session?.user?.email) {
      const fetchFilteredJobApplications = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `/api/jobapplication/all?id=${session.user.id}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch job applications.");
          }

          const data = await response.json();
          setFilteredJobApplications(data.inquiries);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchFilteredJobApplications();
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
      <div className="bg-white shadow-md rounded-lg p-4 mt-10">
        {/* content */}
        {session?.user?.role === "admin" && (
          <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
            <p>Help & Contact inquires</p>
            <Link href="">
              <p className="flex">
                View All
                <span className="ml-3 mt-1">
                  <IoIosArrowDroprightCircle />
                </span>
              </p>
            </Link>
          </div>
        )}
        {session?.user?.role === "jobseeker" && (
          <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
            <p>Latest Applications</p>
            <Link href="">
              <p className="flex">
                View All
                <span className="ml-3 mt-1">
                  <IoIosArrowDroprightCircle />
                </span>
              </p>
            </Link>
          </div>
        )}

        {session?.user?.role === "recruiter" && (
          <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
            <p>Latest Job Posts</p>
            <Link href="">
              <p className="flex">
                View All
                <span className="ml-3 mt-1">
                  <IoIosArrowDroprightCircle />
                </span>
              </p>
            </Link>
          </div>
        )}

        {/* inquiry list */}
        {session?.user?.role === "admin" && (
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
        )}

        {session?.user?.role === "admin" && (
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
        )}

        {/* {session?.user?.role !== "admin" && (
          <div className="grid gap-4 grid-cols-1">
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map((inquiry, index) => (
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
        )} */}

        {/* Latest Application list */}
        {session?.user?.role === "jobseeker" && (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-[#8A93BE] text-base font-semibold text-left">
                  <th className="py-3 pl-12 w-[25%]">Position</th>
                  <th className="py-3 w-[20%]">Recruiter Name</th>
                  <th className="py-3 w-[20%]">Applied Date</th>
                  <th className="py-3 w-[20%]">Actions</th>
                </tr>
              </thead>
            </table>
          </div>
        )}

        {/* Application data  */}
        {/* {session?.user?.role === "jobseeker" && (
          <div className="grid gap-4 grid-cols-1">
            {inquiries.length > 0 ? (
              inquiries.map((inquiry, index) => (
                <JobApplicationCard
                  key={index}
                  inquiry={inquiry}
                  onViewInquiry={() => handleInquirySelect(inquiry)}
                />
              ))
            ) : (
              <p className="text-lg text-center font-bold text-red-500 py-20">
                No Job Application found.
              </p>
            )}
          </div>
        )} */}


        {/* Latest job post list */}
        {session?.user?.role === "recruiter" && (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-[#8A93BE] text-base font-semibold text-left">
                  <th className="py-3 pl-12 w-[25%]">Position</th>
                  <th className="py-3 w-[20%]">Published Date</th>
                  <th className="py-3 w-[20%]">Applications</th>
                  <th className="py-3 w-[20%]">Actions</th>
                </tr>
              </thead>
            </table>
          </div>
        )}
        {/* Job posts data  */}
                {/* {session?.user?.role === "jobseeker" && (
          <div className="grid gap-4 grid-cols-1">
            {inquiries.length > 0 ? (
              inquiries.map((inquiry, index) => (
                <JobPostCard
                  key={index}
                  inquiry={inquiry}
                  onViewInquiry={() => handleInquirySelect(inquiry)}
                />
              ))
            ) : (
              <p className="text-lg text-center font-bold text-red-500 py-20">
                No Job Post found.
              </p>
            )}
          </div>
        )} */}


      </div>
    </>
  );
}
