"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { RiDeleteBinFill, RiEdit2Fill } from "react-icons/ri";
import { FaCircleChevronRight } from "react-icons/fa6";
import { useSession } from "next-auth/react";

export default function InquiryCard({ inquiry, onViewInquiry }) {

    const { data: session, status } = useSession();
    
    const [jobseekerDetails, setJobseekerDetails] = useState({
        profileImage: "",
    });

    const [userDetails, setUserDetails] = useState({
        profileImage: "",
    });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(
                    `/api/users/get?id=${inquiry.userId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setUserDetails(data);
                } else {
                    console.error("Failed to fetch user details");
                }
            } catch (error) {
                console.error("Error occurred while fetching details:", error);
            }
        };

        fetchDetails();
    }, [inquiry]);

    const handleViewInquiry = () => {
        onViewInquiry?.();
    };

    // date and time
    const date = new Date(inquiry.createdAt).getDate();
    const monthName = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];
    const d = new Date(inquiry.createdAt);
    let month = monthName[d.getMonth()];
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const seconds = d.getSeconds().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const postedDate = `${date} ${month} ${year}`;
    const postedTime = `${hours} : ${minutes} : ${seconds} ${ampm}`;


    return (
        <>
            <div className="py-4 rounded-lg transition-shadow border-b border-gray-200 flex items-center text-sm font-semibold">
                <div className="flex flex-row space-x-3 w-[25%] items-center">
                    {/* Logo */}
                    <div className="">
                        <Image
                            src={userDetails?.profileImage || "/images/default-image.jpg"}
                            alt="Recruiter Logo"
                            width={45}
                            height={45}
                            className="rounded-full shadow-lg"
                        />
                    </div>
                    {/* Name */}
                    <div className="items-center">{inquiry.userName}</div>
                </div>
                {/* role */}
                <div className="py-3 font-semibold w-[20%] flex items-center">{inquiry.userRole}</div>
                {/* date */}
                <div className="py-3 font-semibold w-[20%] flex items-center">{postedDate}</div>
                {/* time */}
                <div className="py-3 font-semibold w-[20%] flex items-center">{postedTime}</div>
                {/* Actions */}
                <div className="py-3 flex gap-2 ml-auto justify-end w-[15%] items-center">
                    <button
                        className="flex items-center justify-center w-full bg-[#001571] text-white px-4 py-3 rounded-lg shadow hover:bg-blue-800"
                    // onClick={() => setShowRecruiter(true)}
                    >
                        <span>View Now</span>
                        <span className="ml-2">
                            <FaCircleChevronRight size={15} />
                        </span>
                    </button>
                </div>
            </div>
        </>
    )
}