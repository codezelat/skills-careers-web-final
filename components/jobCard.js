import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    <div className="bg-white hover:bg-[#CAD1F1] p-6 rounded-lg shadow-lg min-h-[70vh] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <p className="w-full text-right text-[#000000] text-sm font-bold">
          {postedDate}
        </p>
      </div>
      <Image
        src={logo || "/images/default-image.jpg"}
        alt="Logo"
        width={100}
        height={100}
        className="rounded-full object-cover mb-8"
      />
      <h2 className="truncate text-xl font-bold text-[#001571] mb-1 text-left sm:text-left">
        {jobTitle}
      </h2>
      <div className="flex items-center gap-2 mb-4 justify-start sm:justify-start">
        {Array.isArray(jobTypes) ? (
          jobTypes.map((type, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-[5px] text-xs font-semibold text-white ${
                index % 2 === 0 ? "bg-[#001571]" : "bg-[#00B6B4]"
              }`}
            >
              {type}
            </span>
          ))
        ) : typeof jobTypes === "string" ? (
          <span className="px-2 py-1 rounded-[5px] text-xs font-semibold text-white bg-[#001571]">
            {jobTypes}
          </span>
        ) : null}
      </div>

      <p className="text-xl font-bold text-[#000000] text-left sm:text-left">
        {recruiterName}
      </p>
      <p className="text-xl font-bold text-[#000000] mb-4 text-left sm:text-left">
        {location}
      </p>
      <p className="line-clamp-4 text-[#000000] text-sm mb-4 text-justify sm:text-left">
        {shortDescription}
      </p>
      <div className="flex gap-4 flex-wrap justify-between sm:justify-start mt-auto">
        <button
          className="bg-[#001571] text-white px-3 py-2 rounded-lg font-semibold"
          onClick={() => onApply(_id)}
        >
          Apply Now
        </button>
        <button
          onClick={handleViewJob}
          className="border-2 border-[#001571] text-[#001571] px-3 py-2 rounded-lg font-bold hover:bg-blue-800 hover:text-white transition"
        >
          Quick View
        </button>
      </div>
    </div>
  );
}

export default JobCard;
