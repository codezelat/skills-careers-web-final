import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { RiDeleteBinFill, RiEdit2Fill } from "react-icons/ri";
import { BsFillEyeFill } from "react-icons/bs";
import { useRouter } from "next/navigation";

function JobCard(props) {
    const { data: session } = useSession();
    const router = useRouter();
    const [applicationCount, setApplicationCount] = useState(0);
    const [recruiterDetails, setRecruiterDetails] = useState({
        email: "",
        recruiterName: "",
        logo: "",
    });
    const [isPublished, setIsPublished] = useState(props.job.isPublished || false);
    const [isLoading, setIsLoading] = useState(false);

    const { _id, createdAt, jobTitle, recruiterId } = props.job;

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                // Fetch application count
                const appResponse = await fetch(
                    `/api/jobapplication/get?jobId=${_id}`
                );
                if (appResponse.ok) {
                    const appData = await appResponse.json();
                    setApplicationCount(appData.count);
                }

                // Fetch recruiter details for admin
                if (session?.user?.role === 'admin' && recruiterId) {
                    const recruiterResponse = await fetch(
                        `/api/recruiterdetails/get?id=${recruiterId}`
                    );
                    if (recruiterResponse.ok) {
                        const recruiterData = await recruiterResponse.json();
                        setRecruiterDetails(recruiterData);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchCounts();
    }, [recruiterId, session?.user?.role]);

    const handlePublishToggle = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/job/${_id}/publish`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !isPublished }),
            });

            if (response.ok) {
                setIsPublished(!isPublished);
                props.onJobStatusChanged?.(_id, !isPublished);
            }
        } catch (error) {
            console.error("Error updating job status:", error);
        }
        setIsLoading(false);
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/job/${_id}`, { method: "DELETE" });
                if (response.ok) props.onJobDeleted?.(_id);
            } catch (error) {
                console.error("Error deleting job:", error);
            }
            setIsLoading(false);
        }
    };

    const handleViewJob = () => {
        const path = session?.user?.role === "admin"
            ? `/Portal/jobsAdmin/${_id}`
            : `/Portal/jobsRecruiter/${_id}`;
        router.push(path);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    };

    return (
        <div className="gap-1 bg-white rounded-lg hover:shadow-md">
            <div className="w-full items-center">
                <div className="text-gray-700 hover:bg-gray-50 border-b text-sm flex items-center">
                    {session?.user?.role === "admin" && (
                        <>
                            <div className="py-3 text-black font-semibold w-[3%]"></div>
                            <div className="py-3 text-black font-semibold w-[24.25%]">
                                {jobTitle}
                            </div>
                            <div className="py-3 text-black font-semibold w-[24.25%]">
                                {recruiterDetails.recruiterName}
                            </div>
                            <div className="py-3 text-black font-semibold w-[24.25%]">
                                {formatDate(createdAt)}
                            </div>
                            <div className="py-3 flex gap-2 ml-auto justify-end w-[24.25%]">
                                <button
                                    onClick={handleViewJob}
                                    className="flex items-center justify-center w-1/2 bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800"
                                >
                                    <RiEdit2Fill size={20} className="mr-2" />
                                    Edit
                                </button>
                                <button
                                    onClick={handlePublishToggle}
                                    disabled={isLoading}
                                    className={`flex items-center justify-center w-1/2 py-2 rounded-lg shadow ${isPublished
                                            ? "bg-[#001571] hover:bg-blue-700"
                                            : "bg-[#EC221F] hover:bg-red-700"
                                        } text-white`}
                                >
                                    <BsFillEyeFill size={15} className="mr-2" />
                                    {isLoading ? "Loading..." : isPublished ? "Restrict" : "Unrestrict"}
                                </button>
                            </div>
                        </>
                    )}

                    {session?.user?.role === "recruiter" && (
                        <>
                            <div className="py-3 text-black font-semibold w-[3%]"></div>
                            <div className="py-3 text-black font-semibold w-[24.25%]">
                                {jobTitle}
                            </div>
                            <div className="py-3 text-black font-semibold w-[24.25%]">
                                {formatDate(createdAt)}
                            </div>
                            <div className="py-3 justify-center text-black font-semibold w-[24.25%]">
                                {applicationCount}
                            </div>
                            <div className="py-3 flex gap-2 ml-auto justify-end w-[24.25%]">
                                <button
                                    onClick={handleViewJob}
                                    className="flex items-center justify-center w-1/2 bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800"
                                >
                                    <RiEdit2Fill size={20} className="mr-2" />
                                    Edit
                                </button>
                                <button
                                    onClick={handlePublishToggle}
                                    disabled={isLoading}
                                    className={`flex items-center justify-center w-1/2 py-2 rounded-lg shadow ${isPublished
                                            ? "bg-[#EC221F] hover:bg-red-700"
                                            : "bg-[#001571] hover:bg-blue-700"
                                        } text-white`}
                                >
                                    <BsFillEyeFill size={15} className="mr-2" />
                                    {isLoading ? "Loading..." : isPublished ? "Restrict" : "Unrestrict"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JobCard;