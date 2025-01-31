"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PortalLoading from "../loading";
import { FaDribbble, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaTimes, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import { PiCheckCircle } from "react-icons/pi";
import CredentialsForm from "./credentialsEditForm";

export default function RecruiterSettings() {

    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState("Profile");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [showCredentialsForm, setShowCredentialsForm] = useState(false);
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
        companyDescription: "",
        facebook: "",
        instagram: "",
        linkedin: "",
        x: "",
        github: "",
        dribbble: ""

    });

    const [userDetails, setUserDetails] = useState({
        _id: '',
        firstName: "",
        lastName: "",
        contactNumber: "",
        email: "",
        profileImage: "",
    })

    useEffect(() => {
        if (session?.user?.email) {
            const fetchDetails = async () => {
                try {
                    const recruiterResponse = await fetch(`/api/recruiterdetails/get?userId=${session.user.id}`);
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

                    setUserDetails(userData.user);
                    console.log("first name : ", userDetails.firstName);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchDetails();
        }
    }, [session]);

    // Recruiter credentials details update
    const credSubmitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/users/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDetails),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setShowCredentialsForm(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Update failed:', error);
            alert(error.message || 'Update failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Input Change Handler
    const handleCredInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };


    if (isLoading) {
        return (<PortalLoading />);
    }

    return (
        <>
            <div className="bg-white rounded-3xl py-7 px-7">



                <div className="min-h-screen">
                    {/* Edit Button */}
                    <div className="flex flex-row items-center justify-between">
                        <h1 className="font-bold text-xl">Settings</h1>
                        <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-end shadow-md w-12 h-12 mt-3 mr-3 z-0">
                            <button
                                onClick={() => setShowCredentialsForm(true)}
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
                        </div>
                    </div>
                    <form className="mt-10">
                        <div className="">
                            <label className="block text-sm font-semibold text-[#001571]">
                                User Name
                            </label>
                            <input
                                type="text"
                                name="User Name"
                                value={`${userDetails.firstName} ${userDetails.lastName}`}
                                disabled
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
                                        disabled
                                        value={userDetails.email}
                                        className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm font-medium px-4 py-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[#001571]">
                                        Contact Number
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        disabled
                                        value={userDetails.telephoneNumber}
                                        className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm font-medium px-4 py-3"
                                    />
                                </div>
                            </div>
                            {/* Recruiter Package Dropdown */}
                            {/* <div>
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
                                </div> */}
                        </div>
                    </form>

                    {showCredentialsForm && (
                        <CredentialsForm
                            userDetails={userDetails}
                            isSubmitting={isSubmitting}
                            onClose={() => setShowCredentialsForm(false)}
                            onSubmit={credSubmitHandler}
                            onInputChange={handleCredInputChange}
                        />
                    )}

                </div>
            </div>
        </>
    )
}