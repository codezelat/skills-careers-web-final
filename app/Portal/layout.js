"use client";
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/PortalComponents/PortalSidebar";
import PortalHeader from "@/components/PortalComponents/PortalHeader";
import Swal from "sweetalert2";

export default function PortalLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isValidatingAccount, setIsValidatingAccount] = useState(true);
  const [accountValid, setAccountValid] = useState(false);

  // Validate user account exists in database
  useEffect(() => {
    const validateAccount = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch(`/api/users/get?id=${session.user.id}`);

          if (response.status === 404) {
            // Account has been deleted
            setIsValidatingAccount(false);
            setAccountValid(false);

            await Swal.fire({
              icon: "error",
              title: "Account Deleted",
              text: "Your account has been deleted by an administrator. You will be logged out now.",
              confirmButtonText: "OK",
              allowOutsideClick: false,
              allowEscapeKey: false,
            });

            // Force logout
            await signOut({ callbackUrl: "/login", redirect: true });
            return;
          }

          if (!response.ok) {
            throw new Error("Failed to validate account");
          }

          // Account is valid
          setAccountValid(true);
          setIsValidatingAccount(false);
        } catch (error) {
          console.error("Account validation error:", error);
          setIsValidatingAccount(false);
          setAccountValid(false);

          await Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: "Unable to verify your account. Please login again.",
            confirmButtonText: "OK",
          });

          await signOut({ callbackUrl: "/login", redirect: true });
        }
      }
    };

    if (status === "authenticated") {
      validateAccount();
    }
  }, [status, session?.user?.id]);

  // Show loading state while checking authentication or validating account
  if (
    status === "loading" ||
    (status === "authenticated" && isValidatingAccount)
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F7F7]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#001571]"></div>
          <p className="mt-4 text-[#001571] font-semibold">
            Verifying account...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // Don't render if account validation failed
  if (!accountValid) {
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
