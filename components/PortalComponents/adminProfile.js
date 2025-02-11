"use client"

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PortalLoading from "@/app/Portal/loading";
import AdminEditForm from "@/app/Portal/profile/adminEditForm";

export default function AdminProfile() {

    const { data: session, status } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCredentialsForm, setShowCredentialsForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [userDetails, setUserDetails] = useState({
        _id: '',
        firstName: "",
        lastName: "",
        contactNumber: "",
        email: "",
        profileImage: "",
        createdAt: ""
    })

    useEffect(() => {
        if (session?.user?.email) {
            const fetchDetails = async () => {
                try {

                    const userResponse = await fetch(`/api/users/get?id=${session.user.id}`);
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

    // image updae functions
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
            formData.append("email", userDetails.email);

            console.log("Starting image upload...");
            const response = await fetch("/api/users/uploadimage", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to upload image");
            }

            console.log("Upload successful:", data);
            setUserDetails((prev) => ({
                ...prev,
                profileImage: data.imageUrl,
            }));

            alert("Logo uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            alert(`Failed to upload image: ${error.message}`);
        }
    };

    const date = new Date(userDetails.createdAt).getDate();
    const monthName = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const d = new Date(userDetails.createdAt);
    let month = monthName[d.getMonth()];
    const year = new Date(userDetails.createdAt).getFullYear();
    const postedDate = `${date} ${month} ${year}`;

    if (isLoading) {
        return (<PortalLoading />);
    }

    return (
        <>
            <div className="bg-white rounded-3xl pt-5 pb-5 px-7">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="font-bold text-xl">My Profile</h1>
                    <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-end shadow-md w-12 h-12 mr-3 z-0">
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

                {/* Profile Image */}
                <div className="relative flex flex-row justify-between">

                    {/* DP Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-[180px] lg:h-[180px] mt-10 flex items-top justify-center relative">

                        {/* Profile picture container */}
                        <div className="relative border-4 border-[#001571] bg-white rounded-full overflow-hidden w-24 h-24 sm:w-28 sm:h-28 lg:w-[180px] lg:h-[180px]">
                            {userDetails.profileImage ? (
                                <Image
                                    src={userDetails.profileImage}
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
                </div>

                <div className="w-full h-auto flex flex-row gap-5 text-base font-bold mt-20">
                    <div className="w-1/2 flex flex-col gap-3">
                        <h1 className="text-[#001571]">First Name</h1>
                        <input
                            type="text"
                            value={session.user.firstName || ""}
                            disabled
                            className="px-4 py-2 w-full border-solid border-[1px] border-[#B0B6D3] rounded-xl font-semibold"
                        />
                    </div>
                    <div className="w-1/2 flex flex-col gap-3">
                        <h1 className="text-[#001571]">Last Name</h1>
                        <input
                            type="text"
                            value={session.user.lastName || ""}
                            disabled
                            className="px-4 py-2 w-full border-solid border-[1px] border-[#B0B6D3] rounded-xl font-semibold"
                        />
                    </div>
                </div>

                <div className="w-full h-auto flex flex-row gap-5 text-base font-bold mt-8">
                    <div className="w-1/2 flex flex-col gap-3">
                        <h1 className="text-[#001571]">Email</h1>
                        <input
                            type="text"
                            value={session.user.email || ""}
                            disabled
                            className="px-4 py-2 w-full border-solid border-[1px] border-[#B0B6D3] rounded-xl font-semibold"
                        />
                    </div>
                    <div className="w-1/2 flex flex-col gap-3">
                        <h1 className="text-[#001571]">Contact Number</h1>
                        <input
                            type="text"
                            value={userDetails.contactNumber || ""}
                            disabled
                            className="px-4 py-2 w-full border-solid border-[1px] border-[#B0B6D3] rounded-xl font-semibold"
                        />
                    </div>
                </div>

                <div className="w-full h-auto flex flex-row gap-5 text-base font-bold mt-8">
                    <div className="w-full flex flex-col gap-3">
                        <h1 className="text-[#001571]">Account Creation Date</h1>
                        <input
                            type="text"
                            value={postedDate || ""}
                            disabled
                            className="px-4 py-2 w-full border-solid border-[1px] border-[#B0B6D3] rounded-xl font-semibold"
                        />
                    </div>
                </div>
            </div>

            {showCredentialsForm && (
                <AdminEditForm
                    userDetails={userDetails}
                    isSubmitting={isSubmitting}
                    onClose={() => setShowCredentialsForm(false)}
                    onSubmit={credSubmitHandler}
                    onInputChange={handleCredInputChange}
                />
            )}
        </>
    );
}
