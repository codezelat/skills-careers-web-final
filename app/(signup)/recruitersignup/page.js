"use client";

import NavBar from "@/components/navBar";
import Link from "next/link";
import Button from "../../../components/Button";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Swal from "sweetalert2";  // Import SweetAlert2

async function createRecruiter(
  firstName,
  lastName,
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
      firstName,
      lastName,
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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recruiterNameInputRef = useRef();
  const firstNameInputRef = useRef();
  const lastNameInputRef = useRef();
  const employeeRangeInputRef = useRef();
  const emailInputRef = useRef();
  const contactNumberInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const validateForm = () => {
    const newErrors = {};

    const firstName = firstNameInputRef.current.value;
    const lastName = lastNameInputRef.current.value;
    const email = emailInputRef.current.value;
    const contactNumber = contactNumberInputRef.current.value;
    const password = passwordInputRef.current.value;
    const confirmPassword = confirmPasswordInputRef.current.value;

    if (!firstName) {
      newErrors.firstName = "The First Name field is required.";
    } else if (!/^[A-Za-z\s]+$/.test(firstName)) {
      newErrors.firstName = "First Name must contain only letters.";
    }

    if (!lastName) {
      newErrors.lastName = "The Last Name field is required.";
    } else if (!/^[A-Za-z\s]+$/.test(lastName)) {
      newErrors.lastName = "Last Name must contain only letters.";
    }

    if (!email) {
      newErrors.email = "The Email field is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid.";
    }

    if (!contactNumber) {
      newErrors.contactNumber = "The Contact Number field is required.";
    } else if (!/^\d{10}$/.test(contactNumber)) {
      newErrors.contactNumber = "Contact Number must be exactly 10 digits.";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
      newErrors.password = "The Password field is required.";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "The Confirm Password field is required.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword =
        "The password and confirmation password do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function submitHandler(event) {
    event.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) return;

    const enteredFirstName = firstNameInputRef.current.value;
    const enteredLastName = lastNameInputRef.current.value;
    const enteredRecruiterName = recruiterNameInputRef.current.value;
    const enteredEmployeeRangeName = employeeRangeInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredContactNumber = contactNumberInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmPassword = confirmPasswordInputRef.current.value;

    try {
      const result = await createRecruiter(
        enteredFirstName,
        enteredLastName,
        enteredRecruiterName,
        enteredEmployeeRangeName,
        enteredEmail,
        enteredContactNumber,
        enteredPassword,
        enteredConfirmPassword
      );

      // SweetAlert2 for success with 2 second timer
      Swal.fire({
        title: 'Success!',
        text: result.message,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        router.push(`/login`);
      });
    } catch (error) {
      console.log(error.message);
      setIsSubmitting(false);

      // SweetAlert2 for failure with 2 second timer
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }

  return (
    <form className="space-y-4 text-blue-900" onSubmit={submitHandler}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <input
            type="text"
            id="firstname"
            required
            ref={firstNameInputRef}
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium"
            placeholder="First Name"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
        </label>
        <label className="block">
          <input
            type="text"
            id="lastname"
            required
            ref={lastNameInputRef}
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium"
            placeholder="Last Name"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
        </label>
      </div>
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
      <label className="block">
        <input
          type="text"
          id="email"
          required
          ref={emailInputRef}
          className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium"
          placeholder="Email"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
        {errors.contactNumber && (
          <p className="text-red-500 text-sm">{errors.contactNumber}</p>
        )}
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
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
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
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
        )}
      </label>
      <Button
        disabled={isSubmitting} 
        className="w-full py-3 mt-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <span className="flex items-center justify-center">
          <p>{isSubmitting ? "Please Wait..." : "Register"}</p>
          <img
            src="/images/arrow-up.png"
            alt="Register"
            className="h-5 w-5 ml-4"
          />
        </span>
      </Button>
      <p className="text-md font-medium text-center mt-1 text-black ">
        Already have an account?{" "}
        <a href="/login" className="text-blue-900 font-bold ">
          Login
        </a>
      </p>
    </form>
  );
}

export default AuthForm;
