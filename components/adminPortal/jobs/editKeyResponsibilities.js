"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { PiCheckCircle } from "react-icons/pi";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegCircle } from "react-icons/fa6";
import { FaRegCircleDot } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditKeyResponsibilities({ job, onClose }) {
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
  
    const [jobDescriptionData, setJobDescriptionData] = useState({
      jobDescription:
        "We are looking for a talented Front-End Developer to join our growing team. The ideal candidate will have experience in building responsive, user-friendly web applications and a strong understanding of HTML, CSS, and JavaScript frameworks.",
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setJobDescriptionData({
        ...jobDescriptionData,
        [name]: value,
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onClose(); // Close the form on submit
    };

  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto rounded-xl shadow-md p-8 scrollbar-hide">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold text-[#001571]">
            Edit {jobDetails?.jobTitle} Job Posts
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
            <label htmlFor="keyResponsibilities" className="block text-sm font-semibold text-[#001571]">
              Key Responsibilities
            </label>
            <textarea
             type="text"
             name="keyResponsibilities"
             required
             value={jobDetails?.keyResponsibilities || ""}
             onChange={handleInputChange}
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
