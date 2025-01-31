import Image from "next/image";

import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { Facebook, Instagram, LinkedIn } from "@mui/icons-material";
import XIcon from "@mui/icons-material/X";
import OutboundIcon from "@mui/icons-material/Outbound";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { FaTwitter, FaPhoneAlt, FaEnvelope, FaFacebook } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { TbUserHexagon } from "react-icons/tb";
import { PiSealCheckFill } from "react-icons/pi";

function RecruiterCard(props) {
  const {
    _id,
    recruiterName,
    employeeRange,
    email,
    contactNumber,
    telephoneNumber,
    companyDescription,
    industry,
    location,
    logo,
    createdAt,
    facebook,
    instagram,
    linkedin,
    x,
  } = props.recruiter;

  // const recruiters = props.recruiter;

  const year = new Date(createdAt).getFullYear();
  const router = useRouter();

  const handleViewProfile = () => {
    router.push(`/recruiters/${_id}`);
  };

  // const itemsPerPage = 4;
  // const totalPages = Math.ceil(recruiters .length / itemsPerPage);

  // const [currentPage, setCurrentPage] = useState(1);

  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const currentRecruiters = recruiters .slice(
  //   startIndex,
  //   startIndex + itemsPerPage
  // );

  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  return (
    <>
      {/* Company Info */}
      <div className="mb-4">
        <div
          key={_id}
          className="border rounded-lg bg-white hover:bg-[#EDF0FF] p-6 shadow-md"
        >
          <p className="text-black font-semibold text-right">
            Member Since {year}
          </p>

          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 mt-5 lg:mt-0 md:pt-0 mb-4 md:mb-0 md:mr-6 flex justify-center items-center mx-auto">
              <Image
                src={logo || "/images/default-image.jpg"}
                alt={`${recruiterName} logo`}
                width={200}
                height={200}
                className="object-contain"
              />
            </div>

            <div className="flex-grow">
              <div className="flex flex-col lg:flex-row md:flex-row justify-between items-start lg:items-center md:items-center mt-4 md:mt-0">
                <h3 className="flex items-center text-xl text-center font-bold text-[#001571]">
                  {recruiterName}
                  <span className="ml-2 mt-1">
                    <PiSealCheckFill size={20} />
                  </span>
                </h3>
                <div className="flex space-x-3 mt-2 md:mt-0 text-[#001571]">
                  {linkedin && (
                    <Link href={linkedin} target="_blank" rel="noopener noreferrer">
                      <LinkedIn fontSize="large" aria-label="LinkedIn" />
                    </Link>
                  )}
                  {instagram && (
                    <Link href={instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram fontSize="large" aria-label="Instagram" />
                    </Link>
                  )}
                  {facebook && (
                    <Link href={facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook fontSize="large" aria-label="Facebook" />
                    </Link>
                  )}
                  {x && (
                    <Link href={x} target="_blank" rel="noopener noreferrer">
                      <XIcon fontSize="large" aria-label="X (formerly Twitter)" />
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-2">
                <div className="flex items-center gap-2">
                  <FaLocationDot size={20} className="text-[#001571]" />
                  <p className="text-black font-semibold">
                    {location}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <BiSolidCategory size={20} className="text-[#001571]" />
                  <p className="text-black font-semibold">
                    {industry}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <TbUserHexagon size={20} className="text-[#001571]" />
                  <p className="text-black font-semibold">
                    {employeeRange} Employees
                  </p>
                </div>
              </div>

              <p className="line-clamp-4 text-black mt-8 mb-6 text-justify">
                {companyDescription}
              </p>

              <div className="flex flex-wrap gap-4 mt-4">
                <button className="flex items-center bg-[#001571] text-white px-4 py-2 rounded-md">
                  <FaPhoneAlt className="mr-2" />
                  {telephoneNumber || "Not Available"}
                </button>
                <button className="flex items-center bg-[#001571] text-white px-4 py-2 rounded-md">
                  <FaEnvelope className="mr-2" />
                  {email}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-4 justify-end">
            <button onClick={handleViewProfile} className="text-[#001571] border-[#001571] border-2 px-4 py-2 rounded-md">
              <Link href="">
                <p className="flex text-lg font-bold justify-center">
                  View Profile
                  <span className="ml-3 mt-1 font-bold text-lg">
                    <BsArrowUpRightCircleFill />
                  </span>
                </p>
              </Link>
            </button>
            {/* <button className="bg-[#001571] font-semibold text-lg text-white px-6 py-2 rounded-md">
              Open Jobs
            </button> */}
          </div>
        </div>
      </div>

      {/* <div className="flex justify-center mt-8">
          <ul className="flex flex-wrap space-x-2">
            {[...Array(totalPages).keys()].map((pageNumber) => (
              <li
                key={pageNumber}
                className={`cursor-pointer ${currentPage === pageNumber + 1
                  ? "text-[#001571] font-semibold"
                  : "text-gray-600"
                  }`}
                onClick={() => handlePageChange(pageNumber + 1)}
              >
                {pageNumber + 1}
              </li>
            ))}
          </ul>
        </div> */}
    </>
  );
}

export default RecruiterCard;
