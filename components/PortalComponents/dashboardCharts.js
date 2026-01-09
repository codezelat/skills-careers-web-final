"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import LineChart from "./lineChart";
import BarChart from "./barChart";
import PortalLoading from "@/app/Portal/loading";
import { useRouter } from "next/navigation";

// Reusable Chart Component
const ChartWidget = ({ title, target, ChartComponent, label, session }) => {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [filter, setFilter] = useState("week"); // week, month, year, custom
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (session?.user?.id && session?.user?.role) {
        if (filter === "custom" && (!startDate || !endDate)) return;

        try {
          setIsLoading(true);
          const queryParams = new URLSearchParams({
            userId: session.user.id,
            role: session.user.role,
            filter,
            target, // Fetch specific chart data
            ...(filter === "custom" && { startDate, endDate }),
          });

          const response = await fetch(`/api/analytics/weekly?${queryParams}`);
          if (response.ok) {
            const apiData = await response.json();
            setLabels(apiData.labels);
            // Dynamic Key Access: apiData.chart1 or apiData.chart2
            setData(apiData[target] || []);
          }
        } catch (error) {
          console.error(`Failed to fetch analytics for ${target}:`, error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAnalytics();
  }, [session, filter, startDate, endDate, target]);

  const FilterDropdown = () => (
    <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
      {filter === "custom" && (
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-[#001571] text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
          />
          <span className="text-gray-500 self-center">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-[#001571] text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
          />
        </div>
      )}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-[#001571] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 font-bold"
      >
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
        <option value="custom">Custom</option>
      </select>
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-3xl p-4">
      <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
        <p>{title}</p>
        <FilterDropdown />
      </div>
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <ChartComponent chartData={data} chartLabels={labels} label={label} />
      )}
    </div>
  );
};

export default function DashboardCharts() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  if (status === "loading") return <PortalLoading />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {session?.user?.role === "admin" && (
        <>
          <ChartWidget
            title="Job Posts"
            target="chart1"
            ChartComponent={LineChart}
            label="Job Posts"
            session={session}
          />
          <ChartWidget
            title="Active Users"
            target="chart2"
            ChartComponent={BarChart}
            label="New Users"
            session={session}
          />
        </>
      )}

      {session?.user?.role === "jobseeker" && (
        <>
          <ChartWidget
            title="Profile Views"
            target="chart1"
            ChartComponent={LineChart}
            label="Profile Views"
            session={session}
          />
          <ChartWidget
            title="Applied Jobs"
            target="chart2"
            ChartComponent={BarChart}
            label="Applied Jobs"
            session={session}
          />
        </>
      )}

      {session?.user?.role === "recruiter" && (
        <>
          <ChartWidget
            title="Applications"
            target="chart1"
            ChartComponent={BarChart}
            label="Applications"
            session={session}
          />
          <ChartWidget
            title="Job Posts"
            target="chart2"
            ChartComponent={LineChart}
            label="Job Posts"
            session={session}
          />
        </>
      )}
    </div>
  );
}
