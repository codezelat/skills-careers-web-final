// components/PressReleaseSection.js
import Link from "next/link";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import Image from "next/image";

async function getPressReleases() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/pressrelease/all`;
  console.log("Fetching press releases from:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Response not OK:", response.status, response.statusText);
      throw new Error('Failed to fetch press releases');
    }
    const data = await response.json();
    console.log("Fetched press releases:", data);
    return data.pressreleases;
  } catch (error) {
    console.error('Error fetching press releases:', error);
    return [];
  }
}

export default async function PressReleaseSection() {
  const pressreleases = await getPressReleases();
  console.log("Press releases in component:", pressreleases);

  // Ensure there are at least 3 press releases to match the layout
  const featuredPressRelease = pressreleases[0]; // First press release is featured
  const smallerPressReleases = pressreleases.slice(1, 3); // Next two are smaller

  return (
    <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px]">
      <div className="w-full flex justify-between">
        <div className="flex justify-start gap-4 mb-8 text-[#33448D] font-bold text-xl">
          <p>Latest Press Releases</p>
        </div>
        <div className="flex justify-end -2 gap-4 mb-8 text-[#001571] font-bold text-xl">
          <Link href="/pressRelease">
            <p className="flex">
              View All
              <span className="ml-3">
                <BsArrowUpRightCircleFill />
              </span>
            </p>
          </Link>
        </div>
      </div>
      <div className="w-full container mt-8">
        <div className="h-screen grid grid-cols-5 grid-rows-2 space-x-6">
          {/* Featured Press Release (Large Section) */}
          <div className="col-span-3 row-span-2 bg-white border border-gray-200 overflow-y-auto rounded-lg shadow-lg hide-scrollbar">
            <div className="bg-white p-3">
              <Image
                src={featuredPressRelease?.image || "/newsImage.png"}
                alt="Featured Press Release"
                width={600}
                height={200}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="p-6 flex-grow">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {featuredPressRelease?.title || "No Featured Press Release"}
              </h2>
              <p className="text-gray-700 mb-4">
                {featuredPressRelease?.description || "No description available."}
              </p>
              <p className="text-gray-500 mt-4">
                {new Date(featuredPressRelease?.createdAt).toLocaleDateString() || "01 Oct 2024"}
              </p>
            </div>
          </div>

          {/* Smaller Press Releases */}
          {smallerPressReleases.map((pressrelease, index) => (
            <div
              key={index}
              className="col-span-2 row-span-1 bg-white border border-gray-200 overflow-y-auto rounded-lg shadow-lg mb-4 hide-scrollbar"
            >
              <div className="bg-white p-3">
                <Image
                  src={pressrelease?.image || "/newsImage.png"}
                  alt="Small Press Release"
                  width={200}
                  height={200}
                  className="w-full h-[200px] object-cover rounded-lg"
                />
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {pressrelease?.title || "No Title"}
                </h3>
                <p className="text-gray-700 mb-4 text-md">
                  {pressrelease?.description || "No description available."}
                </p>
                <p className="text-gray-500 mt-4">
                  {new Date(pressrelease?.createdAt).toLocaleDateString() || "01 Oct 2024"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}