"use client"
import BookingAdminPage from "@/components/PortalComponents/bookingAdminPage";
import BookingRecruiterPage from "@/components/PortalComponents/bookingRecruiterPage";
import { useSession } from "next-auth/react";

export default function BookingRecordPage() {

    const { data: session, status } = useSession();

    return (
        <>
            {session?.user?.role === "admin" && (
                <BookingAdminPage/>
            )}
            {session?.user?.role === "recruiter" && (
                <BookingRecruiterPage/>
            )}
        </>
    )
}