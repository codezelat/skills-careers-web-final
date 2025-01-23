"use client";
import Image from "next/image";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { PiCheckCircle } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegCircle } from "react-icons/fa6";
import { FaRegCircleDot } from "react-icons/fa6";

export default function EditJobPosts({ job, onClose }) {
  const [jobPostData, setJobPostData] = useState({
    jobTitle: "Software Engineer",
    location: "San Francisco, CA",
    postedDate: "2025-01-05",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobPostData({
      ...jobPostData,
      [name]: value,
    });
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

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  const [jobDetails, setJobDetails] = useState({
    id: "",
    jobTitle: "",
    recruiterId: "", // Keep this in state but don't allow editing
    jobCategory: "",
    location: "",
    salaryRs: "",
    salaryCents: "",
    jobTypes: [], // Initialize as an array
    jobDescription: "",
    keyResponsibilities: "",
    jobExperience: "",
  });

  //To send back to Login page, if the user is unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  //Fetch job details
  useEffect(() => {
    setJobDetails(job);
  }, [job]);

  //Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setJobDetails((prev) => ({
      ...prev,
      jobTypes: checked
        ? [...prev.jobTypes, value]
        : prev.jobTypes.filter((type) => type !== value),
    }));
  };

  //Handle Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/job/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: jobDetails._id,
          jobTitle: jobDetails.jobTitle,
          jobCategory: jobDetails.jobCategory,
          location: jobDetails.location,
          salaryRs: jobDetails.salaryRs,
          salaryCents: jobDetails.salaryCents,
          jobTypes: jobDetails.jobTypes,
          jobDescription: jobDetails.jobDescription,
          keyResponsibilities: jobDetails.keyResponsibilities,
          jobExperience: jobDetails.jobExperience,
        }),
      });

      if (response.ok) {
        alert("Details updated successfully!");
        onClose();
      } else {
        const error = await response.json();
        alert(`Failed to update details: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating job details:", error);
      alert("Error updating job details.");
    }
  };

  const jobTypeOptions = [
    "Onsite",
    "Hybrid",
    "Remote",
    "Full Time",
    "Part Time",
    "Freelance",
  ];


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto rounded-xl shadow-md p-8 scrollbar-hide">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Edit {jobDetails.jobTitle} Job Posts
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div>
              <label className="block text-sm font-semibold text-[#001571]">
                Posted Date
              </label>
              <input
                type="date"
                name="postedDate"
                value={jobPostData.postedDate}
                onChange={handleChange}
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
              />
            </div>
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
