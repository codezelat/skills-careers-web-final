"use client"
import { useSession } from "next-auth/react";
import RecruiterSettings from "./recruiterSettings";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    return(
        <>
        {session?.user?.role === "recruiter" && (
            <RecruiterSettings/>
        )}
        </>
    )
}