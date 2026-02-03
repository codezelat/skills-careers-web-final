import Footer from "@/components/Footer";
import NavBar from "@/components/navBar";
import Image from "next/image";

function aboutPage() {
  const features = [
    {
      title: "Comprehensive Job Portal",
      description:
        "Access thousands of opportunities across multiple industries",
      imageUrl: "/images/contact1.png",
    },
    {
      title: "Support at Every Stage",
      description:
        "Whether you're searching for a job or hiring top talent, we're here to guide and support you.",
      imageUrl: "/images/contact2.png",
    },
    {
      title: "Personalized Recommendations",
      description:
        "Get job matches tailored to your skills, experience, and preferences.",
      imageUrl: "/images/contact3.png",
    },
    {
      title: "Trusted by Top Employers",
      description:
        "Join a platform where top organizations seek out the best candidates.",
      imageUrl: "/images/contact4.png",
    },
    {
      title: "Fast & Easy Application Process",
      description:
        "Our user-friendly platform makes applying to jobs quick and simple.",
      imageUrl: "/images/contact5.png",
    },
    {
      title: "Expert Career Resources",
      description:
        "We offer career advice, resume-building tools, and skill assessments to help you stand out.",
      imageUrl: "/images/contact6.png",
    },
  ];

  return (
    <>
      {/* Upper Banner */}
      <div
        className="relative w-full bg-cover bg-center h-64 md:h-80 flex items-center justify-center"
        style={{ backgroundImage: "url('/images/aboutUsBanner.png')" }}
      >
        <div className="flex flex-col justify-center items-center bg-black bg-opacity-40 text-white h-full w-full">
          <div className="flex flex-col items-start justify-center w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px]">
            <h1 className="text-2xl md:text-4xl font-bold mb-1">
              Empowering Careers,
            </h1>
            <h2 className="text-xl md:text-4xl font-bold">
              Connecting Talent With Opportunity.
            </h2>
          </div>
        </div>
      </div>

      {/* Who We Are */}
      <div className="bg-[#000C3E] w-full flex flex-col items-center justify-center gap-28 py-28">
        <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] text-white grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-20">
          <div className="gap-8">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold mb-4">
              Who We Are
            </h1>
            <p className="text-sm sm:text-base md:text-lg leading-6 sm:leading-8">
              At Skill Careers, we believe that finding the right job or the
              right talent should be seamless and efficient. Founded with the
              mission to bridge the gap between job seekers and recruiters, we
              are committed to offering a platform that is both easy to use and
              highly effective. Whether you're a job seeker looking to advance
              your career or a recruiter seeking top talent, Skill Careers is
              here to support you every step of the way. This project is
              supported by Australia Awards - Sri Lanka and Maldives as a part
              of a small grant scheme.
            </p>
          </div>
          <div className="flex justify-center flex-wrap gap-4 sm:gap-6">
            <Image
              src={"/images/people1.png"}
              width={100}
              height={80}
              quality={100}
              className="w-24 sm:w-32 md:w-40"
              alt="Doctor"
            />
            <Image
              src={"/images/people2.png"}
              width={100}
              height={80}
              quality={100}
              className="w-24 sm:w-32 md:w-40"
              alt="Girl"
            />
            <Image
              src={"/images/people3.png"}
              width={100}
              height={80}
              quality={100}
              className="w-24 sm:w-32 md:w-40"
              alt="Robo"
            />
          </div>
        </div>

        {/* What We Offer */}
        <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] text-gray-100">
          <h3 className="text-xl md:text-2xl font-semibold mb-6">
            What We Offer
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-white text-blue-950 rounded-lg shadow-md p-6 w-full md:w-1/2">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/global-search.png"
                  alt="icon search"
                  width={50}
                  height={50}
                />
              </div>
              <h4 className="text-lg font-bold  p-2 mb-5 font-sans">
                For Job Seekers
              </h4>

              <p className="text-gray-800 ml-2 text-sm md:text-base font-sans">
                Skill Careers provides access to thousands of job opportunities
                across various industries. Our personalized job recommendations,
                career development resources, and advanced search tools help you
                find the perfect role that matches your skills and goals.{" "}
              </p>
            </div>

            <div className="bg-white text-blue-950 rounded-lg shadow-md p-6 w-full md:w-1/2">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/buliding.png"
                  alt="icon search"
                  width={50}
                  height={50}
                />
              </div>
              <h4 className="text-lg font-bold  p-2 mb-5 font-sans ">
                For Recruiters
              </h4>

              <p className="text-gray-800 text-sm md:text-base font-sans">
                Our platform offers tailored recruitment packages, allowing
                companies to post jobs, access candidate databases, and utilize
                assessment tools for efficient hiring. From small businesses to
                large enterprises, Skill Careers helps you find and connect with
                top talent quickly and effectively.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="w-full flex flex-col items-center py-20 md:py-28 bg-gray-50">
        <section className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] lg:p-0 md:p-12 ">
          <h2 className="text-lg md:text-2xl font-extrabold text-blue-900 mb-6">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <img
                  src={feature.imageUrl}
                  alt={feature.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold text-blue-800">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-gray-900 text-sm md:text-base font-sans">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Vision & Mission */}
      <div className="w-full bg-[#000C3E] text-gray-100 flex flex-col items-center py-20 md:py-28">
        <h3 className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] text-xl md:text-3xl font-semibold mb-10">
          Vision & Mission
        </h3>
        <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] flex flex-col md:flex-row gap-6">
          <div className="bg-white text-blue-950 rounded-lg shadow-md p-6 w-full md:w-1/2">
            <div className="flex items-center mb-4">
              <Image
                src="/images/vission.png"
                alt="icon search"
                width={50}
                height={50}
              />
            </div>
            <h4 className="text-2xl font-bold  p-2 mb-5 font-sans">Vision</h4>

            <p className="text-gray-800 text-sm md:text-base font-sans">
              To be the premier platform that transforms the future of job
              searching and recruitment by creating meaningful connections,
              empowering individuals, and driving business success globaly.{" "}
            </p>
          </div>

          <div className="bg-white text-blue-950 rounded-lg shadow-md p-6 w-full md:w-1/2">
            <div className="flex items-center mb-4">
              <Image
                src="/images/mission.png"
                alt="icon search"
                width={50}
                height={50}
              />
            </div>
            <h4 className="text-2xl font-bold  p-2 mb-5 font-sans">Mission</h4>

            <p className="text-gray-800 text-sm md:text-base font-sans">
              We strive to simplify and elevate the recruitement experience for
              both job seekers and employers. By leveraging innovative
              technology and personalized support, we connect the right talent
              with the right opportunities, foresting growth , success, and a
              stronger workforce for the future.
            </p>
          </div>
        </div>
      </div>

      {/* Commitment Section */}
      <div className="w-full bg-gray-50 text-blue-900 flex flex-col items-center py-20 md:py-28">
        <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Text Content */}
          <div className="md:w-1/2 justify-start">
            <h3 className="text-2xl font-bold text-start mb-8 font-sans ">
              Commitment to a sustainable future is attached
            </h3>

            <p className="leading-relaxed text-lg font-sans">
              At Skill Careers, we believe that finding the right job or the
              right talent should be seamless and efficient. Founded with the
              mission to bridge the gap between job seekers and recruiters, we
              are committed to offering a platform that is both easy to use and
              highly effective. Whether you're a job seeker looking to advance
              your career or a recruiter seeking top talent, Skill Careers is
              here to support you every step of the way.
            </p>
            <button className="bg-blue-900 text-gray-100 px-6 py-3 mt-10 ">
              <span className="flex items-center justify-center ">
                Our Sustainability Policy
                <img
                  src="/images/arrow.png"
                  alt="arrow"
                  className="h-6 w-6 ml-3 mr-5"
                />
              </span>
            </button>
          </div>

          {/* Image */}
          <div className="md:w-1/2 w-full flex justify-center md:justify-start">
            <Image
              src="/images/future.png"
              alt="Person 1"
              width={300}
              height={300}
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default aboutPage;
