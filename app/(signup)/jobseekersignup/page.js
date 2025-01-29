"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Button from "../../../components/Button";
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
  const router = useRouter();
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

    if (!formData.firstName) {
      newErrors.firstName = "The First Name field is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = "First Name must contain only letters.";
    }

    if (!formData.lastName) {
      newErrors.lastName = "The Last Name field is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = "Last Name must contain only letters.";
    }
    if (!formData.email) newErrors.email = "The Email field is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email address is invalid.";

    if (!formData.contactNumber) {
      newErrors.contactNumber = "The Contact Number field is required.";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact Number must be exactly 10 digits.";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.password) {
      newErrors.password = "The Password field is required.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
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
  
    try {
      const result = await createJobSeeker(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.contactNumber,
        formData.password,
        formData.confirmPassword
      );
  
      Swal.fire({
        icon: 'success',
        title: 'Jobseeker Created!',
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
  
      router.push(`/login?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Create Jobseeker',
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
      <label className="block">
        <input
          type="text"
          value={formData.contactNumber}
          onChange={(e) => {
            // Only allow numbers
            const numericValue = e.target.value.replace(/\D/g, "");
            setFormData({ ...formData, contactNumber: numericValue });
          }}
          className={`w-full p-3 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium ${
            errors.contactNumber ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Contact Number"
          maxLength={10} // Ensures user can't type more than 10 digits
        />
        {errors.contactNumber && (
          <p className="text-red-500 text-sm">{errors.contactNumber}</p>
        )}
      </label>

      {/* Password */}
      <label className="block">
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className={`w-full p-3 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter Password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </label>

      {/* Confirm Password */}
      <label className="block">
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          className={`w-full p-3 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-medium ${
            errors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
        )}
      </label>

      {/* Register Button */}
      <Button className="w-full py-3 mt-8 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Register
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
