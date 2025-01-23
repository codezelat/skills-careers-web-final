"use client"

import AdminProfile from "@/components/PortalComponents/adminProfile";
import CandidateProfile from "@/components/PortalComponents/candidateProfile";
import RecruiterProfile from "@/components/PortalComponents/recruiterProfile";
import { useSession } from "next-auth/react";

export default function MyProfiles() {

    const { data: session, status } = useSession();

    return (
        <>
            {session?.user?.role === "jobseeker" && (
                <CandidateProfile/>
            )}
            {session?.user?.role === "recruiter" && (
                <RecruiterProfile/>
            )}
            {session?.user?.role === "admin" && (
                <AdminProfile/>
            )}
        </>
    );
}
