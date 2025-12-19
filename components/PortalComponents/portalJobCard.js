import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { RiDeleteBinFill, RiEdit2Fill } from "react-icons/ri";
import { BsFillEyeFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

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
        const controller = new AbortController();
        const { signal } = controller;

        const fetchCounts = async () => {
            if (!_id) return;
            try {
                // Fetch application count
                const appResponse = await fetch(
                    `/api/jobapplication/get?jobId=${_id}`,
                    { signal }
                );
                if (appResponse.ok) {
                    const appData = await appResponse.json();
                    setApplicationCount(appData.count);
                }

                // Fetch recruiter details for admin
                if (session?.user?.role === 'admin' && recruiterId) {
                    const recruiterResponse = await fetch(
                        `/api/recruiterdetails/get?id=${recruiterId}`,
                        { signal }
                    );
                    if (recruiterResponse.ok) {
                        const recruiterData = await recruiterResponse.json();
                        setRecruiterDetails(recruiterData);
                    }
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchCounts();

        return () => controller.abort();
    }, [_id, recruiterId, session?.user?.role]);

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
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You want to delete this job?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/job/${_id}`, { method: "DELETE" });
                if (response.ok) {
                    props.onJobDeleted?.(_id);
                    Swal.fire(
                        'Deleted!',
                        'Job has been deleted.',
                        'success'
                    );
                }
            } catch (error) {
                console.error("Error deleting job:", error);
                Swal.fire(
                    'Error!',
                    'Failed to delete job.',
                    'error'
                );
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
                                    title="Edit Job"
                                    className="flex items-center justify-center p-2.5 bg-[#001571] text-white rounded-xl shadow-sm hover:shadow-md hover:bg-blue-800 transition-all duration-200"
                                >
                                    <RiEdit2Fill size={18} />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    title="Delete Job"
                                    className="flex items-center justify-center p-2.5 bg-red-50 text-[#EC221F] border border-red-100 rounded-xl shadow-sm hover:shadow-md hover:bg-[#EC221F] hover:text-white transition-all duration-200"
                                >
                                    <RiDeleteBinFill size={18} />
                                </button>
                                <button
                                    onClick={handlePublishToggle}
                                    disabled={isLoading}
                                    title={isPublished ? "Restrict Job" : "Unrestrict Job"}
                                    className={`flex items-center justify-center p-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-white ${isPublished
                                        ? "bg-amber-500 hover:bg-amber-600"
                                        : "bg-emerald-500 hover:bg-emerald-600"
                                        }`}
                                >
                                    <BsFillEyeFill size={18} />
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
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className="flex items-center justify-center w-1/2 bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
                                >
                                    <RiDeleteBinFill size={20} className="mr-2" />
                                    Delete
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