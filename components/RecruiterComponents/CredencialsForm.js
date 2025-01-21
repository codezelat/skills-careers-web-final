import Image from "next/image";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function CredencialsForm({ onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [recruiterDetails, setRecruiterDetails] = useState({
    _id: "",
    userName: "",
    email: "",
    phone: "",
    membership: "",
  });

  // Handling input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecruiterDetails((prev) => ({ ...prev, [name]: value }));
  };
    useEffect(() => {
      if (recruiter) {
        setRecruiterDetails(recruiter);
      }
    }, [recruiter]);
  
    const handleImageChange = async (e) => {
      e.preventDefault();
      const file = e.target.files[0];
  
  
  
      try {
        const formData = new FormData();
  
        const response = await fetch("/api/recruiter/uploadimage", {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
  
  
        console.log("Upload successful:", data);
        setRecruiterDetails((prev) => ({
          ...prev,
        }));
  
      } catch (error) {
      }
    };
  

  // form submitting to update
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    onClose();

    try {
      let formData = new FormData();
      
      // Add basic details
      formData.append("_id", recruiterDetails._id);
      formData.append("userName", recruiterDetails.userName);
      formData.append("email", recruiterDetails.email);
      formData.append("phone", recruiterDetails.phone);
      formData.append("membership", recruiterDetails.membership);

      
      const response = await fetch(`/api/recruiter/update?id=${_id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Details updated successfully!");
        onClose();
        window.location.reload();
      } else {
        alert(data.message || "Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating Recruiter details:", error);
      alert("Error updating details: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-md p-8 scrollbar-hide">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-semibold text-[#001571]">Edit Credencial Profile</h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="border-t-2 border-gray-200 mb-4" />

        <form
          className="space-y-6"
          onSubmit={submitHandler}
        >
            <div>
              <label className="block text-sm font-semibold text-[#001571]">User Name</label>
              <input
                type="text"
                name="userName"
                value={recruiterDetails.userName}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#001571]"> Email</label>
              <input
                type="text"
                name="email"
                value={recruiterDetails.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571]">Phone</label>
              <input
                type="text"
                name="phone"
                value={recruiterDetails.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-[#B0B6D3] rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2"
              />
            </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001571]">Membership</label>
              <select
                  name="membership"
                  value={recruiterDetails.membership}
                  onChange={handleInputChange}
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

            <div className="border-t-2 border-gray-200 mt-4" />
            <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#001571] text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            >
              <div className="flex items-center space-x-3">
                <p>Save</p>
                <Image src="/images/whitetick.png" alt="tick" width={20} height={10} />
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
