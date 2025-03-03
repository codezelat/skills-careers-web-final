
import React from "react";
import DashboardStats from "@/components/PortalComponents/dashboardStats";
import DashboardDataList from "@/components/PortalComponents/dashboardDataList";
import DashboardCharts from "@/components/PortalComponents/dashboardCharts";

export default function DashBoard() {
  return (
    <>
    {/* cards */}
      <DashboardStats />

      {/* Charts and Tables */}
      <DashboardCharts />
      
      {/*Data lists */}
      {/* <DashboardDataList /> */}
    </>
  );
}
