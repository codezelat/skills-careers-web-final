"use client";
import Image from "next/image";
import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { IoIosArrowDroprightCircle, IoIosArrowRoundUp } from "react-icons/io";
import { GoArrowUp } from "react-icons/go";
import { MdDashboard } from "react-icons/md";
import { FaUserTie, FaUsers } from "react-icons/fa";
import { RiSuitcaseLine, RiBarChartBoxLine } from "react-icons/ri";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { IoNewspaperOutline } from "react-icons/io5";
import { FiSettings, FiHelpCircle } from "react-icons/fi";
import { BiUserCircle } from "react-icons/bi";
import { GiMegaphone } from "react-icons/gi";
import Link from "next/link";
import SideBar from "@/components/PortalComponents/PortalSidebar";
import PortalHeader from "@/components/PortalComponents/PortalHeader";
import { PiCheckCircle } from "react-icons/pi";
import { FaSearch } from "react-icons/fa";
import { FaPenToSquare } from "react-icons/fa6";
import { IoMdEyeOff } from "react-icons/io";
import { FaCheckSquare } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { BsFillEyeFill } from "react-icons/bs";
// import { RecruitersList } from "../../../lib/dashboard/recruiters/recruiters";
// import AddNewRecruiterForm from "../../../components/adminportal/addNewRecruiterForm";
// import EditProfile from "./editProfile/page";

