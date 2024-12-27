import { signOut } from "next-auth/react";
import Link from "next/link";

// AdminNavBar.js
function AdminNavBar({ activeSection, setActiveSection }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/admindashboard" },
    {
      id: "recruiters",
      label: "Recruiters",
      href: "/admindashboard/recruiters",
    },
    {
      id: "jobseekers",
      label: "Job Seekers",
      href: "/admindashboard/jobseekers",
    },
    { id: "jobs", label: "Jobs", href: "/admindashboard/jobs" },
    { id: "settings", label: "Settings", href: "#" },
  ];

  return (
    <div>
      <nav className="flex flex-col py-8 gap-7">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setActiveSection(item.id)}
            className={`text-center mx-4 ${
              activeSection === item.id
                ? "py-4 bg-purple-500 text-white font-semibold rounded-md"
                : "text-purple-600"
            }`}
          >
            {item.label}
          </Link>
        ))}

        <button
          onClick={() => signOut({ callbackUrl: "/admin" })}
          className="px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          Sign out
        </button>
      </nav>
    </div>
  );
}

export default AdminNavBar;
