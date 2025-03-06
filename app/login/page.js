"use client";

import { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import Link from "next/link";
import Image from "next/image";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import NavBar from "@/components/navBar";
import Loading from "../loading";

function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const { data: session, status } = useSession();

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const emailFromParams = searchParams.get("email");

  // Populate the email input field with the query param value
  useEffect(() => {
    if (emailFromParams && emailInputRef.current) {
      emailInputRef.current.value = emailFromParams;
    }
  }, [emailFromParams]);

  // Handle session-based redirects
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setIsLoading(true);
      if (session.user.role === "jobseeker") {
        router.push("/startingpage");
      } else if (session.user.role === "recruiter") {
        router.push("/admindashboard");
      } else if (session.user.role === "admin") {
        router.push("/admindashboard");
      }
    }
  }, [session, status, router]);

  async function submitHandler(event) {
    event.preventDefault();
    setIsLoading(true);

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    const result = await signIn("credentials", {
      redirect: false,
      email: enteredEmail,
      password: enteredPassword,
    });

    if (result && result.ok) {
      const session = await getSession(); // Get session to access user role
      const userRole = session.user.role;

      if (userRole === "jobseeker") {
        router.push("/startingpage");
      } else if (userRole === "recruiter") {
        router.push("/Portal/dashboard");
      } else if (userRole === "admin") {
        router.push("/Portal/dashboard");
      }
    } else {
      alert("Login failed. Please check your email and password.");
    }
  }

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        redirect: false,
      });
    } catch (error) {
      setErrorMessage("Failed to sign in with Google. Please try again.");
    }
  };

  // Handle Forgot Password
  const handleForgotPasswordClick = () => {
    setShowForgotPasswordPopup(true);
  };

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    setForgotPasswordLoading(true);

    try {
      const response = await fetch("/api/auth/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Failed to send reset email");

      alert("Password reset email sent. Please check your inbox.");
      setShowForgotPasswordPopup(false);
      setForgotPasswordEmail("");
    } catch (error) {
      console.error("Forgot Password Error:", error);
      alert(error.message || "Network error. Please try again.");
    } finally {
      setForgotPasswordLoading(false);
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
              <h1 className="text-3xl font-bold mb-5">Login</h1>
              <h2 className="text-4xl font-extrabold mb-3">SKILLS CAREERS</h2>
              <p className="text-md leading-relaxed mb-9">
                Welcome to Skill Careers, where finding your dream job or the
                right talent is just a click away.
              </p>
            </div>
          </div>

          {/* Right Side with Form */}
          <div className="flex flex-col justify-center md:w-2/5 p-8">
            <div className="flex flex-col items-center mb-4">
              <a href="/">
                <Image
                  src="/images/logo.png"
                  alt="logo"
                  width={140}
                  height={40}
                  className="mb-5 ml-10 md:hidden"
                />
              </a>

              <h2 className="text-xl text-blue-900 font-semibold text-center mb-2 ">
                Welcome Back! Let's Get You Started.
              </h2>
              <p className="text-blue-900 text-center text-md mt-4 mb-4 font-medium ">
                Log in to access your account and continue your career journey
                or recruitment process.
              </p>
            </div>

            <form className="space-y-4 text-blue-900" onSubmit={submitHandler}>
              <label className="block">
                <input
                  type="email"
                  id="email"
                  required
                  ref={emailInputRef}
                  className="w-full px-3 py-2 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-semibold"
                  placeholder="Email"
                />
              </label>

              <label className="block">
                <input
                  type="password"
                  id="password"
                  required
                  ref={passwordInputRef}
                  className="w-full px-3 py-2 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-semibold"
                  placeholder="Password"
                />
              </label>

              <div className="flex justify-between items-center">
                <a
                  href="#"
                  className="text-sm text-blue-900 underline mb-2 font-semibold"
                  onClick={handleForgotPasswordClick}
                >
                  Forget Password
                </a>
              </div>

              {/* Display Error Message */}
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}

              <Button className="hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <span className="flex items-center justify-center ">
                  <p>Login </p>
                  <img
                    src="/images/arrow-up.png"
                    alt="Login"
                    className="h-5 w-5 ml-4"
                  />
                </span>
              </Button>
            </form>

            <div className="flex items-center justify-between mt-6">
              <span className="border-t border-gray-500 md:w-full lg:w-full"></span>
            </div>
            <div className="justify-items-center">
              <p className="mt-3 mb-3 text-black text-md font-medium">
                Continue with Google or LinkedIn.
              </p>
            </div>
            <div className="space-y-2 mt-1">
              <div className="mb-4">
                <Button
                  onClick={handleGoogleSignIn}
                  className="bg-blue-900 hover:bg-blue-800 text-white rounded"
                >
                  <span className="flex items-center justify-center py-1 px-5">
                    <img
                      src="/images/google-icon.png"
                      alt="Google"
                      className="h-5 w-5 mr-4"
                    />
                    Sign in with Google
                  </span>
                </Button>
              </div>

              <div className="mt-3">
                <Button
                  onClick={() =>
                    signIn("linkedin", { callbackUrl: "/profile" })
                  }
                >
                  <span className="flex items-center justify-center py-1 px-5">
                    <img
                      src="/images/linkedin-icon.png"
                      alt="LinkedIn"
                      className="h-5 w-5 mr-4"
                    />
                    Sign in with LinkedIn
                  </span>
                </Button>
              </div>
            </div>

            <p className="text-md font-medium text-center mt-2 text-black ">
              Don’t have an account?{" "}
              <a href="/register" className="text-blue-900 font-bold ">
                Register
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Forgot Password Popup */}
      {showForgotPasswordPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <label className="block">
                <input
                  type="email"
                  required
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-semibold"
                  placeholder="Enter your email"
                />
              </label>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={() => setShowForgotPasswordPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg disabled:opacity-50"
                  disabled={forgotPasswordLoading}
                >
                  {forgotPasswordLoading ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
