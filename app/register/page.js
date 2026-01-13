"use client";

import React, { useEffect, useState } from "react";
import JobSeekerRegister from "../(signup)/jobseekersignup/page";
import RecruiterRegister from "../(signup)/recruitersignup/page";
import Loading from "../loading";
import Image from "next/image";
import Button from "@/components/Button";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

const Register = () => {
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showRoleSelectionModal, setShowRoleSelectionModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle OAuth errors from URL params
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "AccountNotFound") {
      setErrorMessage(
        "No account found. Please select your role above and try again, or register manually."
      );
      // Clear the error from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [searchParams]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "jobseeker") {
        router.push("/Portal/profile");
      } else if (session.user.role === "recruiter") {
        router.push("/Portal/dashboard");
      } else if (session.user.role === "admin") {
        router.push("/Portal/dashboard");
      }
    }
  }, [session, status, router]);

  // Handle Google Sign Up - Show role selection modal first
  const handleGoogleSignUp = async () => {
    setSelectedProvider("google");
    setShowRoleSelectionModal(true);
  };

  // Handle LinkedIn Sign Up - Show role selection modal first
  const handleLinkedInSignUp = async () => {
    setSelectedProvider("linkedin");
    setShowRoleSelectionModal(true);
  };

  // Handle role selection and proceed with sign up
  const handleRoleSelection = async (role) => {
    setShowRoleSelectionModal(false);
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Store the selected role in sessionStorage so auth callback can use it
      if (typeof window !== "undefined") {
        sessionStorage.setItem("oauth_signup_role", role);
        sessionStorage.setItem("oauth_signup_provider", selectedProvider);
      }

      // Redirect based on selected role after sign up
      const callbackUrl =
        role === "jobseeker" ? "/Portal/profile" : "/Portal/dashboard";

      // Initiate OAuth flow
      await signIn(selectedProvider, {
        callbackUrl: callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error(`Failed to sign up with ${selectedProvider}:`, error);
      setIsLoading(false);
      setErrorMessage(`An error occurred during sign up. Please try again.`);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col md:flex-row h-screen">
          {/* Left Side with Image and Intro Text */}
          <div
            className="relative hidden h-full md:flex md:w-3/5 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/loginscrn.jpg')" }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-70"></div>

            {/* Logo */}
            <div className="absolute top-9 left-9 cursor-pointer w-90 h-90">
              <a href="/">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="w-140 h-34 mx-5"
                />
              </a>
            </div>

            {/* Content */}
            <div className="flex flex-col items-start justify-end p-10 bg-blue-900 bg-opacity-30 text-white h-full w-full">
              <h1 className="text-3xl font-bold mb-5">Register</h1>
              <h2 className="text-4xl font-extrabold mb-3">SKILLS CAREERS</h2>
              <p className="text-md leading-relaxed mb-9">
                Welcome to Skill Careers, where finding your dream job or the
                right talent is just a click away.
              </p>
            </div>
          </div>
          {/* Right Side with Form */}
          <div className="flex flex-col overflow-y-auto py-8 sm:py-16 px-4 sm:px-10 w-full md:w-2/5">
            <div className="flex flex-col items-center">
              <a href="/">
                <Image
                  src="/images/logo.png"
                  alt="logo"
                  width={140}
                  height={40}
                  className="mb-8 ml-10 md:hidden"
                />
              </a>
              <p className="text-blue-900 text-center text-md font-semibold">
                Create your free account to explore job listings, connect with
                recruiters, and take the next step in your career.{" "}
              </p>
            </div>

            <div className="flex flex-col justify-center mt-12">
              {/* Job Seeker / Recruiter Selection */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setIsRecruiter(false)}
                  className={` w-full border-2 border-gray-300 rounded-lg py-4 px-2 ${
                    !isRecruiter
                      ? "bg-blue-900 text-white"
                      : "bg-gray-50 text-blue-900"
                  }`}
                >
                  <span className="flex items-center justify-center ">
                    <img
                      src="/images/tag-user.png"
                      alt="Login"
                      className="h-6 w-6 mr-5 "
                    />
                    Job Seeker
                    <img
                      src="/images/Livello_1.png"
                      alt="Login"
                      className="h-6 w-6 ml-7"
                    />
                  </span>
                </button>
                <button
                  onClick={() => setIsRecruiter(true)}
                  className={`p-4 w-full border-2 border-gray-300 rounded-lg ${
                    isRecruiter
                      ? "bg-blue-900 text-white"
                      : "bg-gray-50 text-blue-900"
                  }`}
                >
                  <span className="flex items-center justify-center ">
                    <img
                      src="/images/buliding.png"
                      alt="register"
                      className="h-6 w-6 mr-5 "
                    />
                    Recruiter
                    <img
                      src="/images/Livello_1.png"
                      alt="register"
                      className="h-6 w-6 ml-7"
                    />
                  </span>
                </button>
              </div>
              <h2 className="text-medium text-center text-blue-900 font-bold my-10">
                Join Skill Careers and Unlock New Opportunities!{" "}
              </h2>

              {/* Display Error Message */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Conditional Form Rendering */}
              {isRecruiter ? <RecruiterRegister /> : <JobSeekerRegister />}

              {/* Divider */}
              <div className="flex items-center justify-between mt-6">
                <span className="border-t border-gray-500 w-full"></span>
              </div>

              {/* Social Sign-up Options */}
              <div className="justify-items-center">
                <p className="mt-3 mb-3 text-black text-md font-medium">
                  Or continue with Google or LinkedIn.
                </p>
              </div>

              <div className="space-y-2 mt-1">
                <div className="mb-4">
                  <Button
                    onClick={handleGoogleSignUp}
                    className="bg-blue-900 hover:bg-blue-800 text-white rounded"
                  >
                    <span className="flex items-center justify-center py-1 px-5">
                      <img
                        src="/images/google-icon.png"
                        alt="Google"
                        className="h-5 w-5 mr-4"
                      />
                      Sign up with Google
                    </span>
                  </Button>
                </div>

                <div className="mt-3">
                  <Button onClick={handleLinkedInSignUp}>
                    <span className="flex items-center justify-center py-1 px-5">
                      <img
                        src="/images/linkedin-icon.png"
                        alt="LinkedIn"
                        className="h-5 w-5 mr-4"
                      />
                      Sign up with LinkedIn
                    </span>
                  </Button>
                </div>
              </div>

              {/* Login Link */}
              <p className="text-md font-medium text-center mt-4 text-black">
                Already have an account?{" "}
                <a href="/login" className="text-blue-900 font-bold">
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Role Selection Modal for Social Sign-up */}
      {showRoleSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div
              className="px-6 py-4"
              style={{ backgroundColor: "rgb(30, 64, 175)" }}
            >
              <h2 className="text-xl font-bold text-white text-center">
                Choose Your Role
              </h2>
              <p className="text-blue-100 text-sm text-center mt-1">
                Select how you'd like to continue with{" "}
                {selectedProvider === "google" ? "Google" : "LinkedIn"}
              </p>
            </div>

            {/* Role Options */}
            <div className="p-6 space-y-4">
              {/* Job Seeker Option */}
              <div
                onClick={() => handleRoleSelection("jobseeker")}
                className="cursor-pointer group relative bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 hover:border-green-400 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      Job Seeker
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Looking for career opportunities
                    </p>
                  </div>
                  <div className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Recruiter Option */}
              <div
                onClick={() => handleRoleSelection("recruiter")}
                className="cursor-pointer group relative bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      Recruiter
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Hiring talented professionals
                    </p>
                  </div>
                  <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-center">
              <button
                onClick={() => setShowRoleSelectionModal(false)}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
