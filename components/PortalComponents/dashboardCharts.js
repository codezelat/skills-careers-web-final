"use client";
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
  const [chartData, setChartData] = useState({
    labels: [],
    chart1: [],
    chart2: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (session?.user?.id && session?.user?.role) {
        try {
          const response = await fetch(
            `/api/analytics/weekly?userId=${session.user.id}&role=${session.user.role}`
          );
          if (response.ok) {
            const data = await response.json();
            setChartData(data);
          }
        } catch (error) {
          console.error("Failed to fetch analytics:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAnalytics();
  }, [session]);

  if (isLoading) return <PortalLoading />;

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
            <LineChart chartData={chartData.chart1} chartLabels={chartData.labels} label="Job Posts" />
          </div>
          {/* Active Users Chart */}
          <div className="bg-white shadow-md rounded-3xl p-4">
            <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
              <p>Active Users</p>
              <Link href="">
                <p className="flex">This Week</p>
              </Link>
            </div>
            <BarChart chartData={chartData.chart2} chartLabels={chartData.labels} label="New Users" />
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
            <LineChart chartData={chartData.chart1} chartLabels={chartData.labels} label="Profile Views" />
          </div>
          {/* Active Users Chart */}
          <div className="bg-white shadow-md rounded-3xl p-4">
            <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
              <p>Applied Jobs</p>
              <Link href="">
                <p className="flex">This Week</p>
              </Link>
            </div>
            <BarChart chartData={chartData.chart2} chartLabels={chartData.labels} label="Applied Jobs" />
          </div>
        </div>
      )}

      {session?.user?.role === "recruiter" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Active Users Chart */}
          <div className="bg-white shadow-md rounded-3xl p-4">
            <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
              <p>Applications</p>
              <Link href="">
                <p className="flex">This Week</p>
              </Link>
            </div>
            <BarChart chartData={chartData.chart1} chartLabels={chartData.labels} label="Applications" />
          </div>
          {/* Job Posts Chart */}
          <div className="bg-white shadow-md rounded-3xl p-4">
            <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
              <p>Job Posts</p>
              <Link href="">
                <p className="flex">This Week</p>
              </Link>
            </div>
            <LineChart chartData={chartData.chart2} chartLabels={chartData.labels} label="Job Posts" />
          </div>
        </div>
      )}
    </>
  );
}
