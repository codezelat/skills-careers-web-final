import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
export default function Footer() {
  return (
    <>
      <footer className="bg-[#00092F] w-full flex flex-col items-center">
      <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] py-8 lg:space-y-8">
        {/* Logo and Description */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-white mb-4 sm:mb-0">
            <img src="/logo2.png" alt="Logo" className="h-14 w-auto mx-auto sm:mx-0" />
          </div>

          <p className="text-white font-semibold text-center sm:text-right sm:ml-auto sm:w-2/3 md:w-1/2 lg:w-3/5 leading-relaxed">
            Skill Careers connects job seekers, recruiters, and assessors through innovative digital solutions, offering a streamlined platform for career growth and talent acquisition.
          </p>
        </div>

        {/* Navigation and Newsletter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-white pt-5 lg:pt-8">
          {/* Main Menu */}
          <div>
            <p className="font-medium text-white text-center sm:text-left">Main Menu</p>
            <ul className="mt-6 space-y-4 text-sm text-white font-medium text-center sm:text-left">
              <li>
                <a
                  href="/"
                  className="transition duration-300 transform hover:-translate-y-1 hover:border-b-2 border-blue-800"
                >
                  Home
                </a>
              </li>
              <li>
                <a href="/recruiterSearch" className="transition hover:opacity-75">
                  Explore Recruiters
                </a>
              </li>
              <li>
                <a href="/aboutUs" className="transition hover:opacity-75">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contactUs" className="transition hover:opacity-75">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-medium text-white text-center sm:text-left">Quick Links</p>
            <ul className="mt-6 space-y-4 text-sm text-white font-medium text-center sm:text-left">
              <li>
                <a href="#" className="transition hover:opacity-75">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:opacity-75">
                  Sustainability Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:opacity-75">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:opacity-75">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="font-medium text-white text-center sm:text-left">Join Our Newsletter</p>
            <ul className="mt-6 space-y-4 text-sm text-white text-center sm:text-left">
              <li>
                <p className="transition hover:opacity-75">
                  Subscribe now for the latest updates on exclusive offers, new packages, and bulks!
                </p>
              </li>
              <li>
                <div className="bg-[#00092F]">
                  <div className="flex flex-col justify-between p-1 sm:flex-row items-center bg-[#001571] border border-[#001571]">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="bg-[#001571] text-white placeholder-white px-4 py-2 focus:outline-none w-full sm:w-auto"
                    />
                    <button
                      type="submit"
                      className="bg-white w-full text-blue-800 font-semibold p-2 mt-2 sm:mt-0 sm:ml-2 border border-blue-800 hover:bg-blue-100 transition duration-300"
                    >
                      Submit Now
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media and Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-white pt-5">
          <div className="flex justify-center md:justify-start space-x-4 text-white mb-4 md:mb-0">
            <FaLinkedin size={35} />
            <FaFacebook size={35} />
            <FaTwitter size={35} />
            <FaInstagram size={35} />
          </div>
          <p className="text-base text-center md:text-left text-white font-semibold">
            © 2024 Skills Careers. All rights reserved.
          </p>
          <div className="flex justify-center md:justify-end space-x-4 mt-4 md:mt-0">
            <img src="/visa.png" alt="Visa" className="w-auto" />
            <img src="/dinersclub.png" alt="Diners Club" className="w-auto" />
            <img src="/amex.png" alt="Amex" className="w-auto" />
            <img src="/discover.png" alt="Discover" className="w-auto" />
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}

