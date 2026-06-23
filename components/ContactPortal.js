"use client";

import Image from "next/image";
import { useState } from "react";
import Swal from "sweetalert2";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/inquiry/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.name,
          userRole: "guest",
          inquiryTitle: formData.subject,
          inquiryDescription: `Email: ${formData.email}\nContact: ${formData.contactNumber}\n\n${formData.message}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit inquiry.");
      }

      setFormData({
        name: "",
        email: "",
        contactNumber: "",
        subject: "",
        message: "",
      });

      Swal.fire({
        title: "Success!",
        text: "Your message has been sent. We will get back to you soon.",
        icon: "success",
        confirmButtonColor: "#001571",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#001571",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] flex flex-col md:flex-row justify-between my-24">
        {/* Contact Form */}
        <div className="w-full md:w-1/3 sm:2/5 lg:w-1/2 pr-10">
          <h3 className="text-blue-900 text-lg md:text-xl font-semibold mb-3">
            STILL YOU ARE IN TROUBLE? LET'S REACH US.
          </h3>
          <form onSubmit={handleSubmit}>
            <label className="block">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg mt-4 md:mt-6 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-semibold"
                placeholder="Name"
              />
            </label>
            <label className="block">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg mt-4 md:mt-6 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-semibold"
                placeholder="Email"
              />
            </label>
            <label className="block">
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg mt-4 md:mt-6 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-semibold"
                placeholder="Contact Number"
              />
            </label>
            <label className="block">
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg mt-4 md:mt-6 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-semibold"
                placeholder="Subject"
              />
            </label>
            <label className="block mb-6 md:mb-10">
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg mt-4 md:mt-6 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-semibold"
                placeholder="Message"
                rows={7}
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-900 text-gray-100 px-20 py-3 rounded-md disabled:opacity-50"
            >
              <span className="flex items-start justify-center">
                {isSubmitting ? "Sending..." : "Submit"}
                <img
                  src="/images/arrow.png"
                  alt="Submit"
                  className="h-5 w-5 ml-5"
                />
              </span>
            </button>
          </form>
        </div>

        {/* Images Section */}
        <div className="h-[400px] md:h-auto w-full md:w-2/3 sm:w-3/5 lg:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
          <div className="flex gap-1 md:gap-4 w-full">
            <div className="relative flex-1">
              <Image
                src="/images/ppl4.png"
                alt="Person 1"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="relative flex-1">
              <Image
                src="/images/pp3.png"
                alt="Person 2"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="relative flex-1">
              <Image
                src="/images/pp2.png"
                alt="Person 3"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="relative flex-1">
              <Image
                src="/images/ppl1.png"
                alt="Person 4"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
