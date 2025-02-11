"use client"
import { useSession } from "next-auth/react";
import RecruiterSettings from "./recruiterSettings";
import CandidateSettings from "./candidateSettings";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    return(
        <>
        {session?.user?.role === "recruiter" && (
            <RecruiterSettings/>
        )}
        {session?.user?.role === "jobseeker" && (
            <CandidateSettings/>
        )}
        </>
    )
}