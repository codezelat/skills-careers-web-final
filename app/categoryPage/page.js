"use client";
import NavBar from "@/components/navBar";
import { categories } from "../../lib/categories";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation"; // Import useRouter

export default function CategoryPage() {
  const [search, setSearch] = useState("");
  const router = useRouter(); // Initialize useRouter

  // Function to handle category click
  const handleCategoryClick = (categoryName) => {
    // Navigate to the Jobs Page with the selected category as a query parameter
    router.push(`/jobs?industry=${encodeURIComponent(categoryName)}`);
  };

  return (
    <>
      <div className="relative bg-[#F5F5F5]">
        <div className="h-[90vh] w-full bg-white absolute top-0 left-0 z-[1]">
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
        <div className="w-full pt-24 z-[2] relative">
          <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px]">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[#8A93BE] mt-28">
                Search for Job{" "}
                <span className="font-bold text-[#001571]">Categories</span>
              </h1>
              <p className="text-[#8A93BE] mt-3 font-semibold text-base">
                Explore the diverse range of job categories to find the perfect fit
                for your skills and interests.
              </p>
            </div>
            <div className="bg-[#E6E8F1] rounded-md h-auto">
              <div className="flex  justify-between items-center gap-4 w-auto rounded-lg">
                <input
                  type="text"
                  placeholder="Easily find the category you’re looking for..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#E6E8F1] flex-grow px-4 py-6 focus:outline-none w-full rounded-md sm:w-auto font-bold placeholder-[#5462A0]"
                />
                <button className="flex items-center justify-center w-wrap lg:w-1/5 md:w-1/5 sm:w-1/5  bg-[#001571] text-white px-6 py-3 rounded-md font-semibold text-[12px] md:text-[16px]">
                  <span className="md:mt-1 mr-2 md:mr-4">
                    <IoSearchSharp size={15} />
                  </span>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="z-[2] w-full relative">
          <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] space-y-5 py-32">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories
                .filter((category) =>
                  category.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((category, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center p-6 bg-white border hover:bg-[#CAD1F1] border-gray-300 rounded-lg shadow-md cursor-pointer"
                    onClick={() => handleCategoryClick(category.name)} // Add onClick handler
                  >
                    <Image
                      src={category.icon}
                      alt={category.name}
                      width={70}
                      height={70}
                      color="#001571"
                    />
                    <p className="mt-2 text-base font-semibold text-center text-gray-700">
                      {category.name}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}