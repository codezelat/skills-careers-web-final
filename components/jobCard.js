import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const monthName = ["January","February","March","April","May","June","July","August","September","October","November","December"];
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
      const fetchRecruiterDetails = async (e) => {
        try {
          const response = await fetch(
            `/api/recruiterdetails/get?id=${recruiterId}`
          );
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
    <div className="bg-white shadow-lg rounded-lg p-8 m-2">
      <p className="text-base font-bold text-black text-right">{postedDate}</p>
      <Image
        src={recruiterDetails.logo || "/images/default-image.jpg"}
        alt="Logo"
        width={100}
        height={100}
        className="rounded-full object-cover mb-8 shadow-lg"
      />
      <p className="text-sm text-gray-600">Job Name</p>
      <p className="text-base font-bold text-black mb-3">{jobTitle}</p>
      <p className="text-sm text-gray-600">Job Type</p>
      <p className="text-base font-bold text-black mb-3">{jobTypes}</p>
      <p className="text-sm text-gray-600">Company Name</p>
      <p className="text-base font-bold text-black mb-3">
        {recruiterDetails.recruiterName}
      </p>
      <p className="text-sm text-gray-600">Company Email</p>
      <p className="text-base font-bold text-black mb-3">
        {recruiterDetails.email}
      </p>
      <p className="text-sm text-gray-600">Location</p>
      <p className="text-base font-bold text-black mb-3">{location}</p>
      <p className="text-sm text-gray-600">Job Description</p>
      <p className="text-base font-bold text-black mb-3">{jobDescription}</p>
      <div className="flex justify-between mt-7">
        <button
          className="px-4 py-2 border-2 w-6/12 bg-blue-500 border-blue-500 text-white hover:border-black hover:bg-black rounded transition-colors"
          onClick={handleViewApplication}
        >
          Apply Now
        </button>
        <button
          className="px-4 py-2 border-2 w-5/12 bg-white border-blue-500 text-blue-500 hover:border-black hover:text-black rounded transition-colors"
          onClick={handleViewJob}
        >
          View Now
        </button>
      </div>
    </div>
  );
}

export default JobCard;
