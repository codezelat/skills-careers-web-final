"use client";
import Image from "next/image";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { PiCheckCircle } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegCircle } from "react-icons/fa6";
import { FaRegCircleDot } from "react-icons/fa6";

export default function AddNewJobPost({ onClose }) {
  const [jobPostData, setJobPostData] = useState({
    jobTitle: "Software Engineer",
    location: "San Francisco, CA",
    recruiterName: "John Doe",
    jobDescription:
      "We are looking for a talented Front-End Developer to join our growing team. The ideal candidate will have experience in building responsive, user-friendly web applications and a strong understanding of HTML, CSS, and JavaScript frameworks.",
    keyResponsibilities: [
      "• Develop and maintain front-end web applications using modern frameworks and tools.",
      "• Collaborate closely with design, product, and backend teams to deliver high-quality user experiences.",
      "• Write clean, maintainable, and scalable code adhering to best practices.",
      "• Optimize web applications for speed, performance, and scalability.",
      "• Conduct thorough testing to ensure cross-browser compatibility and mobile responsiveness.",
      "• Stay updated with the latest trends and technologies in front-end development.",
      "• Participate in code reviews and provide constructive feedback to team members.",
      "• Create and maintain technical documentation for projects and systems.",
    ],
    qualifications: [
      "• Bachelor's degree in Computer Science or related field, or equivalent experience.",
      "• 2+ years of experience in front-end development.",
      "• Proficiency in HTML, CSS, and JavaScript.",
      "• Experience with React, Angular, or Vue.js.",
      "• Strong problem-solving and communication skills.",
    ],
    perksAndBenefits: [
      "• Health, dental, and vision insurance.",
      "• 401(k) with company match.",
      "• Paid time off and holidays.",
      "• Professional development opportunities.",
      "• Flexible work environment.",
    ],
  });

  const [newResponsibility, setNewResponsibility] = useState("");
  const [newQualification, setNewQualification] = useState("");
  const [newPerk, setNewPerk] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({
      ...jobData,
      [name]: value.split("\n"), // Convert string back to array when editing
    });
  };

  const handleAddResponsibility = () => {
    if (newResponsibility.trim()) {
      setJobData({
        ...jobData,
        keyResponsibilities: [
          ...jobData.keyResponsibilities,
          `• ${newResponsibility.trim()}`, // Add bullet point to new responsibility
        ],
      });
      setNewResponsibility(""); // Clear input field after adding
    }
  };

  const handleAddQualification = () => {
    if (newQualification.trim()) {
      setJobData({
        ...jobData,
        qualifications: [
          ...jobData.qualifications,
          `• ${newQualification.trim()}`, // Add bullet point to new qualification
        ],
      });
      setNewQualification(""); // Clear input field after adding
    }
  };

  const handleAddPerk = () => {
    if (newPerk.trim()) {
      setJobData({
        ...jobData,
        perksAndBenefits: [
          ...jobData.perksAndBenefits,
          `• ${newPerk.trim()}`, // Add bullet point to new perk
        ],
      });
      setNewPerk(""); // Clear input field after adding
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose(); // Close the form on submit
  };

  const [selected, setSelected] = useState([]);

  const jobTypes = [
    { id: "on-site", label: "On Site" },
    { id: "hybrid", label: "Hybrid" },
    { id: "remote", label: "Remote" },
    { id: "full-time", label: "Full-Time" },
    { id: "part-time", label: "Part-Time" },
    { id: "freelance", label: "Freelance" },
  ];

  const handleSelect = (type) => {
    setSelected((prevSelected) =>
      prevSelected.includes(type)
        ? prevSelected.filter((item) => item !== type)
        : [...prevSelected, type]
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto rounded-xl shadow-md p-8 scrollbar-hide">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Add Job Posts
          </h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <IoCloseSharp size={24} />
          </button>
        </div>
        <div className="border-2 border-gray-200 mb-4" />

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Job Title
            </label>
            <input
              type="text"
              name="jobTitle"
              value={jobPostData.jobTitle}
              onChange={handleChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Recruiter Name
            </label>
            <input
              type="text"
              name="recruiterName"
              value={jobPostData.recruiterName}
              onChange={handleChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={jobPostData.location}
              onChange={handleChange}
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-[#001571] pb-2">Job Types</h2>
            <div className="flex flex-wrap gap-4">
              {jobTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelect(type.label)}
                  className={`flex px-5 py-2 border rounded-lg transition ${
                    selected.includes(type.label)
                      ? "bg-[#001571] text-white text-sm"
                      : "bg-white text-gray-700 text-sm border-[#B0B6D3]"
                  }`}
                >
                  {type.label}
                  {selected.includes(type.label) ? (
                    <>
                      <span className=" ml-2 mt-1">
                        <FaRegCircleDot width={20} height={10} />
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="ml-2 mt-1">
                        <FaRegCircle width={20} height={10} />
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Job Description
            </label>
            <textarea
              name="jobDescription"
              value={jobPostData.jobDescription}
              onChange={handleChange}
              rows="10"
              className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Key Responsibilities
            </label>
            <textarea
          name="keyResponsibilities"
          value={jobPostData.keyResponsibilities.join("\n")}
          onChange={handleChange}
          rows="10"
          className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
        />
        
        </div>
        <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Required & Qualifications
            </label>
            <textarea
          name="qualifications"
          value={jobPostData.qualifications.join("\n")}
          onChange={handleChange}
          rows="10"
          className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
        />
        
        </div>
        <div>
            <label className="block text-sm font-semibold text-[#001571]">
              Perks & Benifits
            </label>
            <textarea
          name="keyResponsibilities"
          value={jobPostData.perksAndBenefits.join("\n")}
          onChange={handleChange}
          rows="10"
          className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
        />
        
        </div>
          <div className="border-2 border-gray-200 mb-4" />

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#001571] text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            >
              <div className="flex items-center space-x-3">
                <p>Save</p>
                <PiCheckCircle width={20} height={10} />
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
