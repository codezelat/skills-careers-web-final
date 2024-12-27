"use client";
import { useState } from "react";

async function createRecruiter(
  recruiterName, 
  employeeRange,
  email,
  contactNumber,
  website,
  companyDescription,
  industry,
  location,
  facebook,
  instagram,
  linkedin,
  x,
  password,
  confirmPassword
) {
  const response = await fetch("/api/auth/recruitersignup", {
    method: "POST",
    body: JSON.stringify({
      recruiterName,
      employeeRange,
      email,
      contactNumber,
      website,
      companyDescription,
      industry,
      location,
      facebook,
      instagram,
      linkedin,
      x,
      password,
      confirmPassword,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
}

function AddRecruiter({ onClose }) {
  const [recruiterName, setRecruiterName] = useState("");
  const [employeeRange, setEmployeeRange] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [x, setX] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function submitHandler(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await createRecruiter(
        recruiterName,
        employeeRange,
        email,
        contactNumber,
        website,
        companyDescription,
        industry,
        location,
        facebook,
        instagram,
        linkedin,
        x,
        password,
        confirmPassword
      );

      setRecruiterName("");
      setEmployeeRange("");
      setEmail("");
      setContactNumber("");
      setWebsite("");
      setCompanyDescription("");
      setIndustry("");
      setLocation("");
      setFacebook("");
      setInstagram("");
      setLinkedin("");
      setX("");
      setPassword("");
      setConfirmPassword("");

      console.log(result);
      alert(result.message);
      onClose();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  return (
    <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-[90vh] w-1/2 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Add Recruiter</h2>
        <button
          onClick={onClose}
          className="px-2 py-1 h-12 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          Close ✕
        </button>
      </div>

      <div className="grid justify-items-center">
        <form onSubmit={submitHandler} className="w-fit">
          <div>
            <p
              htmlFor="recruitername"
              className="text-base font-bold text-black mb-1"
            >
              Recruiter Name
            </p>
            <input
              type="text"
              name="recruitername"
              required
              value={recruiterName}
              onChange={(e) => setRecruiterName(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="employeerange"
              className="text-base font-bold text-black mb-1"
            >
              Employee Range
            </p>
            <input
              type="text"
              name="employeerange"
              required
              value={employeeRange}
              onChange={(e) => setEmployeeRange(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p htmlFor="email" className="text-base font-bold text-black mb-1">
              Email
            </p>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="contactnumber"
              className="text-base font-bold text-black mb-1"
            >
              Contact Number
            </p>
            <input
              type="text"
              name="contactnumber"
              required
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="website"
              className="text-base font-bold text-black mb-1"
            >
              Website
            </p>
            <input
              type="text"
              name="website"
              required
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="industry"
              className="text-base font-bold text-black mb-1"
            >
              Industry
            </p>
            <input
              type="text"
              name="industry"
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="location"
              className="text-base font-bold text-black mb-1"
            >
              Location
            </p>
            <input
              type="text"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="companyDescription"
              className="text-base font-bold text-black mb-1"
            >
              Company Description
            </p>
            <textarea
              name="companyDescription"
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="facebook"
              className="text-base font-bold text-black mb-1"
            >
              Facebook
            </p>
            <input
              type="text"
              name="facebook"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="instagram"
              className="text-base font-bold text-black mb-1"
            >
              Instagram
            </p>
            <input
              type="text"
              name="instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="linkedin"
              className="text-base font-bold text-black mb-1"
            >
              LinkedIn
            </p>
            <input
              type="text"
              name="linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p htmlFor="x" className="text-base font-bold text-black mb-1">
              X
            </p>
            <input
              type="text"
              name="x"
              value={x}
              onChange={(e) => setX(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>

          <div>
            <p
              htmlFor="password"
              className="text-base font-bold text-black mb-1"
            >
              Your Password
            </p>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>
          <div>
            <p
              htmlFor="confirmPassword"
              className="text-base font-bold text-black mb-1"
            >
              Confirm Password
            </p>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
            />
          </div>
          <div>
            <button className="w-96 px-4 py-2 mt-5 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors">
              Create New Recruiter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddRecruiter;
