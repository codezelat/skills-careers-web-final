"use client"
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "./Button";
import { useState } from "react";

function NavBar() {
  const { data: session, status } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="bg-white text-blue-950 py-4 flex   items-center justify-center">
        <div className="container flex justify-between items-center w-[1280px]">
          <Link href="/">
            <img src="/images/logo.png" alt="Logo" className="w-30" />
          </Link>
          <div className="hidden md:flex flex-1 justify-center font-semibold">
            <nav className="flex space-x-6 font-mono">
              <Link href="/">HOME</Link>
              <Link href="/recruiters">EXPLORE RECRUITERS</Link>
              <Link href="/jobs">EXPLORE JOBS</Link>
              {session?.user?.role === "recruiter" && (
                <Link href="/dashboard">DASHBOARD</Link>
              )}
              {session?.user?.role === "jobseeker" && (
                <Link href="/profile">PROFILE</Link>
              )}
              <Link href="/about">ABOUT US</Link>
              <Link href="/contact">CONTACT US</Link>
            </nav>
          </div>
          <div className="hidden md:block">
            <Link href="/register">
              <Button>
                <p className="py-2 px-6 font-mono">JOIN AS RECRUITER</p>
              </Button>
            </Link>
          </div>
          <div className="md:hidden">
            <button id="menu-toggle" onClick={toggleMenu}>
              Menu
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white p-4">
            <nav className="flex flex-col space-y-4 font-semibold">
              <Link href="/">Home</Link>
              <Link href="/recruiters">Explore Recruiters</Link>
              <Link href="/jobs">EXPLORE JOBS</Link>
              <Link href="/about-us">About Us</Link>
              <Link href="/contact-us">Contact Us</Link>
              <Link href="/register">
                <Button>
                  <p className="px-6 py-2 ">Join as Recruiter</p>
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>
      <hr className="border-t-[3px] border-blue-900" />
    </>

    // <nav className="flex gap-4 mb-6">
    //   <Link href="/" className="text-blue-500 hover:underline mx-4">
    //     Home
    //   </Link>
    //   <Link href="/recruiters" className="text-blue-500 hover:underline mx-4">
    //     Recruiters
    //   </Link>
    //   <Link href="/jobs" className="text-blue-500 hover:underline mx-4">
    //     Jobs
    //   </Link>
    //   {status === "unauthenticated" && (
    //     <div>
    //       <Link href="/login" className="text-blue-500 hover:underline mx-4">
    //         Login
    //       </Link>
    //       <Link
    //         href="/jobseekersignup"
    //         className="text-blue-500 hover:underline mx-4"
    //       >
    //         Jobseeker Signup
    //       </Link>
    //       <Link
    //         href="/recruitersignup"
    //         className="text-blue-500 hover:underline mx-4"
    //       >
    //         Recruiter Signup
    //       </Link>
    //     </div>
    //   )}

    //   {session?.user?.role === "jobseeker" && (
    //     <Link href="/profile" className="text-blue-500 hover:underline">
    //       Profile
    //     </Link>
    //   )}

    //   {session?.user?.role === "recruiter" && (
    //     <Link href="/dashboard" className="text-blue-500 hover:underline">
    //       DashBoard
    //     </Link>
    //   )}
      
    //   {session?.user?.role === "admin" && (
    //     <Link href="/admindashboard" className="text-blue-500 hover:underline">
    //       Admin DashBoard
    //     </Link>
    //   )}
    // </nav>
  );
}

export default NavBar;
