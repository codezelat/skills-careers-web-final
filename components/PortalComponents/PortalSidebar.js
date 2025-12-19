import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function SideMenuSection() {
    const [activeButton, setActiveButton] = useState("");
    const { data: session, status } = useSession();

    return (
        <>
            {/* Side Menu */}
            <div className="bg-white w-1/5 lg:w-1/5 md:w-1/5 sm:w-1/4 h-[calc(100vh-48px)] p-5 rounded-3xl text-[16px]">
                <div className="flex flex-col justify-between h-full space-y-3">

                    <div className="flex flex-col space-y-3 overflow-y-auto no-scrollbar">

                        {/* Dashboard */}
                        <Link href="/Portal/dashboard">
                            <button
                                onClick={() => setActiveButton("Dashboard")}
                                className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${activeButton === "Dashboard"
                                    ? "bg-[#001571] text-white"
                                    : "bg-white text-[#001571] hover:bg-gray-100"
                                    }`}
                            >
                                <img
                                    src="/sidebar/dashboard.png"
                                    alt="Dashboard"
                                    className={`h-5 w-5 mr-6 ${activeButton === "Dashboard" ? "filter invert brightness-0" : ""
                                        }`}
                                />
                                Dashboard
                            </button>
                        </Link>

                        {/* Recruiters */}
                        {(session?.user?.role === "admin" || session?.user?.role === "jobseeker") && (
                            <Link href={
                                session?.user?.role === "admin"
                                    ? "/Portal/recruiter"
                                    : session?.user?.role === "jobseeker"
                                        ? "/recruiters"
                                        : "#"
                            }>
                                <button
                                    onClick={() => setActiveButton("Recruiters")}
                                    className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${activeButton === "Recruiters"
                                        ? "bg-[#001571] text-white"
                                        : "bg-white text-[#001571] hover:bg-gray-100"
                                        }`}
                                >
                                    <img
                                        src="/sidebar/recruiters.png"
                                        alt="Recruiters"
                                        className={`h-5 w-5 mr-6 ${activeButton === "Recruiters" ? "filter invert brightness-0" : ""
                                            }`}
                                    />
                                    Recruiters
                                </button>
                            </Link>
                        )}

                        {/* Candidates */}
                        {(session?.user?.role === "admin" || session?.user?.role === "recruiter") && (
                            <Link href="/Portal/candidates">
                                <button
                                    onClick={() => setActiveButton("Candidates")}
                                    className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${activeButton === "Candidates"
                                        ? "bg-[#001571] text-white"
                                        : "bg-white text-[#001571] hover:bg-gray-100"
                                        }`}
                                >
                                    <img
                                        src="/sidebar/candidates.png"
                                        alt="Candidates"
                                        className={`h-5 w-5 mr-6 ${activeButton === "Candidates" ? "filter invert brightness-0" : ""
                                            }`}
                                    />
                                    Candidates
                                </button>
                            </Link>
                        )}

                        {/* Jobs */}
                        <Link href={
                            session?.user?.role === "admin"
                                ? "/Portal/jobsAdmin"
                                : session?.user?.role === "recruiter"
                                    ? "/Portal/jobsRecruiter"
                                    : session?.user?.role === "jobseeker"
                                        ? "/jobs"
                                        : "#"
                        }>
                            <button
                                onClick={() => setActiveButton("Job Posts")}
                                className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${activeButton === "Job Posts"
                                    ? "bg-[#001571] text-white"
                                    : "bg-white text-[#001571] hover:bg-gray-100"
                                    }`}
                            >
                                <img
                                    src="/sidebar/jobposts.png"
                                    alt="Job Posts"
                                    className={`h-5 w-5 mr-6 ${activeButton === "Job Posts" ? "filter invert brightness-0" : ""
                                        }`}
                                />
                                Job Posts
                            </button>
                        </Link>

                        {/* Applications */}
                        {(session?.user?.role === "jobseeker" || session?.user?.role === "recruiter") && (
                            <Link href="/Portal/jobApplications">
                                <button
                                    onClick={() => setActiveButton("Applications")}
                                    className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${activeButton === "Applications"
                                        ? "bg-[#001571] text-white"
                                        : "bg-white text-[#001571] hover:bg-gray-100"
                                        }`}
                                >
                                    <img
                                        src="/sidebar/pressrelease.png"
                                        alt="Candidates"
                                        className={`h-5 w-5 mr-6 ${activeButton === "Applications" ? "filter invert brightness-0" : ""
                                            }`}
                                    />
                                    Applications
                                </button>
                            </Link>
                        )}



                        {/* Tickets */}
                        {(session?.user?.role === "admin" || session?.user?.role === "recruiter") && (
                            <Link href="/Portal/tickets">
                                <button
                                    onClick={() => setActiveButton("Events")}
                                    className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${activeButton === "Events"
                                        ? "bg-[#001571] text-white"
                                        : "bg-white text-[#001571] hover:bg-gray-100"
                                        }`}
                                >
                                    <img
                                        src="/sidebar/ticketIcon.png"
                                        alt="Candidates"
                                        className={`h-5 w-5 mr-6 ${activeButton === "Events" ? "filter invert brightness-0" : ""
                                            }`}
                                    />
                                    Events
                                </button>
                            </Link>
                        )}

                        {/*Booking record*/}
                        {(session?.user?.role === "admin" || session?.user?.role === "recruiter") && (
                            <Link href="/Portal/bookingRecord">
                                <button
                                    onClick={() => setActiveButton("Booking Record")}
                                    className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${activeButton === "Booking Record"
                                        ? "bg-[#001571] text-white"
                                        : "bg-white text-[#001571] hover:bg-gray-100"
                                        }`}
                                >
                                    <img
                                        src="/sidebar/ticketIcon.png"
                                        alt="Candidates"
                                        className={`h-5 w-5 mr-6 ${activeButton === "Booking Record" ? "filter invert brightness-0" : ""
                                            }`}
                                    />
                                    Booking Record
                                </button>
                            </Link>
                        )}

                        {/* Analytics */}
                        {/* {session?.user?.role === "admin" && (
                            <Link href="/adminPortal/analytics">
                                <button
                                    onClick={() => setActiveButton("Analytics")}
                                    className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${activeButton === "Analytics"
                                        ? "bg-[#001571] text-white"
                                        : "bg-white text-[#001571] hover:bg-gray-100"
                                        }`}
                                >
                                    <img
                                        src="/sidebar/analytics.png"
                                        alt="Analytics"
                                        className={`h-5 w-5 mr-6 ${activeButton === "Analytics" ? "filter invert brightness-0" : ""
                                            }`}
                                    />
                                    Analytics
                                </button>
                            </Link>
                        )} */}

                        {/* Membership */}
                        {/* {session?.user?.role === "admin" && (
                            <Link href="/adminPortal/membership" >
                                <button
                                    onClick={() => setActiveButton("Memberships")}
                                    className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${activeButton === "Memberships"
                                        ? "bg-[#001571] text-white"
                                        : "bg-white text-[#001571] hover:bg-gray-100"
                                        }`}
                                >
                                    <img
                                        src="/sidebar/membership.png"
                                        alt="Memberships"
                                        className={`h-5 w-5 mr-6 ${activeButton === "Memberships"
                                            ? "filter invert brightness-0"
                                            : ""
                                            }`}
                                    />
                                    Memberships
                                </button>
                            </Link>
                        )} */}

                        {/* Annoucements */}
                        <Link href="/Portal/annoucements">
                            <button
                                onClick={() => setActiveButton("Announcements")}
                                className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${activeButton === "Announcements"
                                    ? "bg-[#001571] text-white"
                                    : "bg-white text-[#001571] hover:bg-gray-100"
                                    }`}
                            >
                                <img
                                    src="/sidebar/annoucements.png"
                                    alt="Announcements"
                                    className={`h-5 w-5 mr-6 ${activeButton === "Announcements"
                                        ? "filter invert brightness-0"
                                        : ""
                                        }`}
                                />
                                Announcements
                            </button>
                        </Link>

                        {/* Press release */}
                        <Link href="/Portal/pressrelease">
                            <button
                                onClick={() => setActiveButton("Press Releases")}
                                className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${activeButton === "Press Releases"
                                    ? "bg-[#001571] text-white"
                                    : "bg-white text-[#001571] hover:bg-gray-100"
                                    }`}
                            >
                                <img
                                    src="/sidebar/pressrelease.png"
                                    alt="Press Releases"
                                    className={`h-5 w-5 mr-6 ${activeButton === "Press Releases"
                                        ? "filter invert brightness-0"
                                        : ""
                                        }`}
                                />
                                Press Releases
                            </button>
                        </Link>

                        {/* My profile */}
                        <Link href="/Portal/profile">
                            <button
                                onClick={() => setActiveButton("My Profile")}
                                className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${activeButton === "My Profile"
                                    ? "bg-[#001571] text-white"
                                    : "bg-white text-[#001571] hover:bg-gray-100"
                                    }`}
                            >
                                <img
                                    src="/sidebar/myprofile.png"
                                    alt="My Profile"
                                    className={`h-5 w-5 mr-6 ${activeButton === "My Profile" ? "filter invert brightness-0" : ""
                                        }`}
                                />
                                My Profile
                            </button>
                        </Link>

                        {/* Help & contact */}
                        <Link href="/Portal/inquiries">
                            <button
                                onClick={() => setActiveButton("Help & Contact")}
                                className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${activeButton === "Help & Contact"
                                    ? "bg-[#001571] text-white"
                                    : "bg-white text-[#001571] hover:bg-gray-100"
                                    }`}
                            >
                                <img
                                    src="/sidebar/helpandcontact.png"
                                    alt="Help & Contact"
                                    className={`h-5 w-5 mr-6 ${activeButton === "Help & Contact"
                                        ? "filter invert brightness-0"
                                        : ""
                                        }`}
                                />
                                Help & Contact
                            </button>
                        </Link>

                        {/* Settings */}
                        <Link href="/Portal/settings">
                            <button
                                onClick={() => setActiveButton("Settings")}
                                className={`flex w-full items-center py-4 px-6 rounded-2xl font-sans text-md font-medium ${activeButton === "Settings"
                                    ? "bg-[#001571] text-white"
                                    : "bg-white text-[#001571] hover:bg-gray-100"
                                    }`}
                            >
                                <img
                                    src="/sidebar/settings.png"
                                    alt="Settings"
                                    className={`h-5 w-5 mr-6 ${activeButton === "Settings" ? "filter invert brightness-0" : ""
                                        }`}
                                />
                                Settings
                            </button>
                        </Link>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className={`flex items-center py-4 px-6 rounded-2xl font-sans ${activeButton === "Logout"
                            ? "bg-[#001571] text-white"
                            : "bg-white text-[#001571] hover:bg-gray-100"
                            }`}
                    >
                        <img
                            src="/sidebar/logout.png"
                            alt="Logout"
                            className={`h-5 w-5 mr-6 ${activeButton === "Logout" ? "filter invert brightness-0" : ""
                                }`}
                        />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
