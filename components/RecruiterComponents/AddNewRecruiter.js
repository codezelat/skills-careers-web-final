'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

 async function AddNewRecruiter( formData ) {
  const response = await fetch("/api/recruiter/add", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
}

function AddRecruiter({ onClose }) {
  const [recruiterName, setRecruiterName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [membership, setMembership] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearForm = () => {
    setRecruiterName("");
    setEmail("");
    setMembership("");
    setPhone("");
    setPassword("");
    setConfirmedPassword("");
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  async function submitHandler(e) {
    e.preventDefault();
    setIsSubmitting(true);
    onClose();

        // Example validation
        if (!formData.recruiterName || !formData.email || !formData.phone) {
          alert("Please fill all required fields!");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
    
        console.log("Recruiter Added:", formData);
        onClose(); // Close the form on successful submission
    

    try {
      const formData = new FormData();
      formData.append("recruiterName", recruiterName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("membership", membership);
      formData.append("password", password);
      formData.append("confirmedPassword", confirmedPassword);
      


      const result = await createRecruiter(formData);
      console.log(result);
      alert(result.message);

      clearForm();
      onClose();

      window.location.reload();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-md p-8 scrollbar-hide">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold text-[#001571]">Add New Recruiter</h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="border-t-2 border-gray-200 mb-4" />

        <form className="space-y-6" onSubmit={submitHandler}>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Recruiter Name
            </label>
            <input
              type="text"
              name="recruiterName"
              value={recruiterName}
              onChange={(e) => setRecruiterName(e.target.value)}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Membership
            </label>
            <select
              name="package"
              value={formData.package}
              onChange={(e) => setMembership(e.target.value)}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            >
              <option value="Basic Recruiter Package">Basic Recruiter Package</option>
              <option value="Advanced Recruiter Package">Advanced Recruiter Package</option>
              <option value="Premium Recruiter Package">Premium Recruiter Package</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div className="border-t-2 border-gray-200 mt-4" />

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#001571] text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            >
              <div className="flex items-center space-x-3">
                <p>Add</p>
                <Image src="/images/miyuri_img/whitetick.png" alt="tick" width={20} height={10} />
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRecruiter;
