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
  const [isPublished, setIsPublished] = useState(
    props.job.isPublished || false,
  );
  const [isLoading, setIsLoading] = useState(false);

  const { _id, createdAt, jobTitle, recruiterId } = props.job;
  const { currentPage = 1 } = props;

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchCounts = async () => {
      if (!_id) return;
      try {
        // Fetch application count
        const appResponse = await fetch(
          `/api/jobapplication/get?jobId=${_id}`,
          { signal },
        );
        if (appResponse.ok) {
          const appData = await appResponse.json();
          setApplicationCount(appData.count);
        }

        // Fetch recruiter details for admin
        if (session?.user?.role === "admin" && recruiterId) {
          const recruiterResponse = await fetch(
            `/api/recruiterdetails/get?id=${recruiterId}`,
            { signal },
          );
          if (recruiterResponse.ok) {
            const recruiterData = await recruiterResponse.json();
            setRecruiterDetails(recruiterData);
          }
        }
      } catch (error) {
        if (error.name !== "AbortError") {
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
      title: "Are you sure?",
      text: "You want to delete this job?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/job/${_id}`, { method: "DELETE" });
        if (response.ok) {
          props.onJobDeleted?.(_id);
          Swal.fire("Deleted!", "Job has been deleted.", "success");
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        Swal.fire("Error!", "Failed to delete job.", "error");
      }
      setIsLoading(false);
    }
  };

  const handleViewJob = () => {
    const path =
      session?.user?.role === "admin"
        ? `/Portal/jobsAdmin/${_id}`
        : `/Portal/jobsRecruiter/${_id}`;
    // Preserve current page in URL for back navigation
    const currentPath = window.location.pathname;
    const returnUrl = `${currentPath}?page=${currentPage}`;
    router.push(`${path}?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
  };

  return (
    <div className="gap-1 bg-white rounded-lg hover:shadow-md">
      <div className="w-full items-center">
        <div className="text-gray-700 hover:bg-gray-50 border-b text-sm flex items-center">
          {session?.user?.role === "admin" && (
            <div className="flex flex-col md:flex-row w-full md:items-center p-4 md:p-0">
              <div className="hidden md:block py-3 text-black font-semibold w-[3%]"></div>

              <div className="py-2 md:py-3 text-black font-semibold w-full md:w-[24.25%]">
                <span className="md:hidden text-gray-500 text-xs uppercase tracking-wider mr-2">
                  Job Title:
                </span>
                {jobTitle}
              </div>

              <div className="py-2 md:py-3 text-black font-semibold w-full md:w-[24.25%]">
                <span className="md:hidden text-gray-500 text-xs uppercase tracking-wider mr-2">
                  Organization:
                </span>
                {recruiterDetails.recruiterName}
              </div>

              <div className="py-2 md:py-3 text-black font-semibold w-full md:w-[24.25%]">
                <span className="md:hidden text-gray-500 text-xs uppercase tracking-wider mr-2">
                  Posted Date:
                </span>
                {formatDate(createdAt)}
              </div>

              <div className="py-3 flex gap-2 w-full md:w-[24.25%] justify-start md:justify-end mt-2 md:mt-0">
                <button
                  onClick={handleViewJob}
                  title="Edit Job"
                  className="flex items-center justify-center bg-[#001571] text-white px-3 py-2 rounded-xl shadow-sm hover:shadow-md hover:bg-blue-800 transition-all duration-200"
                >
                  <RiEdit2Fill size={18} className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  title="Delete Job"
                  className="flex items-center justify-center bg-red-50 text-[#EC221F] border border-red-100 px-3 py-2 rounded-xl shadow-sm hover:shadow-md hover:bg-[#EC221F] hover:text-white transition-all duration-200"
                >
                  <RiDeleteBinFill size={18} className="mr-2" />
                  Delete
                </button>
                <button
                  onClick={handlePublishToggle}
                  disabled={isLoading}
                  title={isPublished ? "Restrict Job" : "Unrestrict Job"}
                  className={`flex items-center justify-center px-3 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-white ${
                    isPublished
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
                >
                  <BsFillEyeFill size={18} className="mr-2" />
                  {isPublished ? "Unpublish" : "Publish"}
                </button>
              </div>
            </div>
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
                  className="flex items-center justify-center bg-gray-100 text-[#001571] px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex items-center justify-center bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                >
                  Delete
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
