import Image from "next/image";
import JobSearch from "@/components/jobSearch";
import CategoryComponent from "@/components/CategoryComponent";
import PackageComponent from "@/components/PackageComponent";
import StoryComponent from "@/components/StoryComponent";
import FaqComponent from "@/components/FaqComponent";
import Footer from "@/components/Footer";
import FetchingJobs from "@/components/StartingPageComponents/FetchingJobs";
import JobSearchDropdown from "@/components/JobSearchDropdown";
import PressReleaseSection from "@/components/PressReleaseSection";

const StartingPage = () => {
  return (
    <>
      {/* Hero section */}
      <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] flex justify-center">
        <div className="h-screen w-full absolute z-[-1]">
          <Image
            src="/images/bg.jpg"
            alt="Background Image"
            layout="fill"
            objectFit="contain"
            objectPosition="right top"
            quality={100}
            priority
            className="w-full h-full opacity-5 "
          />
        </div>

        <div className="pt-8 w-[1280px]">
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

                {/*<div className="relative w-full sm:w-2/3 md:w-1/2 lg:w-2/6 mb-5">
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="border-2 border-[#B0B6D3] text-[#5462A0] py-4 px-3 mt-6 font-semibold rounded-md cursor-pointer sm:text-sm"
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
                    className="flex items-center px-2 py-4 hover:bg-gray-200 cursor-pointer"
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
          </div>*/}

                <JobSearchDropdown />
              </div>

              <div className="mt-24 mb-12">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex -space-x-4">
                      <Image
                        src="/images/user1.png"
                        width={50}
                        height={50}
                        alt="User 1"
                        className="rounded-full"
                      />
                      <Image
                        src="/images/user2.png"
                        width={50}
                        height={50}
                        alt="User 2"
                        className="rounded-full"
                      />
                      <Image
                        src="/images/user3.png"
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

                <div className="w-full flex flex-col md:flex-row items-center gap-10 mt-10">
                  <div className="flex items-center">
                    <Image
                      src="/images/worldsearch.png"
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
                      src="/images/reward.png"
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
                      src="/images/attach.png"
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
                src="/images/girlPic.png"
                alt="Illustration"
                quality={100}
                fill
                className="object-cover rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured jobs section */}
      <FetchingJobs />

      <CategoryComponent />
      <PackageComponent />

      <div className="bg-[#F5F5F5] w-full flex items-center justify-center">
        <div className="w-full py-28 flex flex-col items-center justify-center gap-24">
          <StoryComponent />
          <PressReleaseSection/>

          <span id="landingPageFAQ"></span>
          <FaqComponent />
        </div>
      </div>
    </>
  );
};

export default StartingPage;
