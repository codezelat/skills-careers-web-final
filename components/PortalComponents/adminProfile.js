"use client"

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PortalLoading from "@/app/Portal/loading";

export default function AdminProfile() {

    const [isLoading, setIsLoading] = useState(true);
    const [userDetails, setUserDetails] = useState({
        contactNumber: "",
        createdAt: ""
    });

    const router = useRouter();
    const { data: session, status } = useSession();
    console.log(status);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(
                    `/api/users/get?id=${session.user.id}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setUserDetails(data);
                } else {
                    console.error("Failed to fetch jobseeker details");
                }
            } catch (error) {
                console.error("Error occurred while fetching details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [session]);

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
        return <PortalLoading />;
    }

    return (
        <>
            <div className="bg-white rounded-3xl pt-5 pb-5 px-7">
                <h1 className="text-xl font-bold text-[#001571]">My Profile</h1>

                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-[180px] lg:h-[180px] mt-7 flex items-top justify-center relative">

                    {/* Profile picture container */}
                    <div className="relative border-4 border-[#001571] bg-white rounded-full overflow-hidden w-24 h-24 sm:w-28 sm:h-28 lg:w-[180px] lg:h-[180px]">
                        {session.user.profileImage ? (
                            <Image
                                src={session.user.profileImage}
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
                    <div className="absolute top-0 right-0 w-12 h-12 rounded-full flex items-center justify-center shadow-md z-20 bg-white">
                        <input
                            type="file"
                            accept="image/*"
                            // onChange={handleImageChange}
                            id="logo-image-input"
                            className="absolute inset-0 opacity-0 cursor-pointer"
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

                <div className="w-full h-auto flex flex-row gap-5 text-base font-bold mt-20">
                    <div className="w-1/2 flex flex-col gap-3">
                        <h1 className="text-[#001571]">First Name</h1>
                        <input
                            type="text"
                            value={session.user.firstName}
                            disabled
                            className="px-4 py-2 w-full border-solid border-[1px] border-[#B0B6D3] rounded-xl font-semibold"
                        />
                    </div>
                    <div className="w-1/2 flex flex-col gap-3">
                        <h1 className="text-[#001571]">Last Name</h1>
                        <input
                            type="text"
                            value={session.user.lastName}
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
                            value={session.user.email}
                            disabled
                            className="px-4 py-2 w-full border-solid border-[1px] border-[#B0B6D3] rounded-xl font-semibold"
                        />
                    </div>
                    <div className="w-1/2 flex flex-col gap-3">
                        <h1 className="text-[#001571]">Contact Number</h1>
                        <input
                            type="text"
                            value={userDetails.contactNumber}
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
                            value={postedDate}
                            disabled
                            className="px-4 py-2 w-full border-solid border-[1px] border-[#B0B6D3] rounded-xl font-semibold"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
