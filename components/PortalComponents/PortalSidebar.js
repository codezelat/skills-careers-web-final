import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function SideMenuSection() {
    const [activeButton, setActiveButton] = useState("Dashboard");
    const { data: session, status } = useSession();

    return (
        <>
            {/* Side Menu */}
            <div className="bg-white w-1/5 lg:w-1/5 md:w-1/5 sm:w-1/4 min-h-screen p-5 rounded-lg">
                <div className="flex flex-col space-y-4">

                    {/* Dashboard */}
                    <button
                        onClick={() => setActiveButton("Dashboard")}
                        className={`flex items-center py-2 px-3 rounded-lg font-sans ${activeButton === "Dashboard"
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
                        <Link href="/Portal/admin-dashboard" className="text-md font-medium">
                            Dashboard
                        </Link>
                    </button>

                    {/* Recruiters */}
                    {(session?.user?.role === "admin" || session?.user?.role === "jobseeker") && (
                        <button
                            onClick={() => setActiveButton("Recruiters")}
                            className={`flex items-center py-2 px-3 rounded-lg font-sans ${activeButton === "Recruiters"
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
                            <Link href="/Portal/recruiter" className="text-md font-medium">
                                Recruiters
                            </Link>
                        </button>
                    )}

                    {/* Candidates */}
                    {(session?.user?.role === "admin" || session?.user?.role === "recruiter") && (
                        <button
                            onClick={() => setActiveButton("Candidates")}
                            className={`flex items-center py-2 px-3 rounded-lg font-sans ${activeButton === "Candidates"
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
                            <Link href="/adminPortal/candidates" className="text-md font-medium">
                                Candidates
                            </Link>
                        </button>
                    )}

                    {/* Jobs */}
                    <button
                        onClick={() => setActiveButton("Job Posts")}
                        className={`flex items-center py-2 px-3 rounded-lg font-sans ${activeButton === "Job Posts"
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
                        <Link href="/jobs" className="text-md font-medium">
                            Job Posts
                        </Link>
                    </button>

                    {/* Analytics */}
                    {session?.user?.role === "admin" && (
                        <button
                            onClick={() => setActiveButton("Analytics")}
                            className={`flex items-center py-2 px-3 rounded-lg font-sans ${activeButton === "Analytics"
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
                            <Link href="/adminPortal/analytics" className="text-md font-medium">
                                Analytics
                            </Link>
                        </button>
                    )}

                    {/* Membership */}
                    {session?.user?.role === "admin" && (
                        <button
                            onClick={() => setActiveButton("Memberships")}
                            className={`flex items-center py-2 px-3 rounded-lg font-sans ${activeButton === "Memberships"
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
                            <Link
                                href="/adminPortal/membership"
                                className="text-md font-medium"
                            >
                                Memberships
                            </Link>
                        </button>
                    )}

                    {/* Annoucements */}
                    <button
                        onClick={() => setActiveButton("Announcements")}
                        className={`flex items-center py-2 px-3 rounded-lg font-sans ${activeButton === "Announcements"
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
                        <Link
                            href="/adminPortal/annoucement"
                            className="text-md font-medium"
                        >
                            Announcements
                        </Link>
                    </button>

                    {/* Press release */}
                    <button
                        onClick={() => setActiveButton("Press Releases")}
                        className={`flex items-center py-2 px-3 rounded-lg font-sans ${activeButton === "Press Releases"
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
                        <Link
                            href="/adminPortal/pressRelease"
                            className="text-md font-medium"
                        >
                            Press Releases
                        </Link>
                    </button>

                    {/* My profile */}
                    <button
                        onClick={() => setActiveButton("My Profile")}
                        className={`flex items-center py-2 px-3 rounded-lg font-sans ${activeButton === "My Profile"
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
                        <Link href="/adminPortal/myProfile" className="text-md font-medium">
                            My Profile
                        </Link>
                    </button>

                    {/* Help & contact */}
                    <button
                        onClick={() => setActiveButton("Help & Contact")}
                        className={`flex items-center py-2 px-3 rounded-lg font-sans ${activeButton === "Help & Contact"
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
                        <Link
                            href="/adminPortal/helpContact"
                            className="text-md font-medium"
                        >
                            Help & Contact
                        </Link>
                    </button>

                    {/* Settings */}
                    <button
                        onClick={() => setActiveButton("Settings")}
                        className={`flex items-center py-2 px-3 rounded-lg font-sans ${activeButton === "Settings"
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
                        <Link href="/adminPortal/setting" className="text-md font-medium">
                            Settings
                        </Link>
                    </button>

                    {/* Logout */}
                    <button
                        onClick={() => setActiveButton("Logout")}
                        className={`flex items-center py-2 px-3 rounded-lg font-sans ${activeButton === "Logout"
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
                        <Link href="/logout" className="text-md font-medium">
                            Logout
                        </Link>
                    </button>
                </div>
            </div>
        </>
    );
}
