"use client";
import React from "react";
import SideBar from "@/components/PortalComponents/PortalSidebar";
import PortalHeader from "@/components/PortalComponents/PortalHeader";

export default function PortalLayout({ children }) {
  return (
    <div className="flex bg-[#F7F7F7] p-2 sm:p-6 gap-6 relative min-h-screen">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 bg-[#F7F7F7] h-screen overflow-y-auto no-scrollbar w-full">
        {/* Header */}
        <PortalHeader />
        <div className="pb-20">{children}</div>
      </div>
    </div>
  );
}
