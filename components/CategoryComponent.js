import Link from "next/link";
import React from "react";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { categories } from "@/lib/categories";

export default function CategoryComponent() {
  return (
    <section className="bg-white pt-8 flex items-center justify-center w-full">
      <div className=" pb-3 w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px]">
        <div className="grid grid-cols-2 pt-5">
          <div className="flex justify-start gap-4 mb-8 text-[#33448D] font-bold text-lg lg:text-xl md:text-xl sm:text-lg">
            <p>Categories</p>
          </div>
          <div className="flex justify-end -2 gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-xl md:text-xl sm:text-lg">
            <Link href="/categoryPage">
              <p className="flex">
                View All
                <span className="ml-3">
                  <BsArrowUpRightCircleFill />
                </span>
              </p>
            </Link>
          </div>
        </div>
        <div className="container mx-auto py-10">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8">
            {categories.slice(0, 9).map((category, index) => (
              <React.Fragment key={index}>
                <Link
                  href={`/jobs?industry=${encodeURIComponent(category.name)}`}
                >
                  <div className="flex items-center gap-4 text-center hover:bg-gray-100 p-4 rounded-lg cursor-pointer">
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-10 h-10"
                    />
                    <p className="text-lg font-medium text-gray-800">
                      {category.name}
                    </p>
                  </div>
                </Link>

                {(index + 1) % 3 === 0 && index + 1 !== 9 && (
                  <div className="col-span-full border-t border-gray-300"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
