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
import {
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { TbUserHexagon } from "react-icons/tb";
import { PiSealCheckFill } from "react-icons/pi";

// Helper function to format address
const formatAddress = (recruiter) => {
  const { addressLine, district, province, country, location } = recruiter;
  const parts = [];

  if (addressLine) parts.push(addressLine);

  if (country === "Sri Lanka" || !country) {
    // For Sri Lanka, show district, province
    if (district) parts.push(district);
    if (province && province !== district) parts.push(province);
    parts.push("Sri Lanka");
  } else {
    // For other countries, show country
    if (country) parts.push(country);
  }

  return (
    parts.filter(Boolean).join(", ") || location || "Location not specified"
  );
};

function RecruiterCard(props) {
  const {
    _id,
    recruiterName,
    employeeRange,
    email,
    contactNumber,
    companyDescription,
    industry,
    category,
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
      {/* Company Info */}
      <div className="mb-4 h-full">
        <div
          key={_id}
          className="h-full border border-gray-100 rounded-2xl bg-white hover:shadow-xl transition-all duration-300 p-6 flex flex-col group relative overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#001571] to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

          <div className="flex flex-col md:flex-row gap-6 h-full">
            {/* Logo Column */}
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <div className="relative w-32 h-32 rounded-xl border border-gray-100 p-2 bg-white flex items-center justify-center">
                <Image
                  src={logo || "/images/default-image.jpg"}
                  alt={`${recruiterName} logo`}
                  width={120}
                  height={120}
                  className="object-contain max-h-full"
                />
              </div>
            </div>

            {/* Content Column */}
            <div className="flex-grow flex flex-col">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="flex items-center text-xl md:text-2xl font-bold text-[#001571] group-hover:text-blue-700 transition-colors">
                    {recruiterName}
                    <PiSealCheckFill className="ml-2 text-blue-500" size={20} />
                  </h3>
                  <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <FaLocationDot className="text-gray-400" />
                      <span>{formatAddress(props.recruiter)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BiSolidCategory className="text-gray-400" />
                      <span>{category || industry}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {linkedin && (
                    <Link
                      href={linkedin}
                      target="_blank"
                      className="p-2 rounded-full bg-gray-50 text-[#0077b5] hover:bg-blue-50 transition-colors"
                    >
                      <FaLinkedin size={18} />
                    </Link>
                  )}
                  {facebook && (
                    <Link
                      href={facebook}
                      target="_blank"
                      className="p-2 rounded-full bg-gray-50 text-[#1877f2] hover:bg-blue-50 transition-colors"
                    >
                      <FaFacebook size={18} />
                    </Link>
                  )}
                  {instagram && (
                    <Link
                      href={instagram}
                      target="_blank"
                      className="p-2 rounded-full bg-gray-50 text-[#e4405f] hover:bg-pink-50 transition-colors"
                    >
                      <Instagram style={{ fontSize: 18 }} />
                    </Link>
                  )}
                  {x && (
                    <Link
                      href={x}
                      target="_blank"
                      className="p-2 rounded-full bg-gray-50 text-black hover:bg-gray-200 transition-colors"
                    >
                      <XIcon style={{ fontSize: 18 }} />
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">
                  {employeeRange} Employees
                </span>
                <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100">
                  Member Since {year}
                </span>
              </div>

              <p className="line-clamp-2 text-gray-600 mb-6 flex-grow leading-relaxed">
                {companyDescription}
              </p>

              <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <button className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-[#001571] px-4 py-2.5 rounded-xl font-semibold transition-colors text-sm">
                  <FaPhoneAlt size={14} />
                  {contactNumber || "N/A"}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-[#001571] px-4 py-2.5 rounded-xl font-semibold transition-colors text-sm">
                  <FaEnvelope size={14} />
                  <span className="truncate max-w-[150px]">{email}</span>
                </button>
                <button
                  onClick={handleViewProfile}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#001571] text-white px-4 py-2.5 rounded-xl font-bold shadow-md hover:bg-blue-800 hover:shadow-lg transition-all text-sm group-hover:pl-3 group-hover:pr-5"
                >
                  View Profile
                  <BsArrowUpRightCircleFill className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
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
