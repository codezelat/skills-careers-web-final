import { formatDate } from "@/handlers";
import { useEffect, useState } from "react";

function UpdateInquiryForm({ inquiry, onClose }) {
  const [inquiryDetails, setInquiryDetails] = useState({
    _id: "",
    userName: "",
    userRole: "",
    inquiryTitle: "",
    inquiryDescription: "",
    createdAt: new Date(),
    status: "",
    reply: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setInquiryDetails(inquiry);
  }, [inquiry]);

  // Handling input change
  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setInquiryDetails((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/inquiry/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryDetails),
      });
      if (response.ok) {
        alert("Replied successfully!");
      } else {
        alert("Failed to Reply.");
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const date = formatDate(inquiryDetails.createdAt);

  return (
    <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-[90vh] w-1/2 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Reply Inquiry</h2>
        <button
          onClick={onClose}
          className="px-2 py-1 h-12 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          Close ✕
        </button>
      </div>

      <div>
        <p className="text-sm my-2">{inquiryDetails.userName}</p>
        <p className="text-sm my-2">{inquiryDetails.userRole}</p>
        <h1 className="text-xl font-semibold my-4">
          {inquiryDetails.inquiryTitle}
        </h1>

        <p className="text-sm my-2">{date}</p>
        <p className="text-sm text-gray-600">
          {inquiryDetails.inquiryDescription}
        </p>
      </div>

      <hr className="my-8" />

      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <p htmlFor="status" className="text-base font-bold text-black mb-1">
            Status
          </p>
          <select
            name="status"
            required
            value={inquiryDetails.status}
            onChange={handleInputChange}
            className="px-2 py-1 w-full text-sm text-black font-semibold placeholder:font-normal outline-none rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Solved">Solved</option>
          </select>
        </div>
        
        <div>
          <p htmlFor="reply" className="text-base font-bold text-black mb-1">
            Reply
          </p>
          <textarea
            type="text"
            name="reply"
            required
            value={inquiryDetails.reply || ""}
            onChange={handleInputChange}
            className="px-2 py-1 h-32 w-full border-solid border-2 border-gray-400 outline-none rounded mb-4"
          />
        </div>



        <div>
          <button className="w-full px-4 py-2 mt-5 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors">
            {isSubmitting ? "Replying..." : "Reply"}
          </button>
        </div>
      </form>
    </div>
  );
}
export default UpdateInquiryForm;
