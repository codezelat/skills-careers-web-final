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
      <div className="bg-blue-950 p-4 lg:p-6 ">
        <div className="flex flex-col sm:space-y-6 lg:flex-row lg:justify-between lg:items-center gap-10 lg:px-10">
          {/* Contact Info Section */}
          <div className="flex flex-col sm:space-y-1 lg:flex-row sm:flex-row sm:flex-wrap lg:flex-wrap justify-center md:justify-start gap-6 lg:gap-40 px-4 lg:px-0">
            {/* Email Section */}
            <div className="flex items-center space-x-3 text-gray-50">
              <FaMailBulk size={28} className="cursor-pointer" />
              <div className="flex flex-col">
                <div className="font-semibold">Email</div>
                <div className="text-sm">info@skillscareer.com</div>
              </div>
            </div>

            {/* Phone Section */}
            <div className="flex items-center space-x-3 text-gray-50">
              <FaPhone size={28} className="cursor-pointer" />
              <div className="flex flex-col">
                <div className="font-semibold">Phone</div>
                <div className="text-sm">0112-234-763</div>
              </div>
            </div>

            {/* Location Section */}
            <div className="flex items-center space-x-3 text-gray-50">
              <FaLocationArrow size={28} className="cursor-pointer" />
              <div className="flex flex-col">
                <div className="font-semibold">Location</div>
                <div className="text-sm">Union Place, Colombo 07</div>
              </div>
            </div>
          </div>

          {/* Social Icons Section */}
          <div className="flex sm:justify-start sm:mt-6 lg:mt-0 lg:justify-start items-start space-x-6 px-4 lg:px-0 text-gray-50">
            <FaLinkedin size={28} className="cursor-pointer hover:text-gray-400" />
            <FaTwitter size={28} className="cursor-pointer hover:text-gray-400" />
            <FaInstagram size={28} className="cursor-pointer hover:text-gray-400" />
            <FaFacebook size={28} className="cursor-pointer hover:text-gray-400" />
          </div>
        </div>
      </div>
    </>
  );
}
