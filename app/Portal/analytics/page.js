import BarChart from "@/components/PortalComponents/barChart";
import HighDemandJobCard from "@/components/PortalComponents/highDemandJobCard";
import LineChart from "@/components/PortalComponents/lineChart";
import TopJobPostersCard from "@/components/PortalComponents/topJobPostersCard";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import Link from "next/link";
import { IoIosArrowDroprightCircle } from "react-icons/io";

export default function AnalyticsPage() {
    return (
        <>
            {/* Analytics Charts */}
            <div className="bg-white shadow-md rounded-3xl py-4 px-6">
                <h1 className="font-bold text-lg text-[#001571]">Analytics</h1>
                <div className="flex flex-row mt-10">
                    <div className="w-1/2 border-r-2 pr-8">
                        <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-base">
                            <p>Job Posts</p>
                            <Link href="">
                                <p className="flex">This Week</p>
                            </Link>
                        </div>
                        <LineChart />
                    </div>
                    <div className="w-1/2 pl-8">
                        <div className="flex justify-between gap-4 mb-8 text-[#001571] font-bold text-base">
                            <p>Active Users</p>
                            <Link href="">
                                <p className="flex">This Week</p>
                            </Link>
                        </div>
                        <BarChart />
                    </div>
                </div>
            </div>

            {/* Analytics lists */}
            <div className="flex flex-row gap-4 mt-6">

                {/* high demand job list */}
                <div className="bg-white shadow-md rounded-3xl py-4 px-6 w-full">
                    <div className="flex flex-row justify-between w-full font-bold text-base mb-8">
                        <h1>High Demand Job Posts</h1>
                        <Link href="/Portal/jobsAdmin">
                            <p className="flex gap-2 items-center text-[#001571]">
                                View All
                                <IoIosArrowDroprightCircle size={20} />
                            </p>
                        </Link>
                    </div>
                    <div className="overflow-y-auto h-[250px]">
                        <HighDemandJobCard />
                    </div>
                </div>

                {/* top job posters */}
                <div className="bg-white shadow-md rounded-3xl py-4 px-6 w-full">
                    <div className="flex flex-row justify-between w-full mb-8 font-bold text-base">
                        <h1>Top Job Posters</h1>
                        <Link href="/Portal/recruiter">
                            <p className="flex gap-2 items-center text-[#001571]">
                                View All
                                <IoIosArrowDroprightCircle size={20} />
                            </p>
                        </Link>
                    </div>
                    <div className="overflow-y-auto h-[250px]">
                        <TopJobPostersCard />
                    </div>
                </div>
            </div>
        </>
    )
}