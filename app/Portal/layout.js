"use client";
import React from "react";
import SideBar from "@/components/PortalComponents/PortalSidebar";
import PortalHeader from "@/components/PortalComponents/PortalHeader";

export default function PortalLayout({ children }) {
    return (
        <div className="flex bg-[#F7F7F7] p-6 gap-6">
            {/* Sidebar */}
            <SideBar />

            {/* Main Content */}
            <div className="flex-1 bg-[#F7F7F7] h-[calc(100vh-48px)] overflow-y-auto no-scrollbar">
                {/* Header */}
                <PortalHeader />
                <div>{children}</div>
            </div>
        </div>
    );
}
