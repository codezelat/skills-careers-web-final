import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
export default function Footer() {
  return (
    <>
      <footer className="bg-[#00092F] w-full flex flex-col items-center">
        <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] py-10 lg:py-12">
          {/* Logo and Description */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12 mb-10">
            <div className="text-white flex flex-col items-center lg:items-start lg:w-1/3">
              <img src="/logo2.png" alt="Logo" className="h-14 w-auto mb-4" />
              <p className="text-sm text-gray-300 leading-relaxed text-center lg:text-left">
                Skill Careers connects job seekers, recruiters, and assessors
                through innovative digital solutions, offering a streamlined
                platform for career growth and talent acquisition.
              </p>
            </div>

            {/* Navigation Links - 3 Column Grid on Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 lg:w-2/3">
              {/* Main Menu */}
              <div>
                <p className="font-semibold text-white mb-4 text-base">
                  Main Menu
                </p>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li>
                    <a
                      href="/"
                      className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="/jobs"
                      className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Explore Jobs
                    </a>
                  </li>
                  <li>
                    <a
                      href="/recruiters"
                      className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Explore Recruiters
                    </a>
                  </li>
                  <li>
                    <a
                      href="/pressRelease"
                      className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Press Releases
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div>
                <p className="font-semibold text-white mb-4 text-base">
                  Quick Links
                </p>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li>
                    <a
                      href="privacypolicy"
                      className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="sustainabilitypolicy"
                      className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Sustainability Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="termsofuse"
                      className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      Terms of Use
                    </a>
                  </li>
                  <li>
                    <a
                      href="/#landingPageFAQ"
                      className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              {/* Connect With Us */}
              <div>
                <p className="font-semibold text-white mb-4 text-base">
                  Connect With Us
                </p>
                <div className="flex space-x-4 mb-4">
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <FaLinkedin size={20} />
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <FaFacebook size={20} />
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <FaTwitter size={20} />
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <FaInstagram size={20} />
                  </a>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Stay updated with the latest job opportunities and career
                  tips.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-6 mt-8 gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left order-2 md:order-1">
              © 2026 Skills Careers. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4 order-1 md:order-2">
              <img
                src="/Visa.png"
                alt="Visa"
                className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
              <img
                src="/DinersClub.png"
                alt="Diners Club"
                className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
              <img
                src="/Amex.png"
                alt="Amex"
                className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
              <img
                src="/Discover.png"
                alt="Discover"
                className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
