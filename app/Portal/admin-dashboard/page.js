"use client";
import Image from "next/image";
import React from "react";
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
import LineChart from "@/components/PortalComponents/lineChart";
import BarChart from "@/components/PortalComponents/barChart";

export default function DashBoard() {
  return (
    <div className="flex h-screen bg-[#F7F7F7]">
      {/* Sidebar */}
      <SideBar/>

      {/* Main Content */}
      <div className="flex-1 bg-[#F7F7F7] p-6 h-screen overflow-y-auto no-scrollbar">
        {/* Header */}
        <PortalHeader />

        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[
            {
              title: "Jobs",
              count: 28,
              growth: "+2.5% ",
              since: "Since Yesterday",
              icon: "/dashboard/flag.png",
            },
            {
              title: "Applications",
              count: 1889,
              growth: "+6.5% ",
              since: "Since Yesterday",
              icon: "/dashboard/document.png",
            },
            {
              title: "Recruiters",
              count: 428,
              growth: "+1.5% ",
              since: " Since Last Month",
              icon: "/dashboard/buliding.png",
            },
            {
              title: "Candidates",
              count: 5670,
              growth: "+1.5% ",
              since: "Since Last Month",
              icon: "/dashboard/people.png",
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-[#8A93BE] flex items-center">
                  {item.title}
                  <span className="ml-2">
                    <IoIosArrowDroprightCircle />
                  </span>
                </h2>
                <Image src={item.icon} alt="Flag icon" width={35} height={35} />
              </div>
              <div className="text-4xl font-bold text-[#001571]">
                {item.count}
              </div>
              <p className="flex text-[#1AB810] mt-2 font-bold">
                <span className="mt-1 text-[#000000]">
                  <GoArrowUp />
                </span>
                {item.growth}
                <span className="ml-2 text-[#000000]">{item.since}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-2 gap-6">
          {/* Job Posts Chart */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
              <p>Job Posts</p>
              <Link href="">
                <p className="flex">
                  This Week
                  
                </p>
              </Link>
            </div>
            <LineChart />
          </div>

          {/* Active Users Chart */}
          <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
              <p>Active Users</p>
              <Link href="">
                <p className="flex">
                  This Week
                  
                </p>
              </Link>
            </div>
            <BarChart />
          </div>
        </div>

        {/* Help & Contact Table */}
        <div className="bg-white shadow-md rounded-lg p-4 mt-10">
          <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-lg md:text-xl sm:text-lg">
            <p>Help & Contact inquires</p>
            <Link href="">
              <p className="flex">
                View All
                <span className="ml-3 mt-1">
                  <IoIosArrowDroprightCircle />
                </span>
              </p>
            </Link>
          </div>

          <table className="w-full text-left">
            <tbody>
              {[
                {
                  name: "Codezela Technologies",
                  icon: "/dashboard/people.png",
                  role: "Recruiter",
                  date: "09 Aug 2024",
                },
                {
                  name: "Alin Fernando",
                  icon: "/dashboard/people.png",
                  role: "Candidate",
                  date: "09 Aug 2024",
                },
                {
                  name: "Alin Fernando",
                  icon: "/dashboard/people.png",
                  role: "Candidate",
                  date: "09 Aug 2024",
                },
              ].map((item, idx) => (
                <tr key={idx}>
                  <td className="flex py-2">
                    <span className="mr-2">
                      <Image
                        src={item.icon}
                        width={20}
                        height={20}
                        alt="prof"
                      />
                    </span>
                    {item.name}
                  </td>
                  <td className="py-2">{item.role}</td>
                  <td className="py-2">{item.date}</td>
                  <td className="py-2">{item.date}</td>
                  <td className="py-2">
                    <button className="flex bg-[#001571] px-4 py-2 rounded-lg text-white text-base ml-auto justify-end">
                      View Now
                      <span className="ml-3 mt-1">
                        <IoIosArrowDroprightCircle />
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
