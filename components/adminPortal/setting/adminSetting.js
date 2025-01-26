import Image from "next/image";
import { useState } from "react";
import SettingsForm from "./settingForm";
import { FaPencilAlt } from "react-icons/fa";

export default function AdminSettings() {
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [formData, setFormData] = useState({
    userName: "info@aerfintechnologies.com",
    phone: "011-2335-876",
    email: "info@aerfintechnologies.com",
    password: "info@aerfintechnologies.com",
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
      <div className="flex flex-col p-6 bg-white min-h-screen rounded-xl">
        <h2 className="text-[#001571] text-xl font-bold mb-6">Settings</h2>
        {/* edit button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowSettingsForm(true)}
            className=" text-white px-3 py-2 sm:px-4 rounded-md"
          >
            <div className="flex items-center px-8 py-5">
              <div className="absolute bg-[#E8E8E8] w-10 h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center mt-2 ">
                <FaPencilAlt size={15} className="text-[#001571]" />
              </div>
            </div>
          </button>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
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

          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              password
            </label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
        </form>
        {/* Edit My Profile Form Popup */}
        {showSettingsForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
              <SettingsForm onClose={() => setShowSettingsForm(false)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
