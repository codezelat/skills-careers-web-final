"use client";
import React from "react";
import { IoIosArrowDroprightCircle, IoIosArrowRoundUp } from "react-icons/io";
import Link from "next/link";
import LineChart from "@/components/PortalComponents/lineChart";
import BarChart from "@/components/PortalComponents/barChart";
import DashboardStats from "@/components/PortalComponents/dashboardStats";
import AdminInquiries from "../inquiries/page";
import InquiryCard from "@/components/PortalComponents/inquiryCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PortalLoading from "../loading";
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
      <DashboardDataList />
    </>
  );
}
