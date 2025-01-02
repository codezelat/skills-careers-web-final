import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function JobCard(props) {
  const router = useRouter();
  const {
    _id,
    createdAt,
    jobTitle,
    recruiterId,
    location,
    jobTypes,
    jobDescription,
  } = props.job;

  const date = new Date(createdAt).getDate();
  const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const d = new Date(createdAt);
  let month = monthName[d.getMonth()];
  const year = new Date(createdAt).getFullYear();
  const postedDate = `${date} ${month} ${year}`;

  const [recruiterDetails, setRecruiterDetails] = useState({
    email: "",
    recruiterName: "",
    logo: "",
  });

  useEffect(() => {
    if (recruiterId) {
      const fetchRecruiterDetails = async () => {
        try {
          const response = await fetch(`/api/recruiterdetails/get?id=${recruiterId}`);
          if (response.ok) {
            const data = await response.json();
            setRecruiterDetails(data);
          } else {
            console.error("Failed to fetch recruiter details");
          }
        } catch (error) {
          console.error("Error fetching recruiter details:", error);
        }
      };

      fetchRecruiterDetails();
    }
  }, [recruiterId]);

  const handleViewApplication = () => {
    router.push(`/jobs/${_id}/apply`);
  };

  const handleViewJob = () => {
    router.push(`/jobs/${_id}`);
  };

  return (
    <div
      className="bg-white hover:bg-[#CAD1F1] p-6 rounded-lg shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <p className="w-full text-right text-[#000000] text-sm font-bold">
          {postedDate}
        </p>
      </div>
      <Image
        src={recruiterDetails.logo || "/images/default-image.jpg"}
        alt="Logo"
        width={100}
        height={100}
        className="rounded-full object-cover mb-8 shadow-lg"
      />
      <h2 className="text-xl font-bold text-[#001571] mb-1 text-center sm:text-left">
        {jobTitle}
      </h2>
      <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
        <span className="bg-[#001571] text-white px-2 py-1 rounded-full text-xs font-semibold">
          {jobTypes}
        </span>
      </div>
      <p className="text-xl font-bold text-[#000000] text-center sm:text-left">
        {recruiterDetails.recruiterName}
      </p>
      <p className="text-xl font-bold text-[#000000] mb-4 text-center sm:text-left">
        {location}
      </p>
      <p className="text-[#000000] text-sm mb-4 text-center sm:text-left">
        {jobDescription}
      </p>
      <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
        <button className="bg-[#001571] text-white px-3 py-2 rounded-lg font-semibold" onClick={handleViewApplication}>
          Apply Now
        </button>
        <button onClick={handleViewJob} className="border border-2 border-[#001571] text-[#001571] px-3 py-2 rounded-lg font-bold hover:bg-blue-800 hover:text-white transition">
          Quick View
        </button>
      </div>
    </div>
  );
}

export default JobCard;
