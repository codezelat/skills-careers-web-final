import Image from "next/image";
import { GoArrowUp } from "react-icons/go";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { useSession } from "next-auth/react";

export default function DashboardStats() {

    const { data: session, status } = useSession();

    return (
        <>
            {/* If admin */}
            {session?.user?.role === "admin" && (
                <div className="grid grid-cols-4 gap-6 mb-6">
                    {[
                        {
                            title: "Jobs",
                            count: 28,
                            growth: "+2.5% ",
                            since: "Since Yesterday",
                            icon: "/portal-dashboard/flag.png",
                        },
                        {
                            title: "Applications",
                            count: 1889,
                            growth: "+6.5% ",
                            since: "Since Yesterday",
                            icon: "/portal-dashboard/document.png",
                        },
                        {
                            title: "Recruiters",
                            count: 428,
                            growth: "+1.5% ",
                            since: " Since Last Month",
                            icon: "/portal-dashboard/buliding.png",
                        },
                        {
                            title: "Candidates",
                            count: 5670,
                            growth: "+1.5% ",
                            since: "Since Last Month",
                            icon: "/portal-dashboard/people.png",
                        },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl shadow-md">
                            <div className="flex justify-between items-center">
                                <h2 className="text-base font-semibold text-[#8A93BE] flex items-center">
                                    {item.title}
                                    <span className="ml-2">
                                        <IoIosArrowDroprightCircle />
                                    </span>
                                </h2>
                                <Image src={item.icon} alt="Flag icon" width={35} height={35} />
                            </div>
                            <div className="text-3xl font-bold text-[#001571] mt-1">
                                {item.count}
                            </div>
                            <p className="flex text-[#1AB810] font-bold text-sm mt-3">
                                <span className="mt-1 text-[#000000]">
                                    <GoArrowUp />
                                </span>
                                {item.growth}
                                <span className="ml-2 text-[#000000]">{item.since}</span>
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* If candidate */}
            {session?.user?.role === "jobseeker" && (
                <div className="grid grid-cols-3 gap-6 mb-6">
                    {[
                        {
                            title: "Applications",
                            count: 12,
                            growth: "+2.5% ",
                            since: "Since Last Month",
                            icon: "/portal-dashboard/flag.png",
                        },
                        {
                            title: "Impressions",
                            count: 221,
                            growth: "+6.5% ",
                            since: "Since Last Month",
                            icon: "/portal-dashboard/document.png",
                        },
                        {
                            title: "Profile Views",
                            count: 8,
                            growth: "+1.5% ",
                            since: " Since Last Month",
                            icon: "/portal-dashboard/buliding.png",
                        },

                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl shadow-md">
                            <div className="flex justify-between items-center">
                                <h2 className="text-base font-semibold text-[#8A93BE] flex items-center">
                                    {item.title}
                                    <span className="ml-2">
                                        <IoIosArrowDroprightCircle />
                                    </span>
                                </h2>
                                <Image src={item.icon} alt="Flag icon" width={35} height={35} />
                            </div>
                            <div className="text-3xl font-bold text-[#001571] mt-1">
                                {item.count}
                            </div>
                            <p className="flex text-[#1AB810] font-bold text-sm mt-3">
                                <span className="mt-1 text-[#000000]">
                                    <GoArrowUp />
                                </span>
                                {item.growth}
                                <span className="ml-2 text-[#000000]">{item.since}</span>
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* If recruiter */}
            {session?.user?.role === "recruiter" && (
                <div className="grid grid-cols-3 gap-6 mb-6">
                    {[
                        {
                            title: "Job Posts",
                            count: 12,
                            growth: "+6.5% ",
                            since: "Since Last Month",
                            icon: "/portal-dashboard/flag.png",
                        },
                        {
                            title: "Applications",
                            count: 221,
                            growth: "+1.5% ",
                            since: "Since Last Month",
                            icon: "/portal-dashboard/document.png",
                        },
                        {
                            title: "Profile Views",
                            count: 8,
                            growth: "+1.5% ",
                            since: " Since Last Month",
                            icon: "/portal-dashboard/buliding.png",
                        },

                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl shadow-md">
                            <div className="flex justify-between items-center">
                                <h2 className="text-base font-semibold text-[#8A93BE] flex items-center">
                                    {item.title}
                                    <span className="ml-2">
                                        <IoIosArrowDroprightCircle />
                                    </span>
                                </h2>
                                <Image src={item.icon} alt="Flag icon" width={35} height={35} />
                            </div>
                            <div className="text-3xl font-bold text-[#001571] mt-1">
                                {item.count}
                            </div>
                            <p className="flex text-[#1AB810] font-bold text-sm mt-3">
                                <span className="mt-1 text-[#000000]">
                                    <GoArrowUp />
                                </span>
                                {item.growth}
                                <span className="ml-2 text-[#000000]">{item.since}</span>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}