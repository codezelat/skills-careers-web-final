"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AdminNavBar from "./AdminNav";

function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState("dashboard");

  const [jobsCount, setJobsCount] = useState(0);
  const [jobApplicationsCount, setJobApplicationsCount] = useState(0);
  const [recruitersCount, setRecruitersCount] = useState(0);
  const [jobseekersCount, setJobseekersCount] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  });

  useEffect(() => {
    const fetchJobsCount = async () => {
      try {
        const response = await fetch(`/api/job/all?showAll=true`);
        if (response.ok) {
          const data = await response.json();
          setJobsCount(data.count);
        }
      } catch (error) {
        console.error("Error fetching jobs count:", error);
      }
    };
    fetchJobsCount();
  }, []);

  useEffect(() => {
    const fetchJobApplicationsCount = async () => {
      try {
        const response = await fetch(`/api/applications/all`);
        if (response.ok) {
          const data = await response.json();
          setJobApplicationsCount(data.count);
        }
      } catch (error) {
        console.error("Error fetching job applications count:", error);
      }
    };
    fetchJobApplicationsCount();
  }, []);

  useEffect(() => {
    const fetchRecruitersCount = async () => {
      try {
        const response = await fetch(`/api/recruiterdetails/all`);
        if (response.ok) {
          const data = await response.json();
          setRecruitersCount(data.count);
        }
      } catch (error) {
        console.error("Error fetching recruiters count:", error);
      }
    };
    fetchRecruitersCount();
  }, []);

  useEffect(() => {
    const fetchJobseekersCount = async () => {
      try {
        const response = await fetch(`/api/jobseekerdetails`);
        if (response.ok) {
          const data = await response.json();
          setJobseekersCount(data.count);
        }
      } catch (error) {
        console.error("Error fetching jobseekers count:", error);
      }
    };
    fetchJobseekersCount();
  }, []);

  // const renderContent = () => {
  //   switch (activeSection) {
  //     case "dashboard":
  //       return (
  //         <>
  //           <div className="flex justify-between items-center mb-6">
  //             <h2 className="text-xl text-purple-600 font-semibold">
  //               Dashboard
  //             </h2>
  //           </div>
  //           <DashboardPanel />
  //         </>
  //       );
  //     case "recruiters":
  //       return <RecruitersPanel />;
  //     case "jobs":
  //       return <JobsPanel />;
  //     case "jobseekers":
  //       return (
  //         <>
  //           <JobseekersPanel />
  //         </>
  //       );
  //     case "settings":
  //       return <div>Settings Content</div>;
  //     default:
  //       return <div>Welcome to Dashboard</div>;
  //   }
  // };

  return (
    <div className="p-4">
      <div className="h-[10vh] flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <input
          type="search"
          placeholder="Search by job name"
          className="px-2 py-2 w-96 text-center bg-slate-100 border-solid border-2 border-slate-100 outline-none rounded-lg"
        />
        <p className="text-purple-600 font-semibold">
          {session?.user?.name} | {session?.user?.email}
        </p>
      </div>

      {/* Content */}
      <div className="h-[90vh] space-y-6">
        <div className="h-full grid lg:grid-cols-5 md:grid-cols-5 sm:grid-cols-1 lg:gap-4 md:gap-4 sm:gap-0">
          <div className="bg-slate-100 mb-4 p-6 rounded-lg shadow-md">
            <AdminNavBar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>

          <div className="lg:col-span-4 md:col-span-4 sm:col-span-1 bg-slate-100 mb-4 p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-10 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-semibold text-gray-600">Jobs</p>
                <p className="text-4xl text-center text-purple-600 font-semibold my-5">
                  {jobsCount}
                </p>
              </div>
              <div className="p-10 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-semibold text-gray-600">
                  Applications
                </p>
                <p className="text-4xl text-center text-purple-600 font-semibold my-5">
                  {jobApplicationsCount}
                </p>
              </div>
              <div className="p-10 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-semibold text-gray-600">
                  Recruiters
                </p>
                <p className="text-4xl text-center text-purple-600 font-semibold my-5">
                  {recruitersCount}
                </p>
              </div>
              <div className="p-10 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-semibold text-gray-600">
                  Job Seeker
                </p>
                <p className="text-4xl text-center text-purple-600 font-semibold my-5">
                  {jobseekersCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
