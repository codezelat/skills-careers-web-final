"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/PortalComponents/PortalSidebar";
import PortalHeader from "@/components/PortalComponents/PortalHeader";

export default function PortalLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F7F7]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#001571]"></div>
          <p className="mt-4 text-[#001571] font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // Verify user has a valid role
  const validRoles = ["admin", "recruiter", "jobseeker"];
  if (!session?.user?.role || !validRoles.includes(session.user.role)) {
    router.push("/login");
    return null;
  }

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
