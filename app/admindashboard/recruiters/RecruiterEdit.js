"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function RecruiterEdit({ recruiterId, onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { status } = useSession();

  const [recruiterDetails, setRecruiterDetails] = useState({
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login if unauthenticated
    }
  }, [status, router]);

  useEffect(() => {
    if (recruiterId) {
      const fetchRecruiterDetails = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/recruiterdetails/get?id=${recruiterId}`
          );
          if (response.ok) {
            const data = await response.json();
            setRecruiterDetails(data);
          } else {
            console.error("Failed to fetch recruiter details");
          }
        } catch (error) {
          console.error("Error fetching recruiter details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRecruiterDetails();
    }
  }, [recruiterId]);

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setRecruiterDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/recruiterdetails/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recruiterDetails),
      });
      if (response.ok) {
        alert("Details updated successfully!");
        onClose();
      } else {
        alert("Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating recruiter details:", error);
    }
  };

  return (
    <div className="grid absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-[90vh] w-4/5 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-lg p-6 mb-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-8">
          Update {recruiterDetails.recruiterName}
        </h1>
        <button
          onClick={onClose}
          className="px-2 py-1 h-12 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          Close ✕
        </button>
      </div>

      {loading ? <p>Loading...</p> : <p>Edit your details now</p>}
      <form onSubmit={handleFormSubmit}>
        <p
          htmlFor="recruiterName"
          className="text-base font-bold text-black mb-1"
        >
          Recruiter Name
        </p>
        <input
          type="text"
          name="recruiterName"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={recruiterDetails.recruiterName || ""}
          onChange={handleInputChange}
        />

        <p
          htmlFor="employeeRange"
          className="text-base font-bold text-black mb-1"
        >
          Employee Range
        </p>
        <input
          type="text"
          name="employeeRange"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={recruiterDetails.employeeRange || ""}
          onChange={handleInputChange}
        />

        <p
          htmlFor="contactNumber"
          className="text-base font-bold text-black mb-1"
        >
          Contact Number
        </p>
        <input
          type="text"
          name="contactNumber"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={recruiterDetails.contactNumber || ""}
          onChange={handleInputChange}
        />

        <p htmlFor="website" className="text-base font-bold text-black mb-1">
          Website
        </p>
        <input
          type="text"
          name="website"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={recruiterDetails.website || ""}
          onChange={handleInputChange}
        />
        <p htmlFor="industry" className="text-base font-bold text-black mb-1">
          Industry
        </p>
        <input
          type="text"
          name="industry"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={recruiterDetails.industry || ""}
          onChange={handleInputChange}
        />

        <p htmlFor="location" className="text-base font-bold text-black mb-1">
          Location
        </p>
        <input
          type="text"
          name="location"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={recruiterDetails.location || ""}
          onChange={handleInputChange}
        />
        <p
          htmlFor="firstnacompanyDescriptionme"
          className="text-base font-bold text-black mb-1"
        >
          Company Description
        </p>
        <textarea
          name="companyDescription"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={recruiterDetails.companyDescription || ""}
          onChange={handleInputChange}
        />
        <p htmlFor="facebook" className="text-base font-bold text-black mb-1">
          Facebook
        </p>
        <input
          type="text"
          name="facebook"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={recruiterDetails.facebook || ""}
          onChange={handleInputChange}
        />
        <p htmlFor="instagram" className="text-base font-bold text-black mb-1">
          Instagram
        </p>
        <input
          type="text"
          name="instagram"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={recruiterDetails.instagram || ""}
          onChange={handleInputChange}
        />
        <p htmlFor="linkedin" className="text-base font-bold text-black mb-1">
          LinkedIn
        </p>
        <input
          type="text"
          name="linkedin"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={recruiterDetails.linkedin || ""}
          onChange={handleInputChange}
        />
        <p htmlFor="x" className="text-base font-bold text-black mb-1">
          X
        </p>
        <input
          type="text"
          name="x"
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
          value={recruiterDetails.x || ""}
          onChange={handleInputChange}
        />
        <br />
        <button
          type="submit"
          className="w-96 px-4 py-2 mt-5 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors"
        >
          Update Details
        </button>
      </form>
    </div>
  );
}

export default RecruiterEdit;
