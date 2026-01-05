import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMailBulk,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";

export default function ContactBanner() {
  return (
    <>
      {/* Contact Banner */}
      <div className="w-full bg-[#001571] flex flex-col items-center justify-center">
        <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:items-center gap-10 py-6">
          {/* Contact Info Section */}
          <div className="flex flex-col sm:space-y-1 lg:flex-row sm:flex-row sm:flex-wrap lg:flex-wrap justify-center md:justify-start gap-6 lg:gap-16 xl:gap-24 px-4 lg:px-0">
            {/* Email Section */}
            <div className="flex items-center space-x-3 text-gray-50">
              <FaMailBulk size={22} className="flex-shrink-0" />
              <div className="flex flex-col">
                <div className="font-semibold text-sm">Email</div>
                <div className="text-xs">recruiter@skillscareers.lk</div>
              </div>
            </div>

            {/* Phone Section */}
            <div className="flex items-center space-x-3 text-gray-50">
              <FaPhone size={22} className="flex-shrink-0" />
              <div className="flex flex-col">
                <div className="font-semibold text-sm">Phone</div>
                <div className="text-xs">+94 77 178 7373</div>
              </div>
            </div>

            {/* Location Section */}
            <div className="flex items-center space-x-3 text-gray-50">
              <FaLocationArrow size={22} className="flex-shrink-0" />
              <div className="flex flex-col">
                <div className="font-semibold text-sm">Location</div>
                <div className="text-xs">
                  Skills Careers, SEGA Center, Soysapura, Moratuwa
                </div>
              </div>
            </div>
          </div>

          {/* Social Icons Section */}
          <div className="flex sm:justify-start sm:mt-6 lg:mt-0 lg:justify-start items-center space-x-5 px-4 lg:px-0 text-gray-50">
            <a
              href="https://www.linkedin.com/company/skills-careers/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin
                size={24}
                className="cursor-pointer hover:text-gray-300 transition-colors duration-200"
              />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter
                size={24}
                className="cursor-pointer hover:text-gray-300 transition-colors duration-200"
              />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram
                size={24}
                className="cursor-pointer hover:text-gray-300 transition-colors duration-200"
              />
            </a>
            <a href="#" aria-label="Facebook">
              <FaFacebook
                size={24}
                className="cursor-pointer hover:text-gray-300 transition-colors duration-200"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
