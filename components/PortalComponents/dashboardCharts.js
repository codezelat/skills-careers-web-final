import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import LineChart from "./lineChart";
import BarChart from "./barChart";
import PortalLoading from "@/app/Portal/loading";
import { useRouter } from "next/navigation";

export default function DashboardCharts() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  }, [status, router]);


  return (
    <>
      {session?.user?.role === "admin" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Job Posts Chart */}
          <div className="bg-white shadow-md rounded-3xl p-4">
            <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
              <p>Job Posts</p>
              <Link href="">
                <p className="flex">This Week</p>
              </Link>
            </div>
            <LineChart />
          </div>
          {/* Active Users Chart */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
              <p>Active Users</p>
              <Link href="">
                <p className="flex">This Week</p>
              </Link>
            </div>
            <BarChart />
          </div>
        </div>
      )}

      {session?.user?.role === "jobseeker" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Job Posts Chart */}
          <div className="bg-white shadow-md rounded-3xl p-4">
            <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
              <p>Profile Views</p>
              <Link href="">
                <p className="flex">This Week</p>
              </Link>
            </div>
            <LineChart />
          </div>
          {/* Active Users Chart */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
              <p>Applied Jobs</p>
              <Link href="">
                <p className="flex">This Week</p>
              </Link>
            </div>
            <BarChart />
          </div>
        </div>
      )}

      {session?.user?.role === "recruiter" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Active Users Chart */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
              <p>Applications</p>
              <Link href="">
                <p className="flex">This Week</p>
              </Link>
            </div>
            <BarChart />
          </div>
          {/* Job Posts Chart */}
          <div className="bg-white shadow-md rounded-3xl p-4">
            <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
              <p>Job Posts</p>
              <Link href="">
                <p className="flex">This Week</p>
              </Link>
            </div>
            <LineChart />
          </div>
        </div>
      )}
    </>
  );
}
