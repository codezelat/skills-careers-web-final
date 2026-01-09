"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "./Button";
import { useState } from "react";
import Loading from "@/app/loading";

function NavBar() {
  const { data: session, status } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // if (isLoading) {
  //   return <Loading/>;
  // }

  return (
    <header className="bg-white border-b-2 border-[#001571] w-full">
      <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <img src="/images/logo.png" alt="Logo" className="w-30" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-[#001571] font-semibold text-base lg:text-base md:text-sm sm:text-base">
          <Link
            href="/"
            className="transition duration-1000 transform hover:-translate-y-1 hover:border-b-2 border-[#001571]"
            prefetch={true}
          >
            HOME
          </Link>
          <Link
            href="/jobs"
            className="transition duration-1000 transform hover:-translate-y-1 hover:border-b-2 border-[#001571]"
            prefetch={true}
          >
            EXPLORE JOBS
          </Link>
          <Link
            href="/recruiters"
            className="transition duration-1000 transform hover:-translate-y-1 hover:border-b-2 border-[#001571]"
            prefetch={true}
          >
            EXPLORE RECRUITERS
          </Link>
          <Link
            href="/tickets"
            className="transition duration-1000 transform hover:-translate-y-1 hover:border-b-2 border-[#001571]"
            prefetch={true}
          >
            EVENTS
          </Link>
          <Link
            href="/about"
            className="transition duration-1000 transform hover:-translate-y-1 hover:border-b-2 border-[#001571]"
            prefetch={true}
          >
            ABOUT US
          </Link>
          <Link
            href="/contact"
            className="transition duration-1000 transform hover:-translate-y-1 hover:border-b-2 border-[#001571]"
            prefetch={true}
          >
            CONTACT US
          </Link>
        </nav>

        {/* Desktop Button */}
        <div className="hidden md:block">
          {status === "unauthenticated" && (
            <div className="flex flex-row items-center justify-end">
              <Link href="/login">
                <p className="py-2 px-6 text-lg font-semibold text-[#001571]">
                  Login
                </p>
              </Link>
              <Link href="/register">
                <Button>
                  <p className="py-2 px-6">SIGN UP</p>
                </Button>
              </Link>
            </div>
          )}
          {session?.user?.role === "recruiter" && (
            <Link href="/Portal/dashboard">
              <Button>
                <p className="py-2 px-6">My Dashboard</p>
              </Button>
            </Link>
          )}
          {session?.user?.role === "jobseeker" && (
            <Link href="/Portal/profile">
              <Button>
                <p className="py-2 px-6">My Profile</p>
              </Button>
            </Link>
          )}
          {session?.user?.role === "admin" && (
            <Link href="/Portal/dashboard">
              <Button>
                <p className="py-2 px-6">My Dashboard</p>
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            aria-label="Toggle Menu"
            className="text-[#001571] focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-[30px] border-t-2">
          <nav className="space-y-4 text-[#001571] font-semibold text-center">
            <Link
              href="/"
              className="block transition duration-1000 transform hover:-translate-y-1 hover:border-b-2 border-[#001571]"
            >
              HOME
            </Link>
            <Link
              href="/recruiters"
              className="block transition duration-1000 transform hover:-translate-y-1 hover:border-b-2 border-[#001571]"
            >
              EXPLORE RECRUITERS
            </Link>
            <Link
              href="/jobs"
              className="block transition duration-1000 transform hover:-translate-y-1 hover:border-b-2 border-[#001571]"
            >
              EXPLORE JOBS
            </Link>
            <Link
              href="/about"
              className="block transition duration-1000 transform hover:-translate-y-1 hover:border-b-2 border-[#001571]"
            >
              ABOUT US
            </Link>
            <Link
              href="/contact"
              className="block transition duration-1000 transform hover:-translate-y-1 hover:border-b-2 border-[#001571]"
            >
              CONTACT US
            </Link>
            <div className="">
              {status === "unauthenticated" && (
                <Link href="/register">
                  <Button>
                    <p className="py-2 px-6">JOIN AS RECRUITER</p>
                  </Button>
                </Link>
              )}
              {session?.user?.role === "recruiter" && (
                <Link href="/Portal/dashboard">
                  <Button>
                    <p className="py-2 px-6">My Dashboard</p>
                  </Button>
                </Link>
              )}
              {session?.user?.role === "jobseeker" && (
                <Link href="/Portal/profile">
                  <Button>
                    <p className="py-2 px-6">My Profile</p>
                  </Button>
                </Link>
              )}
              {session?.user?.role === "admin" && (
                <Link href="/Portal/dashboard">
                  <Button>
                    <p className="py-2 px-6">My Dashboard</p>
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>

    // <>
    //   <header className="bg-white text-blue-950 py-4 flex items-center justify-center">
    //     <div className="container flex justify-between items-center w-[1280px]">
    //       <Link href="/">
    //         <img src="/images/logo.png" alt="Logo" className="w-30" />
    //       </Link>
    //       <div className="hidden md:flex flex-1 justify-center font-bold">
    //         <nav className="flex space-x-5 text-sm">
    //           <Link href="/">HOME</Link>
    //           <Link href="/recruiters">EXPLORE RECRUITERS</Link>
    //           <Link href="/jobs">EXPLORE JOBS</Link>
    //           <Link href="/about">ABOUT US</Link>
    //           <Link href="/contact">CONTACT US</Link>
    //         </nav>
    //       </div>
    //       <div className="hidden md:block">
    //         {status === "unauthenticated" && (
    //           <Link href="/register">
    //             <Button>
    //               <p className="py-2 px-6">JOIN AS RECRUITER</p>
    //             </Button>
    //           </Link>
    //         )}
    //         {session?.user?.role === "recruiter" && (
    //           <Link href="/dashboard">
    //             <Button>
    //               <p className="py-2 px-6">My Dashboard</p>
    //             </Button>
    //           </Link>
    //         )}
    //         {session?.user?.role === "jobseeker" && (
    //           <Link href="/profile">
    //             <Button>
    //               <p className="py-2 px-6">My Profile</p>
    //             </Button>
    //           </Link>
    //         )}
    //         {session?.user?.role === "admin" && (
    //           <Link href="/admindashboard">
    //             <Button>
    //               <p className="py-2 px-6">My Dashboard</p>
    //             </Button>
    //           </Link>
    //         )}
    //       </div>
    //       {/* Mobile Menu Button */}
    //       <div className="md:hidden">
    //         <button
    //           aria-label="Toggle Menu"
    //           className="text-[#001571] focus:outline-none"
    //           onClick={() => setIsMenuOpen(!isMenuOpen)}
    //         >
    //           {isMenuOpen ? (
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               className="h-6 w-6"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               stroke="currentColor"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth="2"
    //                 d="M6 18L18 6M6 6l12 12"
    //               />
    //             </svg>
    //           ) : (
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               className="h-6 w-6"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               stroke="currentColor"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth="2"
    //                 d="M4 6h16M4 12h16m-7 6h7"
    //               />
    //             </svg>
    //           )}
    //         </button>
    //       </div>
    //     </div>

    //     {/* Mobile Navigation */}
    //     {isMenuOpen && (
    //       <div className="md:hidden bg-white py-4 border-t-2">
    //         <nav className="space-y-4 text-[#001571] font-semibold text-center">
    //           <Link
    //             href="/"
    //             className="block transition duration-1000 transform hover:-translate-y-1 hover:border-b-2 border-[#001571]"
    //           >
    //             HOME
    //           </Link>
    //           <Link
    //             href="/recruiterSearch"
    //             className="block transition duration-1000 transform hover:-translate-y-1 hover:border-b-2 border-[#001571]"
    //           >
    //             EXPLORE RECRUITERS
    //           </Link>
    //           <Link
    //             href="/aboutUs"
    //             className="block transition duration-1000 transform hover:-translate-y-1 hover:border-b-2 border-[#001571]"
    //           >
    //             ABOUT US
    //           </Link>
    //           <Link
    //             href="/contactUs"
    //             className="block transition duration-1000 transform hover:-translate-y-1 hover:border-b-2 border-[#001571]"
    //           >
    //             CONTACT US
    //           </Link>
    //           <Link href="/applyPage">
    //             <button className="w-full text-base bg-[#001571] text-white font-semibold rounded-md py-2 px-6">
    //               JOIN AS RECRUITER
    //             </button>
    //           </Link>
    //         </nav>
    //       </div>
    //     )}
    //   </header>
    //   <hr className="border-t-[3px] border-blue-900" />
    // </>

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
