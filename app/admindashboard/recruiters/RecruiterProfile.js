"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import RecruiterEdit from "./RecruiterEdit";

function RecruiterProfile({ recruiterId, onClose }) {
  const [recruiterDetails, setRecruiterDetails] = useState({
    id: "",
    recruiterName: "",
    employeeRange: "",
    email: "",
    contactNumber: "",
    website: "",
    companyDescription: "",
    industry: "",
    location: "",
    logo: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    x: "",
  });
  const [selectedRecruiterId, setSelectedRecruiterId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiterDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch recruiter details
        const recruiterResponse = await fetch(
          `/api/recruiterdetails/get?id=${recruiterId}`
        );
        const recruiterData = await recruiterResponse.json();
        if (!recruiterResponse.ok) {
          throw new Error(
            recruiterData.message || "Failed to fetch recruiter details"
          );
        }
        setRecruiterDetails(recruiterData);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (recruiterId) {
      fetchRecruiterDetails();
    }
  }, [recruiterId]);

  const handleImageChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("email", session.user.email);

      console.log("Starting image upload...");
      const response = await fetch("/api/recruiterdetails/uploadimage", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      console.log("Upload successful:", data);
      setRecruiterDetails((prev) => ({
        ...prev,
        logo: data.imageUrl,
      }));

      alert("Logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image: ${error.message}`);
    }
  };

  const handleRecruiterSelect = () => {
    setSelectedRecruiterId(recruiterDetails.id);
  };

  const handleCloseProfile = () => {
    setSelectedRecruiterId(null);
  };

  return (
    <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-[90vh] w-1/2 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-lg p-6 mb-6">
      {selectedRecruiterId && (
        <RecruiterEdit
          recruiterId={selectedRecruiterId}
          onClose={handleCloseProfile}
        />
      )}
      {isLoading && (
        <div className="text-center py-4">Loading jobseeker details...</div>
      )}
      <div className="flex justify-between mb-8">
        <div className="flex flex-col items-center space-y-2">
          {recruiterDetails.logo ? (
            <Image
              src={recruiterDetails.logo}
              alt="Logo"
              width={100}
              height={100}
              className="rounded-full object-cover mb-4 shadow-lg"
              onError={(e) => {
                console.error("Error loading image:", e);
                e.target.src = "/fallback-logo-image.png";
              }}
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}

          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="logo-image-input"
            />
            <label
              htmlFor="logo-image-input"
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
            >
              {recruiterDetails.logo ? "Change Logo" : "Upload Logo"}
            </label>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-2 py-1 h-12 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          Close ✕
        </button>
      </div>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">
          {recruiterDetails.recruiterName}
        </h1>
        <button
          onClick={handleRecruiterSelect}
          className="py-1 ml-auto h-10 w-24 bg-white border-2 border-green-500 text-green-500 hover:border-green-500 hover:bg-green-500 hover:text-white rounded transition-colors"
        >
          Edit
        </button>
      </div>

      <div>
        <p className="text-sm text-gray-600">Website</p>
        <p className="text-base font-bold text-black mb-3">
          {recruiterDetails.website}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Industry</p>
        <p className="text-base font-bold text-black mb-3">
          {recruiterDetails.industry}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Employee Range</p>
        <p className="text-base font-bold text-black mb-3">
          {recruiterDetails.employeeRange}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Description</p>
        <p className="text-base font-bold text-black mb-3">
          {recruiterDetails.companyDescription}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Contact Number</p>
        <p className="text-base font-bold text-black mb-3">
          {recruiterDetails.contactNumber}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Email</p>
        <p className="text-base font-bold text-black mb-3">
          {recruiterDetails.email}
        </p>
      </div>
    </div>
  );
}

export default RecruiterProfile;
