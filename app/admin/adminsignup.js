"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

async function createAdmin(
  firstName,
  lastName,
  contactNumber,
  email,
  password,
  confirmPassword
) {
  const response = await fetch("/api/auth/adminsignup", {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      contactNumber,
      email,
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

function AdminSignUpForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const result = await createAdmin(
        firstName,
        lastName,
        contactNumber,
        email,
        password,
        confirmPassword
      );

      console.log(result);
      alert(result.message);
      alert("Please enter email and password in Login form to log");

      setFirstName("");
      setLastName("");
      setContactNumber("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }
  return (
    <div className="grid justify-items-center bg-white shadow-lg rounded-lg p-8 m-6">
      <h1 className="text-2xl font-bold mb-12">Admin Sign Up</h1>
      <form onSubmit={submitHandler}>
        {/* First Name Input */}
        <div>
          <p
            htmlFor="firstName"
            className="text-base font-bold text-black mb-1"
          >
            First Name
          </p>
          <input
            type="text"
            id="firstName"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        {/* Last Name Input */}
        <div>
          <p
            htmlFor="adminLastName"
            className="text-base font-bold text-black mb-1"
          >
            Last Name
          </p>
          <input
            type="text"
            id="adminLastName"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        {/* Contact Number Input */}
        <div>
          <p
            htmlFor="contactNumber"
            className="text-base font-bold text-black mb-1"
          >
            Contact Number
          </p>
          <input
            type="text"
            id="contactNumber"
            required
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="Contact Number"
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        {/* Email Input */}
        <div>
          <p htmlFor="email" className="text-base font-bold text-black mb-1">
            Email
          </p>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        {/* Password Input */}
        <div>
          <p htmlFor="password" className="text-base font-bold text-black mb-1">
            Password
          </p>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        {/* Confirm Password Input */}
        <div>
          <p
            htmlFor="confirmPassword"
            className="text-base font-bold text-black mb-1"
          >
            Confirm Password
          </p>
          <input
            type="password"
            id="confirmPassword"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Password"
            className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>

        {/* Sign Up Button */}
        <button className="w-96 px-4 py-2 mt-5 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default AdminSignUpForm;
