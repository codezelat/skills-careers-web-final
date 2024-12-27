"use client";

import { useRef, useState } from "react";

import { signIn } from "next-auth/react";
import NavBar from "@/components/navBar";
import { useRouter } from "next/navigation";
import Button from "../../../components/Button";
import Link from "next/link";

async function createJobSeeker(
  firstName,
  lastName,
  email,
  contactNumber,
  password,
  confirmPassword
) {
  const response = await fetch("/api/auth/jobseekersignup", {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      contactNumber,
      password,
      confirmPassword,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
}

function AuthForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function submitHandler(event) {
    event.preventDefault();

    try {
      const result = await createJobSeeker(
        firstName,
        lastName,
        email,
        contactNumber,
        password,
        confirmPassword
      );
      console.log(result);
      alert(result.message);

      setFirstName("");
      setLastName("");
      setEmail("");
      setContactNumber("");
      setPassword("");
      setConfirmPassword("");

      router.push(`/login?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  const handleGoogleSignup = async () => {
    await signIn("google");
  };

  return (
    <form className="space-y-4 text-blue-900" onSubmit={submitHandler}>
      {/* First Name and Last Name in parallel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <input
            type="text"
            id="firstname"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium"
            placeholder="First Name"
          />
        </label>
        <label className="block">
          <input
            type="text"
            id="lastname"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium"
            placeholder="Last Name"
          />
        </label>
      </div>

      {/* Remaining form fields */}
      <label className="block">
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium"
          placeholder="Email"
        />
      </label>
      <label className="block">
        <input
          type="text"
          id="contactnumber"
          required
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium"
          placeholder="Contact Number"
        />
      </label>
      <label className="block">
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium"
          placeholder="Password"
        />
      </label>
      <label className="block">
        <input
          type="password"
          id="confirmPassword"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium mb-4"
          placeholder="Confirm Password"
        />
      </label>
      <Button className="w-full py-3 mt-8 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <span className="flex items-center justify-center ">

          <p>Register </p>
          <img
            src="/images/arrow-up.png"
            alt="Register"
            className="h-5 w-5 ml-4"
          />
        </span>

      </Button>
      <p className="text-md font-medium text-center mt-1 text-black ">
        Don’t have an account?{" "}
        <a href="/login" className="text-blue-900 font-bold ">
          Login
        </a>
      </p>
    </form>
  );
}

export default AuthForm;
