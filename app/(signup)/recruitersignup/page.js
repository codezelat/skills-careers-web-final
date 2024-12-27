"use client";

import NavBar from "@/components/navBar";
import Link from "next/link";
import Button from "../../../components/Button";
import { useRouter } from "next/navigation";
import { useRef } from "react";

async function createRecruiter(
  recruiterName,
  employeeRange,
  email,
  contactNumber,
  password,
  confirmPassword
) {
  const response = await fetch("/api/auth/recruitersignup", {
    method: "POST",
    body: JSON.stringify({
      recruiterName,
      employeeRange,
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

  const recruiterNameInputRef = useRef();
  const employeeRangeInputRef = useRef();
  const emailInputRef = useRef();
  const contactNumberInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  async function submitHandler(event) {
    event.preventDefault();

    const enteredRecruiterName = recruiterNameInputRef.current.value;
    const enteredEmployeeRangeName = employeeRangeInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredContactNumber = contactNumberInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmPassword = confirmPasswordInputRef.current.value;

    try {
      const result = await createRecruiter(
        enteredRecruiterName,
        enteredEmployeeRangeName,
        enteredEmail,
        enteredContactNumber,
        enteredPassword,
        enteredConfirmPassword
      );
      console.log(result);
      alert(result.message);

      router.push(`/login?email=${encodeURIComponent(enteredEmail)}`);
      // router.push(`/login`);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  } 

  return (
    <form className="space-y-4 text-blue-900" onSubmit={submitHandler}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="block">
        <input
          type="text"
          id="recruitername"
          required
          ref={recruiterNameInputRef}
          className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium"
          placeholder="Recruiter Name"
        />
      </label>
      <label className="block">
        <select
          id="employeerange"
          required
          ref={employeeRangeInputRef}
          className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 font-medium"
        >
          <option value="">Employee Range</option>
          <option value="1-10">1-10</option>
          <option value="11-50">11-50</option>
          <option value="51-200">51-200</option>
          <option value="201-500">201-500</option>
          <option value="500+">500+</option>
        </select>
      </label>
    </div>
    <label className="block">
      <input
        type="email"
        id="email"
        required
        ref={emailInputRef}
        className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium"
        placeholder="Email"
      />
    </label>
    <label className="block">
      <input
        type="text"
        id="contactnumber"
        required
        ref={contactNumberInputRef}
        className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium"
        placeholder="Contact Number"
      />
    </label>
    <label className="block">
      <input
        type="password"
        id="password"
        required
        ref={passwordInputRef}
        className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium"
        placeholder="Password"
      />
    </label>
    <label className="block">
      <input
        type="password"
        id="confirmPassword"
        required
        ref={confirmPasswordInputRef}
        className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium mb-4"
        placeholder="Confirm Password"
      />
    </label>
    <Button variant="primary" className="w-full py-3 mt-4">
    <span className="flex items-center justify-center ">

      <Link href="/login">Register </Link>
      <img
                src="/images/arrow-up.png"
                alt="Register"
                className="h-5 w-5 ml-4"
              />
            </span>

    </Button>
  </form>
  );
}

export default AuthForm;