export default function Recruiters() {
  const [activeTab, setActiveTab] = useState("all");

  const [userType, setUserType] = useState("All");

  const [showApplicationForm, setShowApplicationForm] = useState(false);

  return (
    <div className="flex h-screen bg-[#F7F7F7]">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 bg-[#F7F7F7] p-6">
        {/* Header */}
        <PortalHeader />
<div className="min-h-screen bg-white rounded-lg p-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-[#001571]">Recruiters</h1>
            <button
              className="bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800"
              onClick={() => setShowApplicationForm(true)}
            >
              + Add New
            </button>
          </div>

          <div className="flex items-center justify-center p-2 mb-5 bg-[#E6E8F1] rounded-2xl w-max">
            {/* All Recruiters Button */}
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 flex rounded-xl text-sm font-semibold ${
                activeTab === "all"
                  ? "bg-[#001571] text-white"
                  : "text-[#B0B6D3] bg-[#E6E8F1]"
              }`}
            >
              All Recruiters
              {activeTab === "all" && (
                <span className="ml-2">
                  <PiCheckCircle size={20} />
                </span>
              )}
            </button>

            {/* Restricted Recruiters Button */}
            <button
              onClick={() => setActiveTab("restricted")}
              className={`px-4 py-2 flex rounded-xl text-sm font-semibold ${
                activeTab === "restricted"
                  ? "bg-[#001571] text-white"
                  : "text-[#B0B6D3] bg-[#E6E8F1]"
              }`}
            >
              Restricted Recruiters
              {activeTab === "restricted" && (
                <span className="ml-2">
                  <PiCheckCircle size={20} />
                </span>
              )}
            </button>
          </div>

          {activeTab === "all" ? (
            <>
              <div className="flex-grow ">
                <div className="bg-[#E6E8F1] flex items-center pl-4 pr-4 mb-5 py-4 rounded-lg shadow-sm w-full">
                  <IoSearchSharp size={25} className="text-[#001571]" />
                  <input
                    type="text"
                    placeholder="Search Recruiters..."
                    className="ml-2 text-[#8A93BE] bg-[#E6E8F1] font-bold outline-none w-full"
                  />
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-4 mb-4 items-center bg-green">
                <button className="flex bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800">
                  <span className="mr-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    />
                  </span>
                  Select More
                </button>

                <button className="flex bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-600">
                  <span className="mr-2">
                    <RiDeleteBinFill size={20} />
                  </span>
                  Delete
                </button>
              </div>

              {/* Table */}
              {/* <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-[#8A93BE] text-base font-semibold text-left">
                      <th className="px-4 py-3"></th>
                      <th className="px-2 py-3"></th>
                      <th className="px-4 py-3">Recruiter Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-24 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RecruitersList.map((recruiter, id) => (
                      <tr
                        key={id}
                        className="text-gray-700 hover:bg-gray-50 border-b text-sm"
                      >
                        <td className="px-4 py-3">
                          <input type="checkbox" />
                        </td>
                        <td className="px-2 py-3 flex items-left gap-3">
                          <div className="w-8 h-8 text-white flex justify-center items-center rounded-full">
                            <Image
                              src={recruiter.logo}
                              width={35}
                              height={35}
                              alt="logo"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-black font-semibold">
                          {recruiter.name}
                        </td>
                        <td className="px-4 py-3 text-black font-semibold">
                          {recruiter.email}
                        </td>
                        <td className="px-4 py-3 text-black font-semibold">
                          {recruiter.phone}
                        </td>
                        <td className="px-4 py-3 flex gap-2 justify-end">
                        <Link href="./recruiter/editProfile">
                          <button
                            className="flex bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800"
                            
                          >
                            <span className="mr-2">
                              <FaPenToSquare size={15} />
                            </span>
                            Edit Account
                          </button>
                          </Link>
                          <button className="flex bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-600">
                            <span className="mr-2">
                              <IoMdEyeOff size={20} />
                            </span>
                            Restrict
                          </button>
                        </td>
                        {showApplicationForm && (
                          <div
                            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
                            style={{
                              backgroundImage: "url('/path-to-your-image.jpg')",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
                              {showApplicationForm && (
                                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                                  <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
                                    <AddNewRecruiterForm
                                      onClose={() =>
                                        setShowApplicationForm(false)
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}

              {/* Pagination */}
              {/* <div className="flex justify-center mt-4">
                <nav className="flex gap-2">
                  <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    &lt;
                  </button>
                  <button className="px-3 py-2 bg-blue-700 text-white rounded-lg">
                    1
                  </button>
                  <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    2
                  </button>
                  <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    3
                  </button>
                  <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    ...
                  </button>
                  <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    15
                  </button>
                  <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    &gt;
                  </button>
                </nav>
              </div> */}
            </>
          ) : (
            <>
              <div className="flex-grow ">
                <div className="bg-[#E6E8F1] flex items-center pl-4 pr-4 mb-5 py-4 rounded-lg shadow-sm w-full">
                  <IoSearchSharp size={25} className="text-[#001571]" />
                  <input
                    type="text"
                    placeholder="Search Recruiters..."
                    className="ml-2 text-[#8A93BE] bg-[#E6E8F1] font-bold outline-none w-full"
                  />
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-4 mb-4 items-center bg-green">
                <button className="flex bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800">
                  <span className="mr-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    />
                  </span>
                  Select More
                </button>

                <button className="flex bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-600">
                  <span className="mr-2">
                    <BsFillEyeFill size={20} />
                  </span>
                  Unrestricted
                </button>

                <button className="flex bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-600">
                  <span className="mr-2">
                    <RiDeleteBinFill size={20} />
                  </span>
                  Delete
                </button>
              </div>

              {/* Table */}
              {/* <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-[#8A93BE] text-base font-semibold text-left">
                      <th className="px-4 py-3"></th>
                      <th className="px-2 py-3"></th>
                      <th className="px-4 py-3">Recruiter Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-24 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RecruitersList.filter(
                      (recruiter) => recruiter.type === "Restricted"
                    ).map((recruiter, id) => (
                      <tr
                        key={id}
                        className="text-gray-700 hover:bg-gray-50 border-b text-sm"
                      >
                        <td className="px-4 py-3">
                          <input type="checkbox" />
                        </td>
                        <td className="px-2 py-3 flex items-left gap-3">
                          <div className="w-8 h-8 text-white flex justify-center items-center rounded-full">
                            <Image
                              src={recruiter.logo}
                              width={35}
                              height={35}
                              alt="logo"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-black font-semibold">
                          {recruiter.name}
                        </td>
                        <td className="px-4 py-3 text-black font-semibold">
                          {recruiter.email}
                        </td>
                        <td className="px-4 py-3 text-black font-semibold">
                          {recruiter.phone}
                        </td>
                        <td className="px-4 py-3 flex gap-2 justify-end">
                          <button className="flex bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800">
                            <span className="mr-2">
                              <BsFillEyeFill size={15} />
                            </span>
                            Unrestricted
                          </button>
                          <button className="flex bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-600">
                            <span className="mr-2">
                              <RiDeleteBinFill size={20} />
                            </span>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}

              {/* Pagination */}
              {/* <div className="flex justify-center mt-4">
                <nav className="flex gap-2">
                  <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    &lt;
                  </button>
                  <button className="px-3 py-2 bg-blue-700 text-white rounded-lg">
                    1
                  </button>
                  <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    2
                  </button>
                  <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    3
                  </button>
                  <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    ...
                  </button>
                  <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    15
                  </button>
                  <button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                    &gt;
                  </button>
                </nav>
              </div> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
