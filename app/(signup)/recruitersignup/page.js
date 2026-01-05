"use client";

import NavBar from "@/components/navBar";
import Link from "next/link";
import Button from "../../../components/Button";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

async function createRecruiter(
  firstName,
  lastName,
  recruiterName,
  category,
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
      category,
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOtherCategory, setIsOtherCategory] = useState(false);

  const recruiterNameInputRef = useRef();
  const categoryInputRef = useRef();
  const customCategoryInputRef = useRef();
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

    // Password validation - must match backend validation
    if (!password) {
      newErrors.password = "The Password field is required.";
    } else {
      if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long.";
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password =
          "Password must include at least one uppercase letter.";
      } else if (!/[a-z]/.test(password)) {
        newErrors.password =
          "Password must include at least one lowercase letter.";
      } else if (!/\d/.test(password)) {
        newErrors.password = "Password must include at least one number.";
      } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        newErrors.password =
          "Password must include at least one special character.";
      }
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
    let enteredCategory = categoryInputRef.current.value;
    if (enteredCategory === "Other") {
      enteredCategory = customCategoryInputRef.current.value;
    }
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
        enteredCategory,
        enteredEmployeeRangeName,
        enteredEmail,
        enteredContactNumber,
        enteredPassword,
        enteredConfirmPassword
      );

      // SweetAlert2 for success with 2 second timer
      Swal.fire({
        title: "Success!",
        text: result.message,
        icon: "success",
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
        title: "Error!",
        text: error.message,
        icon: "error",
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
          id="category"
          required
          ref={categoryInputRef}
          onChange={(e) => setIsOtherCategory(e.target.value === "Other")}
          className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 font-medium"
        >
          <option value="">Select Category</option>
          <option value="IT & Software">IT & Software</option>
          <option value="Engineering & Technical">
            Engineering & Technical
          </option>
          <option value="Accounting & Finance">Accounting & Finance</option>
          <option value="Banking & Insurance">Banking & Insurance</option>
          <option value="Sales & Marketing">Sales & Marketing</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Admin & Office Support">Admin & Office Support</option>
          <option value="Customer Service">Customer Service</option>
          <option value="Management & Strategy">Management & Strategy</option>
          <option value="Logistics & Transport">Logistics & Transport</option>
          <option value="Construction & Property">
            Construction & Property
          </option>
          <option value="Manufacturing & Operations">
            Manufacturing & Operations
          </option>
          <option value="Hospitality & Hotels">Hospitality & Hotels</option>
          <option value="Travel & Tourism">Travel & Tourism</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education & Training">Education & Training</option>
          <option value="Media & Design">Media & Design</option>
          <option value="Legal">Legal</option>
          <option value="Government & Public Sector">
            Government & Public Sector
          </option>
          <option value="Agriculture & Environment">
            Agriculture & Environment
          </option>
          <option value="Science & Research">Science & Research</option>
          <option value="Apparel & Textile">Apparel & Textile</option>
          <option value="Supermarkets, Showrooms & Retail">
            Supermarkets, Showrooms & Retail
          </option>
          <option value="Fashion, Beauty & Luxury">
            Fashion, Beauty & Luxury
          </option>
          <option value="Security">Security</option>
          <option value="BPO / Call Center">BPO / Call Center</option>
          <option value="Imports & Exports">Imports & Exports</option>
          <option value="NGO / Non-Profit">NGO / Non-Profit</option>
          <option value="Overseas Jobs">Overseas Jobs</option>
          <option value="Part-time & Flexible Jobs">
            Part-time & Flexible Jobs
          </option>
          <option value="Other">Other</option>
        </select>
        {isOtherCategory && (
          <input
            type="text"
            id="customCategory"
            required
            ref={customCategoryInputRef}
            className="w-full p-3 border border-gray-300 rounded-lg mt-2 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium"
            placeholder="Type your category"
          />
        )}
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
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            required
            ref={passwordInputRef}
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-600 hover:text-blue-900 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </label>
      <label className="block">
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            required
            ref={confirmPasswordInputRef}
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium mb-4"
            placeholder="Confirm Password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-600 hover:text-blue-900 focus:outline-none"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
        )}
      </label>
      <Button
        disabled={isSubmitting}
        className="w-full py-3 mt-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
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
