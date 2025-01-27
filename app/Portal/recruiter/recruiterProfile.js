"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PortalLoading from "../loading";
import { FaDribbble, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTimes, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import { PiCheckCircle } from "react-icons/pi";

export default function RecruiterProfile({ slug }) {

    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState("Profile");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [recruiterDetails, setRecruiterDetails] = useState({
        _id: "",
        recruiterName: "",
        email: "",
        employeeRange: "",
        contactNumber: "",
        userId: "",
        createdAt: "",
        location: "",
        industry: "",
        membership: "",
        coverImage: "",
        website: "",
        companyDescription: ""

    });

    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        profileImage: "",
    })

    useEffect(() => {
        if (session?.user?.email) {
            const fetchDetails = async () => {
                try {
                    const recruiterResponse = await fetch(`/api/recruiterdetails/get?id=${slug}`);
                    const recruiterData = await recruiterResponse.json();

                    if (!recruiterResponse.ok) {
                        throw new Error(recruiterData.message || "Failed to fetch recruiter details");
                    }

                    setRecruiterDetails(recruiterData);

                    const userResponse = await fetch(`/api/users/get?id=${recruiterData.userId}`);
                    const userData = await userResponse.json();

                    if (!userResponse.ok) {
                        throw new Error(userData.message || "Failed to fetch user details");
                    }

                    setUserDetails(userData);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchDetails();
        }
    }, [session, slug]);

    const handleImageChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("File size should be less than 5MB");
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("email", recruiterDetails.email);

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

    const handleCoverImageChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("File size should be less than 5MB");
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("email", recruiterDetails.email);

            console.log("Starting image upload...");
            const response = await fetch("/api/recruiterdetails/uploadCoverImage", {
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

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setRecruiterDetails((prev) => ({ ...prev, [name]: value }));
    };

    const submitHandler = async (e) => {
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


    if (isLoading) {
        return (<PortalLoading />);
    }

    return (
        <>
            <div className="bg-white rounded-3xl py-7 px-7">

                {/* Tabs */}
                <div className="flex items-center justify-center p-1 mb-5 bg-[#E6E8F1] rounded-[20px] w-max text-sm font-medium">
                    {/* All Recruiters Button */}
                    <button
                        onClick={() => setActiveTab("Profile")}
                        className={`px-6 py-3 flex rounded-2xl ${activeTab === "Profile"
                            ? "bg-[#001571] text-white"
                            : "text-[#B0B6D3] bg-[#E6E8F1]"
                            }`}
                    >
                        Profile
                        <span className="ml-2">
                            <PiCheckCircle size={20} />
                        </span>
                    </button>

                    {/* Restricted Recruiters Button */}
                    <button
                        onClick={() => setActiveTab("Credentials")}
                        className={`px-6 py-3 flex rounded-2xl text-sm font-semibold ${activeTab === "Credentials"
                            ? "bg-[#001571] text-white"
                            : "text-[#B0B6D3] bg-[#E6E8F1]"
                            }`}
                    >
                        Credentials
                        <span className="ml-2">
                            <PiCheckCircle size={20} />
                        </span>
                    </button>
                </div>

                {activeTab === "Profile" ? (
                    <div>
                        <div className="">
                            {/* Background Image */}
                            <div className="bg-red-300 relative w-full h-[300px] rounded-t-2xl overflow-hidden flex items-top justify-end">
                                {recruiterDetails.coverImage ? (
                                    <Image
                                        src={recruiterDetails.coverImage}
                                        alt="Background"
                                        layout="fill"
                                        priority
                                        objectFit="cover"
                                        quality={100}
                                    />
                                ) : (
                                    <Image
                                        src="/recruiterbg.png"
                                        alt="Background"
                                        layout="fill"
                                        priority
                                        objectFit="cover"
                                        quality={100}
                                    />
                                )}
                                {/* cover image edit btn */}
                                <div className="z-10 rounded-full relative overflow-hidden flex flex-wrap items-center justify-end shadow-md w-12 h-12 mt-3 mr-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverImageChange}
                                        id="logo-image-input"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <Image
                                        id="cover-image-input"
                                        src="/editiconwhite.png"
                                        alt="Edit Icon"
                                        layout="fill"
                                        objectFit="contain"
                                        quality={100}
                                        className="cursor-pointer"
                                    />
                                </div>

                            </div>
                            {/* Profile Image */}
                            <div className="relative flex flex-row justify-between">

                                {/* DP Image */}
                                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-[180px] lg:h-[180px] mt-[-92px] ml-10 flex items-top justify-center relative">

                                    {/* Profile picture container */}
                                    <div className="relative border-4 border-[#001571] bg-white rounded-full overflow-hidden w-24 h-24 sm:w-28 sm:h-28 lg:w-[180px] lg:h-[180px]">
                                        {recruiterDetails.logo ? (
                                            <Image
                                                src={recruiterDetails.logo}
                                                alt="Profile"
                                                layout="fill"
                                                priority
                                                objectFit="cover"
                                                quality={100}
                                                className="fill"
                                            />
                                        ) : (
                                            <Image
                                                src="/default-avatar.jpg"
                                                alt="Profile"
                                                layout="fill"
                                                priority
                                                objectFit="cover"
                                                quality={100}
                                                className="fill"
                                            />
                                        )}
                                    </div>

                                    {/* Profile picture edit icon */}
                                    <div className="absolute top-0 right-0 w-12 h-12 rounded-full flex items-center justify-center shadow-md z-0 bg-white">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            id="logo-image-input"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        {/* Edit Icon */}
                                        <Image
                                            src="/editiconwhite.png"
                                            alt="Edit Icon"
                                            width={40}
                                            height={40}
                                            objectFit="contain"
                                            quality={100}
                                        />
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="pr-8 sm:pr-6 flex justify-end mt-4 space-x-2 sm:space-x-4 text-blue-900 ">
                                    <FaLinkedin size={30} className="cursor-pointer" />
                                    <FaTwitter size={30} className="cursor-pointer" />
                                    <FaInstagram size={30} className="cursor-pointer" />
                                    <FaFacebook size={30} className="cursor-pointer" />
                                    <FaGithub size={30} className="cursor-pointer" />
                                    <FaDribbble size={30} className="cursor-pointer" />
                                </div>
                            </div>

                        </div>

                        <div className="pt-8 sm:pt-14">
                            <h1 className="text-center sm:text-left text-2xl sm:text-4xl md:text-3xl font-bold text-black">
                                {recruiterDetails.recruiterName} - {recruiterDetails.location}
                            </h1>

                            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between pr-2 sm:pr-5 space-y-4 sm:space-y-0 mt-0 text-sm w-full">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start space-y-4 sm:space-y-0 space-x-0 sm:space-x-4">
                                    <div className="flex items-center">
                                        <Image
                                            src="/worldsearch.png"
                                            width={20}
                                            height={20}
                                            alt="Website"
                                            className="rounded-full"
                                        />
                                        <p className="text-black ml-2 font-semibold text-base">
                                            {recruiterDetails.email}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <Image
                                            src="/reward.png"
                                            width={20}
                                            height={20}
                                            alt="Industry"
                                            className="rounded-full"
                                        />
                                        <p className="text-black ml-2 font-semibold text-base">
                                            {recruiterDetails.industry}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <Image
                                            src="/attach.png"
                                            width={20}
                                            height={20}
                                            alt="Employees"
                                            className="rounded-full"
                                        />
                                        <p className="text-black ml-2 font-semibold text-base">
                                            {recruiterDetails.employeeRange}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center sm:justify-end w-full sm:w-auto sm:pt-2 z-0">
                                    <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-end shadow-md w-12 h-12 mt-3 mr-3 z-0">
                                        <button
                                            onClick={() => setShowApplicationForm(true)}
                                            className="text-white px-3 py-2 sm:px-4 rounded-md z-10">
                                            <div className="flex gap-2">
                                                <Image
                                                    src="/editiconwhite.png"
                                                    alt="Edit Icon"
                                                    layout="fill"
                                                    objectFit="contain"
                                                    quality={100}
                                                />
                                            </div>
                                        </button>
                                        <Image
                                            src="/editiconwhite.png"
                                            alt="Edit Icon"
                                            layout="fill"
                                            objectFit="contain"
                                            quality={100}
                                            className="z-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-left space-y-4 mt-10">
                            <h5 className="lg:text-xl md:text-xl sm:text-2xl lg:text-left md:text-left sm:text-center font-bold text-[#001571] ">
                                Company Description
                            </h5>
                            <p className="text-justify font-medium">
                                {recruiterDetails.companyDescription}
                            </p>
                        </div>

                        {/* Edit Profile Form Popup */}
                        {showApplicationForm && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="w-2/3 max-w-4xl bg-white p-6 rounded-lg shadow-lg flex flex-col max-h-[90vh]">

                                    <div className="flex items-center justify-between mb-4 border-b-2 border-gray-200 pb-4">
                                        <h4 className="text-2xl font-semibold text-[#001571]">Edit Profile</h4>
                                        <button
                                            // onClick={onClose}
                                            className="text-gray-500 hover:text-red-500 focus:outline-none"
                                        >
                                            <FaTimes size={24} />
                                        </button>
                                    </div>

                                    <form className="flex-1 overflow-y-auto pr-4 space-y-7" onSubmit={submitHandler}>
                                        <div>
                                            <label className="block text-sm font-semibold text-[#001571]">Recruiter Name</label>
                                            <input
                                                type="text"
                                                name="recruiterName"
                                                value={recruiterDetails.recruiterName || ""}
                                                onChange={handleInputChange}
                                                className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-[#001571]">Location</label>
                                            <input
                                                type="text"
                                                name="location" // Updated name
                                                value={recruiterDetails.location || ""}
                                                onChange={handleInputChange}
                                                className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-[#001571]">Recruiter Category</label>
                                                <input
                                                    type="text"
                                                    name="industry" // Updated name
                                                    value={recruiterDetails.industry || ""}
                                                    onChange={handleInputChange}
                                                    className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-[#001571]">Employee Range</label>
                                                <input
                                                    type="text"
                                                    name="employeeRange" // Updated name
                                                    value={recruiterDetails.employeeRange || ""}
                                                    onChange={handleInputChange}
                                                    className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-[#001571]">Email</label>
                                                <input
                                                    type="text"
                                                    name="email" // Updated name
                                                    value={recruiterDetails.email || ""}
                                                    onChange={handleInputChange}
                                                    className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-[#001571]">Phone</label>
                                                <input
                                                    type="text"
                                                    name="contactNumber" // Updated name
                                                    value={recruiterDetails.contactNumber || ""}
                                                    onChange={handleInputChange}
                                                    className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-[#001571]">Company Description</label>
                                            <textarea
                                                name="companyDescription" // Updated name
                                                value={recruiterDetails.companyDescription || ""}
                                                onChange={handleInputChange}
                                                className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-4 py-3"
                                            />
                                        </div>

                                        <div className="mt-4 border-t-2 border-gray-200 pt-4 flex justify-end">
                                            <button
                                                type="submit"
                                                className="bg-[#001571] text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    {isSubmitting ? "Updating..." : "Update Recruiter"}
                                                    <Image src="/images/miyuri_img/whitetick.png" alt="tick" width={20} height={10} className="ml-3" />
                                                </div>
                                            </button>
                                        </div>
                                    </form>

                                </div>
                            </div>

                        )}

                    </div>
                ) : (
                    <div className="min-h-screen">
                        {/* Edit Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowApplicationForm(true)}
                                className="text-white px-3 py-2 sm:px-4 rounded-md"
                            >
                                <div className="flex gap-2">
                                    <Image
                                        src="/images/editicon.png"
                                        alt="edit"
                                        width={50}
                                        height={16}
                                    />
                                </div>
                            </button>
                        </div>
                        <form>
                            <div className="">
                                <label className="block text-sm font-semibold text-[#001571]">
                                    User Name
                                </label>
                                <input
                                    type="text"
                                    name="User Name"
                                    value={recruiterDetails.email}
                                    className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm font-medium px-4 py-3"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#001571]">
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={recruiterDetails.email}
                                            className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm font-medium px-4 py-3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#001571]">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            name="pone"
                                            value={recruiterDetails.contactNumber}
                                            className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm font-medium px-4 py-3"
                                        />
                                    </div>
                                </div>
                                {/* Recruiter Package Dropdown */}
                                <div>
                                    <label className="block text-sm font-semibold text-[#001571] mt-8">
                                        Membership
                                    </label>
                                    <select
                                        name="package"
                                        value={recruiterDetails.membership}
                                        // onChange={handleChange}
                                        className="mt-1 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm font-medium px-4 py-3"
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
                            </div>
                        </form>

                    </div>
                )}
            </div>
        </>
    )
}