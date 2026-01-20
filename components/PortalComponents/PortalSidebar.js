import Link from "next/link";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function SideMenuSection() {
  const [activeButton, setActiveButton] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("/dashboard")) setActiveButton("Dashboard");
    else if (pathname.includes("/jobApplications"))
      setActiveButton("Applications");
    // Check before 'jobs' to avoid conflict if 'jobs' check was loose (though current 'jobs' check is specific enough)
    else if (pathname.includes("/jobs") || pathname === "/jobs")
      setActiveButton("Job Posts");
    else if (pathname.includes("/recruiter") || pathname === "/recruiters")
      setActiveButton("Recruiters");
    else if (pathname.includes("/candidates")) setActiveButton("Candidates");
    else if (pathname.includes("/tickets")) setActiveButton("Events");
    else if (pathname.includes("/bookingRecord"))
      setActiveButton("Booking Record");
    else if (pathname.includes("/annoucements"))
      setActiveButton("Announcements");
    else if (pathname.includes("/pressrelease"))
      setActiveButton("Press Releases");
    else if (pathname.includes("/profile")) setActiveButton("My Profile");
    else if (pathname.includes("/inquiries")) setActiveButton("Help & Contact");
    else if (pathname.includes("/settings")) setActiveButton("Settings");
  }, [pathname]);

  // Don't render sidebar until session is loaded
  if (status === "loading") {
    return (
      <div className="w-3/4 sm:w-1/2 lg:w-1/5 h-[calc(100vh-48px)] bg-white rounded-3xl flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001571]"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === "unauthenticated" || !session?.user?.role) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-[#001571] text-white p-4 rounded-full shadow-lg"
      >
        {isMobileMenuOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div
        className={`
                fixed lg:static top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out
                ${
                  isMobileMenuOpen
                    ? "translate-x-0"
                    : "-translate-x-full lg:translate-x-0"
                }
                bg-white w-3/4 sm:w-1/2 lg:w-1/5 h-[calc(100vh-48px)] p-5 rounded-r-3xl lg:rounded-3xl text-[16px] shadow-2xl lg:shadow-none
            `}
      >
        <div className="flex flex-col justify-between h-full space-y-3">
          <div className="flex flex-col space-y-3 overflow-y-auto no-scrollbar">
            {/* Mobile Header */}
            <div className="lg:hidden mb-6 px-4">
              <h2 className="text-xl font-bold text-[#001571]">Menu</h2>
            </div>

            {/* Dashboard */}
            <Link
              href="/Portal/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <button
                onClick={() => setActiveButton("Dashboard")}
                className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${
                  activeButton === "Dashboard"
                    ? "bg-[#001571] text-white"
                    : "bg-white text-[#001571] hover:bg-gray-100"
                }`}
              >
                <img
                  src="/sidebar/dashboard.png"
                  alt="Dashboard"
                  className={`h-5 w-5 mr-6 ${
                    activeButton === "Dashboard"
                      ? "filter invert brightness-0"
                      : ""
                  }`}
                />
                Dashboard
              </button>
            </Link>

            {/* Recruiters */}
            {(session?.user?.role === "admin" ||
              session?.user?.role === "jobseeker") && (
              <Link
                href={
                  session?.user?.role === "admin"
                    ? "/Portal/recruiter"
                    : session?.user?.role === "jobseeker"
                      ? "/recruiters"
                      : "#"
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <button
                  onClick={() => setActiveButton("Recruiters")}
                  className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${
                    activeButton === "Recruiters"
                      ? "bg-[#001571] text-white"
                      : "bg-white text-[#001571] hover:bg-gray-100"
                  }`}
                >
                  <img
                    src="/sidebar/recruiters.png"
                    alt="Recruiters"
                    className={`h-5 w-5 mr-6 ${
                      activeButton === "Recruiters"
                        ? "filter invert brightness-0"
                        : ""
                    }`}
                  />
                  Recruiters
                </button>
              </Link>
            )}

            {/* Candidates */}
            {(session?.user?.role === "admin" ||
              session?.user?.role === "recruiter") && (
              <Link
                href="/Portal/candidates"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <button
                  onClick={() => setActiveButton("Candidates")}
                  className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${
                    activeButton === "Candidates"
                      ? "bg-[#001571] text-white"
                      : "bg-white text-[#001571] hover:bg-gray-100"
                  }`}
                >
                  <img
                    src="/sidebar/candidates.png"
                    alt="Candidates"
                    className={`h-5 w-5 mr-6 ${
                      activeButton === "Candidates"
                        ? "filter invert brightness-0"
                        : ""
                    }`}
                  />
                  Candidates
                </button>
              </Link>
            )}

            {/* Jobs */}
            <Link
              href={
                session?.user?.role === "admin"
                  ? "/Portal/jobsAdmin"
                  : session?.user?.role === "recruiter"
                    ? "/Portal/jobsRecruiter"
                    : session?.user?.role === "jobseeker"
                      ? "/jobs"
                      : "#"
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <button
                onClick={() => setActiveButton("Job Posts")}
                className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${
                  activeButton === "Job Posts"
                    ? "bg-[#001571] text-white"
                    : "bg-white text-[#001571] hover:bg-gray-100"
                }`}
              >
                <img
                  src="/sidebar/jobposts.png"
                  alt="Job Posts"
                  className={`h-5 w-5 mr-6 ${
                    activeButton === "Job Posts"
                      ? "filter invert brightness-0"
                      : ""
                  }`}
                />
                Job Posts
              </button>
            </Link>

            {/* Applications */}
            {(session?.user?.role === "jobseeker" ||
              session?.user?.role === "recruiter") && (
              <Link
                href="/Portal/jobApplications"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <button
                  onClick={() => setActiveButton("Applications")}
                  className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${
                    activeButton === "Applications"
                      ? "bg-[#001571] text-white"
                      : "bg-white text-[#001571] hover:bg-gray-100"
                  }`}
                >
                  <img
                    src="/sidebar/pressrelease.png"
                    alt="Candidates"
                    className={`h-5 w-5 mr-6 ${
                      activeButton === "Applications"
                        ? "filter invert brightness-0"
                        : ""
                    }`}
                  />
                  Applications
                </button>
              </Link>
            )}

            {/* Tickets */}
            {(session?.user?.role === "admin" ||
              session?.user?.role === "recruiter") && (
              <Link
                href="/Portal/tickets"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <button
                  onClick={() => setActiveButton("Events")}
                  className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${
                    activeButton === "Events"
                      ? "bg-[#001571] text-white"
                      : "bg-white text-[#001571] hover:bg-gray-100"
                  }`}
                >
                  <img
                    src="/sidebar/ticketIcon.png"
                    alt="Candidates"
                    className={`h-5 w-5 mr-6 ${
                      activeButton === "Events"
                        ? "filter invert brightness-0"
                        : ""
                    }`}
                  />
                  Events
                </button>
              </Link>
            )}

            {/*Booking record*/}
            {(session?.user?.role === "admin" ||
              session?.user?.role === "recruiter") && (
              <Link
                href="/Portal/bookingRecord"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <button
                  onClick={() => setActiveButton("Booking Record")}
                  className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${
                    activeButton === "Booking Record"
                      ? "bg-[#001571] text-white"
                      : "bg-white text-[#001571] hover:bg-gray-100"
                  }`}
                >
                  <img
                    src="/sidebar/ticketIcon.png"
                    alt="Candidates"
                    className={`h-5 w-5 mr-6 ${
                      activeButton === "Booking Record"
                        ? "filter invert brightness-0"
                        : ""
                    }`}
                  />
                  Booking Record
                </button>
              </Link>
            )}

            {/* Annoucements */}
            <Link
              href="/Portal/annoucements"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <button
                onClick={() => setActiveButton("Announcements")}
                className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${
                  activeButton === "Announcements"
                    ? "bg-[#001571] text-white"
                    : "bg-white text-[#001571] hover:bg-gray-100"
                }`}
              >
                <img
                  src="/sidebar/annoucements.png"
                  alt="Announcements"
                  className={`h-5 w-5 mr-6 ${
                    activeButton === "Announcements"
                      ? "filter invert brightness-0"
                      : ""
                  }`}
                />
                Announcements
              </button>
            </Link>

            {/* Press release */}
            <Link
              href="/Portal/pressrelease"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <button
                onClick={() => setActiveButton("Press Releases")}
                className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${
                  activeButton === "Press Releases"
                    ? "bg-[#001571] text-white"
                    : "bg-white text-[#001571] hover:bg-gray-100"
                }`}
              >
                <img
                  src="/sidebar/pressrelease.png"
                  alt="Press Releases"
                  className={`h-5 w-5 mr-6 ${
                    activeButton === "Press Releases"
                      ? "filter invert brightness-0"
                      : ""
                  }`}
                />
                Press Releases
              </button>
            </Link>

            {/* My profile */}
            <Link
              href="/Portal/profile"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <button
                onClick={() => setActiveButton("My Profile")}
                className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${
                  activeButton === "My Profile"
                    ? "bg-[#001571] text-white"
                    : "bg-white text-[#001571] hover:bg-gray-100"
                }`}
              >
                <img
                  src="/sidebar/myprofile.png"
                  alt="My Profile"
                  className={`h-5 w-5 mr-6 ${
                    activeButton === "My Profile"
                      ? "filter invert brightness-0"
                      : ""
                  }`}
                />
                My Profile
              </button>
            </Link>

            {/* Help & contact */}
            <Link
              href="/Portal/inquiries"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <button
                onClick={() => setActiveButton("Help & Contact")}
                className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${
                  activeButton === "Help & Contact"
                    ? "bg-[#001571] text-white"
                    : "bg-white text-[#001571] hover:bg-gray-100"
                }`}
              >
                <img
                  src="/sidebar/helpandcontact.png"
                  alt="Help & Contact"
                  className={`h-5 w-5 mr-6 ${
                    activeButton === "Help & Contact"
                      ? "filter invert brightness-0"
                      : ""
                  }`}
                />
                Help & Contact
              </button>
            </Link>

            {/* Settings */}
            <Link
              href="/Portal/settings"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <button
                onClick={() => setActiveButton("Settings")}
                className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${
                  activeButton === "Settings"
                    ? "bg-[#001571] text-white"
                    : "bg-white text-[#001571] hover:bg-gray-100"
                }`}
              >
                <img
                  src="/sidebar/settings.png"
                  alt="Settings"
                  className={`h-5 w-5 mr-6 ${
                    activeButton === "Settings"
                      ? "filter invert brightness-0"
                      : ""
                  }`}
                />
                Settings
              </button>
            </Link>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={`flex items-center py-4 px-6 rounded-2xl font-sans ${
              activeButton === "Logout"
                ? "bg-[#001571] text-white"
                : "bg-white text-[#001571] hover:bg-gray-100"
            }`}
          >
            <img
              src="/sidebar/logout.png"
              alt="Logout"
              className={`h-5 w-5 mr-6 ${
                activeButton === "Logout" ? "filter invert brightness-0" : ""
              }`}
            />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
