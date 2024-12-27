// import JobCard from "@/components/jobCard";
import NavBar from "@/components/navBar";
import NewsLetter from "@/components/newsletter";
import Image from "next/image";
import { countries } from "../../lib/countries";
import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io";
import { useState } from "react";

function StartingPage() {

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  return (
    <>
      <NavBar />
      <div className="relative">
        <Image
          src="/landing/bg.jpg"
          alt="line"
          width={100}
          height={30}
          className="absolute top-0 right-0 w-fit h-full object-cover z-[-1] opacity-5 items-end"
        />

        <div className="pt-8 pl-8 pr-8 mx-auto max-w-screen-xl px-4 sm:px-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2">
              <div className="mb-8">
                <h1 className="text-4xl text-center lg:text-left md:text-left sm:text-left sm:text-5xl lg:text-6xl font-bold text-[#8A93BE] mt-12 md:mt-16 lg:mt-28">
                  Your Future{" "}
                  <span className="font-bold text-[#7d7d7d]">Start Here!</span>
                </h1>
                <p className="pt-4 text-center lg:text-left md:text-left sm:text-left text-base sm:text-lg text-[#001571]">
                  Explore personalized job opportunities, expert tools, and
                  connections with top companies to advance your career with
                  Skill Careers.
                </p>

                <div className="relative w-full sm:w-2/3 md:w-1/2 lg:w-1/4">
                  <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-[#e6e8f1] border-2 border-[#B0B6D3] text-[#5462A0] py-3 px-3 mt-6 font-semibold rounded-md cursor-pointer sm:text-sm"
                  >
                    {selectedCountry ? (
                      <div className="flex items-center">
                        {selectedCountry.label}
                        <img
                          src={selectedCountry.flag}
                          className="w-5 h-5 ml-3"
                          alt=""
                        />
                      </div>
                    ) : (
                      "Select the Country"
                    )}
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5462A0]">
                      <IoMdArrowDropdown />
                    </span>
                  </div>

                  {isOpen && (
                    <div className="absolute z-10 bg-white border border-[#B0B6D3] rounded-md mt-1 w-full max-h-60 overflow-y-auto">
                      {countries.map((country) => (
                        <div
                          key={country.code}
                          onClick={() => handleSelect(country)}
                          className="flex items-center px-2 py-2 hover:bg-gray-200 cursor-pointer"
                        >
                          {country.label}
                          <img
                            src={country.flag}
                            className="w-5 h-5 ml-auto justify-end"
                            alt=""
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gray-200">
                  <div className="flex flex-wrap sm:flex-nowrap flex-col sm:flex-row justify-between items-center mt-5 gap-4 mb-8 rounded-md lg:px-2 md:px-4 sm:px-4">
                    <input
                      type="text"
                      placeholder="Search by job title, keywords, or company."
                      className="bg-gray-200 flex-grow text-base lg:text-lg md:text-lg sm:text-lg  py-3 focus:outline-none rounded-md font-semibold placeholder-[#5462A0]"
                    />
                    <button className="flex w-full lg:w-1/4 md:w-1/4 sm:w-1/4 justify-center bg-[#001571] text-white py-2 rounded-md font-semibold">
                      <span className="mt-1 mr-2 sm:mb-1">
                        <IoMdSearch size={20} />
                      </span>
                      Search
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex -space-x-4">
                      <Image
                        src="/user1.png"
                        width={50}
                        height={50}
                        alt="User 1"
                        className="rounded-full"
                      />
                      <Image
                        src="/user2.png"
                        width={50}
                        height={50}
                        alt="User 2"
                        className="rounded-full"
                      />
                      <Image
                        src="/user3.png"
                        width={50}
                        height={50}
                        alt="User 3"
                        className="rounded-full"
                      />
                    </div>
                    <div className="ml-4">
                      <h1 className="text-xl sm:text-2xl font-bold text-[#001571]">
                        6K+
                      </h1>
                      <p className="text-[#001571] font-semibold">
                        Active Daily Users
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center">
                    <Image
                      src="/worldsearch.png"
                      width={20}
                      height={20}
                      alt="World Search"
                      className="rounded-full"
                    />
                    <p className="text-[#001571] ml-2 font-semibold">
                      Advanced Job Search
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Image
                      src="/reward.png"
                      width={20}
                      height={20}
                      alt="Reward"
                      className="rounded-full"
                    />
                    <p className="text-[#001571] ml-2 font-semibold">
                      Career Growth Resources
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Image
                      src="/attach.png"
                      width={20}
                      height={20}
                      alt="Attach"
                      className="rounded-full"
                    />
                    <p className="text-[#001571] ml-2 font-semibold">
                      Career Growth Resources
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image Section */}
            <div className="relative w-full h-[800px] md:h-auto lg:h-auto sm:h-[800px]">
              <Image
                src="/girlPic.png"
                alt="Illustration"
                fill
                className="object-cover rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StartingPage;
