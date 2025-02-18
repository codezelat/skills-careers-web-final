"use client";
import { useState, useEffect } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useSession } from "next-auth/react";
import PortalApplicationCard from "@/components/PortalComponents/portalApplicationCard";
import JobApplicationsRecruiter from "./applicationsRecruiter";
import JobApplicationsCandidate from "./applicationsCandidate";

export default function JobApplications() {
  const { data: session, status } = useSession({ required: true });


  return (
    <>
      {session?.user?.role === "recruiter" && (
        <JobApplicationsRecruiter />
      )}
      {session?.user?.role === "jobseeker" && (
        <JobApplicationsCandidate />
      )}
    </>
  );
}