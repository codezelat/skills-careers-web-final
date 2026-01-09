import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function JobCard({ job, onApply }) {
  const router = useRouter();
  const {
    _id,
    createdAt,
    jobTitle,
    location,
    jobTypes,
    shortDescription,
    // New fields from enriched job data
    recruiterName,
    logo,
  } = job;

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

  const handleViewJob = () => {
    router.push(`/jobs/${_id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 rounded-2xl border border-gray-100 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <div className="relative w-16 h-16 shrink-0 border border-gray-100 rounded-full overflow-hidden bg-white p-1">
          <Image
            src={logo || "/images/default-image.jpg"}
            alt="Logo"
            fill
            className="object-contain rounded-full"
          />
        </div>
        <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
          {postedDate}
        </span>
      </div>

      <div className="mb-3">
        <h2
          className="text-lg font-bold text-[#001571] line-clamp-1 group-hover:text-blue-600 transition-colors"
          title={jobTitle}
        >
          {jobTitle}
        </h2>
        <div className="flex flex-col gap-0.5 mt-1">
          <p className="text-sm font-semibold text-gray-900 line-clamp-1">
            {recruiterName}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {Array.isArray(jobTypes) ? (
          jobTypes.slice(0, 3).map((type, index) => (
            <span
              key={index}
              className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold ${
                index % 2 === 0
                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                  : "bg-teal-50 text-teal-700 border border-teal-100"
              }`}
            >
              {type}
            </span>
          ))
        ) : typeof jobTypes === "string" ? (
          <span className="px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold bg-blue-50 text-blue-700 border border-blue-100">
            {jobTypes}
          </span>
        ) : null}
      </div>

      <hr className="border-gray-100 mb-4" />

      <p className="text-sm text-gray-600 line-clamp-3 mb-6 leading-relaxed flex-1">
        {shortDescription}
      </p>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button
          onClick={handleViewJob}
          className="flex items-center justify-center px-4 py-2.5 border border-[#001571] text-[#001571] text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors"
        >
          View Details
        </button>
        <button
          className="flex items-center justify-center px-4 py-2.5 bg-[#001571] text-white text-sm font-bold rounded-xl shadow-md hover:bg-blue-800 hover:shadow-lg transition-all"
          onClick={() => onApply(_id)}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(JobCard, (prevProps, nextProps) => {
  return (
    prevProps.job._id === nextProps.job._id &&
    prevProps.onApply === nextProps.onApply
  );
});
