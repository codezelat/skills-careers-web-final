"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Button from "../../../components/Button";
import PhoneNumberInput from "../../../components/PhoneInput";
import Swal from "sweetalert2";

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
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Something went wrong!");
  return data;
}

function AuthForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z][A-Za-z\s'-]*$/;
    const trimmedFirstName = formData.firstName.trim();
    const trimmedLastName = formData.lastName.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedFirstName) {
      newErrors.firstName = "The First Name field is required.";
    } else if (!nameRegex.test(trimmedFirstName)) {
      newErrors.firstName =
        "First Name may include letters, spaces, apostrophes, and hyphens.";
    }

    if (!trimmedLastName) {
      newErrors.lastName = "The Last Name field is required.";
    } else if (!nameRegex.test(trimmedLastName)) {
      newErrors.lastName =
        "Last Name may include letters, spaces, apostrophes, and hyphens.";
    }
    if (!trimmedEmail) newErrors.email = "The Email field is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail))
      newErrors.email = "Email address is invalid.";

    if (!formData.contactNumber) {
      newErrors.contactNumber = "The Contact Number field is required.";
    } else if (formData.contactNumber.length < 8) {
      newErrors.contactNumber = "Please enter a valid phone number.";
    }

    // Password validation - must match backend validation
    if (!formData.password) {
      newErrors.password = "The Password field is required.";
    } else {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long.";
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password =
          "Password must include at least one uppercase letter.";
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password =
          "Password must include at least one lowercase letter.";
      } else if (!/\d/.test(formData.password)) {
        newErrors.password = "Password must include at least one number.";
      } else if (
        !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)
      ) {
        newErrors.password =
          "Password must include at least one special character.";
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "The Confirm Password field is required.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword =
        "The password and confirmation password do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function submitHandler(event) {
    event.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const trimmedFirstName = formData.firstName.trim();
      const trimmedLastName = formData.lastName.trim();
      const trimmedEmail = formData.email.trim();
      const trimmedContactNumber = formData.contactNumber.trim();

      const result = await createJobSeeker(
        trimmedFirstName,
        trimmedLastName,
        trimmedEmail,
        trimmedContactNumber,
        formData.password,
        formData.confirmPassword
      );

      Swal.fire({
        icon: "success",
        title: "Jobseeker Created!",
        text: result.message,
        timer: 2000, // 2 seconds
        showConfirmButton: false,
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
        password: "",
        confirmPassword: "",
      });

      router.push(`/login?email=${encodeURIComponent(trimmedEmail)}`);
    } catch (error) {
      setIsSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Failed to Create Jobseeker",
        text: error.message,
        timer: 2000, // 2 seconds
        showConfirmButton: false,
      });
    }
  }

  return (
    <form className="space-y-4 text-blue-900" onSubmit={submitHandler}>
      {/* First Name & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["firstName", "lastName"].map((field) => (
          <label key={field} className="block">
            <input
              type="text"
              value={formData[field]}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
              className={`w-full p-3 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium ${
                errors[field] ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={field === "firstName" ? "First Name" : "Last Name"}
            />
            {errors[field] && (
              <p className="text-red-500 text-sm">{errors[field]}</p>
            )}
          </label>
        ))}
      </div>

      {/* Email */}
      <label className="block">
        <input
          type="text"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full p-3 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Email"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </label>

      {/* Contact Number */}
      <PhoneNumberInput
        value={formData.contactNumber}
        onChange={(phone) => setFormData({ ...formData, contactNumber: phone })}
        placeholder="Contact Number"
        error={errors.contactNumber}
        required
      />

      {/* Password */}
      <label className="block">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={`w-full p-3 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter Password"
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

      {/* Confirm Password */}
      <label className="block">
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className={`w-full p-3 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
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

      {/* Register Button */}
      <Button
        disabled={isSubmitting}
        className="w-full py-3 mt-8 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isSubmitting ? "Please Wait..." : "Register"}
      </Button>

      {/* Login Link */}
      <p className="text-md font-medium text-center mt-1 text-black">
        Already have an account?{" "}
        <a href="/login" className="text-blue-900 font-bold">
          Login
        </a>
      </p>
    </form>
  );
}

export default AuthForm;
