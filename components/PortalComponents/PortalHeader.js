import Image from "next/image";
import { IoSearchSharp } from "react-icons/io5";
import { useSession } from "next-auth/react";

export default function HeaderSection() {

    const { data: session, status } = useSession();
    console.log("Session Data:", session);

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 h-[60px] ">
                {/* Left Section */}
                <div className="bg-[#001571] flex items-center justify-center text-white h-full px-8 rounded-2xl font-semibold text-[18px]">
                    SKILLS CAREERS
                </div>

                {/* Middle Section */}
                <div className="flex-grow mx-8 h-full">
                    <div className="bg-white flex items-center pl-8 pr-4 h-full rounded-2xl shadow-sm w-full">
                        <IoSearchSharp size={25} />
                        <input
                            type="text"
                            placeholder="Search Job Listings..."
                            className="ml-2 text-gray-500 outline-none w-full text-[16px]"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center bg-white px-8 h-full rounded-2xl shadow-sm gap-4">
                    <div className="text-left">
                        <p className="font-bold text-[#001571] text-[16px]">{session?.user?.firstName} {session?.user?.lastName}</p>
                        <p className="text-sm font-bold text-gray-400">{session?.user?.role}</p>
                    </div>
                    {session?.user?.profileImage ? (
                        <Image
                            src={session?.user?.profileImage}
                            alt="Admin Profile"
                            width={50}
                            height={50}
                            className="rounded-md border-2 border-[#001571]"
                        />
                    ) : (
                        <Image
                            src="/default-avatar.jpg"
                            alt="Admin Profile"
                            width={50}
                            height={50}
                            className="rounded-md border-2 border-[#001571]"
                        />
                    )}
                </div>
            </div>
        </>
    );
}