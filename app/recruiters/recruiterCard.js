import Image from "next/image";

import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { Facebook, Instagram, LinkedIn } from "@mui/icons-material";
import XIcon from "@mui/icons-material/X";
import OutboundIcon from "@mui/icons-material/Outbound";
import Link from "next/link";
import { useRouter } from "next/navigation";

function RecruiterCard(props) {
  const {
    _id,
    recruiterName,
    employeeRange,
    email,
    contactNumber,
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

  const year = new Date(createdAt).getFullYear();
  const router = useRouter();

  const handleViewProfile = () => {
    router.push(`/recruiters/${_id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row justify-between mb-6 lg:mb-8 relative">
      {/* Company Info */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
        <Image
          src={logo || "/images/default-image.jpg"}
          alt="Logo"
          width={150}
          height={150}
          className="w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 object-contain"
        />
        <div className="space-y-4">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#001571] flex items-center gap-2">
            {recruiterName} <VerifiedIcon className="text-[#001571]" /> {_id}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm font-semibold text-black">
            <div className="flex items-center gap-1">
              <Image
                src="/images/location.png"
                width={16}
                height={16}
                alt="Location Icon"
              />
              {location}
            </div>
            <div className="flex items-center gap-1">
              <Image
                src="/images/category.png"
                width={16}
                height={16}
                alt="Industry Icon"
              />
              {industry}
            </div>
            <div className="flex items-center gap-1">
              <Image
                src="/images/user-octagon.png"
                width={16}
                height={16}
                alt="Employee Icon"
              />
              {employeeRange}
            </div>
          </div>
          <p className="text-sm text-black sm:text-base">
            {companyDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-[#001571] text-white rounded-lg text-xs sm:text-sm lg:text-base">
              <PhoneIcon /> {contactNumber}
            </button>
            <button className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-[#001571] text-white rounded-lg text-xs sm:text-sm lg:text-base">
              <EmailIcon /> {email}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:absolute lg:bottom-6 lg:right-6">
            <button
              onClick={handleViewProfile}
              className="flex items-center gap-2 px-4 py-1 sm:px-6 sm:py-2 text-[#001571] border border-[#001571] rounded-lg hover:bg-blue-100 text-xs sm:text-sm lg:text-base"
            >
              View Profile <OutboundIcon />
            </button>
            <button className="px-4 py-1 sm:px-6 sm:py-2 bg-[#001571] text-white rounded-lg hover:bg-blue-800 text-xs sm:text-sm lg:text-base">
              Open Jobs
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center lg:items-end space-y-2 mt-6 lg:mt-0">
        <span className="text-xs sm:text-sm font-bold text-black">
          Member Since {year}
        </span>
        <div className="flex space-x-3 text-[#001571]">
          {linkedin && (
            <Link href={linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedIn fontSize="medium" aria-label="LinkedIn" />
            </Link>
          )}
          {instagram && (
            <Link href={instagram} target="_blank" rel="noopener noreferrer">
              <Instagram fontSize="medium" aria-label="Instagram" />
            </Link>
          )}
          {facebook && (
            <Link href={facebook} target="_blank" rel="noopener noreferrer">
              <Facebook fontSize="medium" aria-label="Facebook" />
            </Link>
          )}
          {x && (
            <Link href={x} target="_blank" rel="noopener noreferrer">
              <XIcon fontSize="medium" aria-label="X (formerly Twitter)" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecruiterCard;
