import Image from "next/image";
import { useState,useEffect } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import CredencialsForm from "./CredencialsForm";

export default function CredencialDetails({recruiter , onClose}) {
    const [recruiterDetails, setRecruiterDetails] = useState({
      _id: "",
      userName: "",
      email: "",
      phone: "",
      membership: "",
    });
    const [selectedRecruiter, setSelectedRecruiter] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    if (recruiter) {
      setRecruiterDetails(recruiter);
    }
  }, [recruiter]);





    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Edit Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowApplicationForm(true)}
            className="text-white px-3 py-2 sm:px-4 rounded-md"
          >
            <div className="flex gap-2">
              <Image
                src="/images/editicon.png"
                alt="edit"
                width={50}
                height={16}
              />
            </div>
          </button>
        </div>
        <form>
          {recruiters.map((recruiter) => (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#001571]">
                User Name
              </label>
              <input
                type="text"
                name="User Name"
                value={recruiterDetails.email}
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={recruiterDetails.email}
                    className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="pone"
                    value={recruiterDetails.phone}
                    className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
                  />
                </div>
              </div>
              {/* Recruiter Package Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-[#001571]">
                  Membership
                </label>
                <select
                  name="package"
                  value={recruiterDetails.membership}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
                >
                  <option value="Basic Recruiter Package">
                    Basic Recruiter Package
                  </option>
                  <option value="Advanced Recruiter Package">
                    Advanced Recruiter Package
                  </option>
                  <option value="Premium Recruiter Package">
                    Premium Recruiter Package
                  </option>
                </select>
              </div>
            </div>
          ))}
        </form>
        {/* Edit Profile Form Popup */}
        {showApplicationForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
              <CredencialsForm onClose={() => setShowApplicationForm(false)} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
