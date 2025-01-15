import Image from "next/image";
import { IoSearchSharp } from "react-icons/io5";
import { useSession } from "next-auth/react";

export default function HeaderSection() {

    const { data: session, status } = useSession();
    console.log("Session Data:", session);

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                {/* Left Section */}
                <div className="bg-[#001571] text-white py-4 px-8 rounded-xl font-semibold">
                    SKILLS CAREERS
                </div>

                {/* Middle Section */}
                <div className="flex-grow mx-8">
                    <div className="bg-white flex items-center pl-8 pr-4 py-4 rounded-lg shadow-sm w-full">
                        <IoSearchSharp size={25} />
                        <input
                            type="text"
                            placeholder="Search Job Listings..."
                            className="ml-2 text-gray-500 outline-none w-full"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center bg-white px-5 py-1 rounded-lg shadow-sm">
                    <div className="text-left mr-4">
                        <p className="font-semibold text-[#001571]">{session?.user?.name}</p>
                        <p className="text-sm text-gray-400">{session?.user?.role}</p>
                    </div>
                    <Image
                        src="/dashboard/profile.png"
                        alt="Admin Profile"
                        width={50}
                        height={50}
                        className="rounded-md border-2 border-[#001571]"
                    />
                </div>
            </div>
        </>
    );
}