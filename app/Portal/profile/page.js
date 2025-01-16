"use client"

import CandidateProfile from "@/components/PortalComponents/candidateProfile";
import { useSession } from "next-auth/react";

export default function MyProfiles() {

    const { data: session, status } = useSession();

    return (
        <>
            {session?.user?.role === "jobseeker" && (
                <CandidateProfile />
            )}
        </>
    );
}
