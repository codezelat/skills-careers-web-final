import { formatDate } from "@/handlers";
import Image from "next/image";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useSession } from "next-auth/react";

export default function PressReleaseCard(props, onViewPressrelease) {

    const { data: session, status } = useSession();

    const handleViewPressrelease = () => {
        onViewPressrelease?.();
    };

    const {
        _id,
        title,
        description,
        image,
        createdAt
    } = props.pressrelease;

    const date = new Date(createdAt).getDate();
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
    const d = new Date(createdAt);
    let month = monthName[d.getMonth()];
    const year = new Date(createdAt).getFullYear();
    const postedDate = `${date} ${month} ${year}`;

    return (
        <div className="relative bg-white rounded-3xl shadow-md overflow-hidden"
            onClick={handleViewPressrelease()}>
            {/* Main Image */}
            <div className="relative w-full h-48">
                <Image
                    src={image}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                />
                {/* Action Icons */}
                {session?.user?.role === "admin" && (
                    <div className="absolute top-2 right-2 flex space-x-2">
                        <button className="flex justify-center items-center rounded-full shadow-md w-[45px] h-[45px] bg-white">
                            <MdOutlineModeEdit
                                size={25}
                                color="#001571" />
                        </button>
                        <button className="flex justify-center items-center rounded-full shadow-md w-[45px] h-[45px] bg-white">
                            <RiDeleteBin5Line
                                size={25}
                                color="#001571" />
                        </button>
                    </div>
                )}
            </div>
            {/* Text Content */}
            <div className="py-5">
                <h3 className="text-md font-medium text-gray-800 px-4">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 px-4 mt-5">{postedDate}</p>
            </div>
        </div>
    );

}