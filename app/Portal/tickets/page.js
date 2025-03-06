"use client"
import AdminsTicketsPage from "@/components/PortalComponents/ticketsAdminPage";
import RecruitersTicketsPage from "@/components/PortalComponents/ticketsRecruiterPage";
import { useSession } from "next-auth/react";

export default function PortalTicketsPage() {

    const { data: session, status } = useSession();

    return (
        <>
            {session?.user?.role === "admin" && (
                <AdminsTicketsPage />
            )}
            {session?.user?.role === "recruiter" && (
                <RecruitersTicketsPage />
            )}
        </>
    )
}