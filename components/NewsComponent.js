import Link from "next/link";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
const { default: Image } = require("next/image");
export default function NewsComponent() {
  return (
    <>
      <div className="w-[1280px] mt-28 grid grid-cols-2 pt-5">
        <div className="flex justify-start gap-4 mb-8 text-[#33448D] font-bold text-xl">
          <p>Latest News</p>
        </div>
        <div className="flex justify-end -2 gap-4 mb-8 text-[#001571] font-bold text-xl">
          <Link href="">
            <p className="flex">
              View All
              <span className="ml-3">
                <BsArrowUpRightCircleFill />
              </span>
            </p>
          </Link>
        </div>
      </div>
      <div className="w-[1280px] container mt-8">
        <div className="h-screen grid grid-cols-5 grid-rows-2 space-x-6 ">
          {/* Red Section */}
          <div className="col-span-3 row-span-2 bg-white border border-gray-200 overflow-y-auto rounded-lg shadow-lg">
            <div className="bg-white p-3">
              <Image
                src="/newsImage.png"
                alt="Featured Article"
                width={600}
                height={200}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="p-6 flex-grow">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tech Industry Jobs See 20% Growth in 2024
              </h2>
              <p className="text-gray-700 mb-4">
                The tech industry continues to boom in 2024, with a 20% increase
                in job openings across software development, cybersecurity, and
                AI-related fields. Learn more about the skills in demand and the
                companies leading the way in this exciting sector.
              </p>
              <button className="bg-[#001571] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Read Now
              </button>
              <p className="text-gray-500 mt-4">01 Oct 2024</p>
            </div>
          </div>
          
            <div className="col-span-2 row-span-1 bg-white border border-gray-200 overflow-y-auto rounded-lg shadow-lg mb-4">
              <div className="bg-white p-3">
                <Image
                  src="/newsImage.png"
                  alt="Small Article"
                  width={200}
                  height={200}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Tech Industry Jobs See 20% Growth in 2024
                </h3>
                <p className="text-gray-700 mb-4 text-md">
                  The tech industry continues to boom in 2024, with a 20%
                  increase in job openings across software development,
                  cybersecurity, and AI-related fields. Learn more about the
                  skills in demand and the companies leading the way in this
                  exciting sector.
                </p>
                <button className="bg-[#001571] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Read Now
                </button>
                <p className="text-gray-500 mt-4">01 Oct 2024</p>
              </div>
            </div>

            <div className="col-span-2 row-span-1 bg-white border border-gray-200 overflow-y-auto rounded-lg shadow-lg">
              <div className="bg-white p-3">
                <Image
                  src="/newsImage.png"
                  alt="Small Article"
                  width={400}
                  height={200}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Tech Industry Jobs See 20% Growth in 2024
                </h3>
                <p className="text-gray-700 mb-4">
                  The tech industry continues to boom in 2024, with a 20%
                  increase in job openings across software development,
                  cybersecurity, and AI-related fields. Learn more about the
                  skills in demand and the companies leading the way in this
                  exciting sector.
                </p>
                <button className="bg-[#001571] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Read Now
                </button>
                <p className="text-gray-500 mt-4">01 Oct 2024</p>
              </div>
            </div>
          </div>
        
      </div>
    </>
  );
}
