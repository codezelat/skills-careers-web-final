"use client"
import Image from "next/image";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";

export default function SettingsForm({ onClose }) {
    const [formData, setFormData] = useState({
        userName: "info@aerfintechnologies.com",
        phone: "011-2335-876",
        email:"info@aerfintechnologies.com",
        password:"info@aerfintechnologies.com",
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onClose(); // Close the form on submit
    };
  
    return (
      <>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-4xl min-h-[90vh] overflow-y-auto rounded-xl shadow-md p-8 flex flex-col justify-start">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-2xl font-semibold text-[#001571]">
                  Edit Personal Profile Details
                </h4>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <div className="border-t-2 border-gray-200 mb-4" />
            </div>
  
            <form className="space-y-6 flex-grow" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  User Name
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    password
                  </label>
                  <input
                    type="email"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    Confirm password
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
                  />
                </div>
              </div>
  
  
            </form>
  
            {/* End Form Section */}
            <div>
              <div className="border-t-2 border-gray-200 mt-4" />
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#001571] text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                >
                  <div className="flex items-center space-x-3">
                    <p>Save</p>
                    <FaRegCheckCircle />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  