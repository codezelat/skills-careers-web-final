import Link from "next/link";
import React from "react";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

const categories = [
  { name: "Technology & Development", icon: "/catagory/svg/creative.svg" },
  { name: "Operations & Logistics", icon: "/catagory/svg/operation.svg" },
  { name: "Finance & Accounting", icon: "/catagory/svg/finance.svg" },
  { name: "Education & Training", icon: "/catagory/svg/education.svg" },
  { name: "Human Resources", icon: "/catagory/svg/human.svg" },
  { name: "Marketing & Sales", icon: "/catagory/svg/marketing.svg" },
  { name: "Health & Wellness", icon: "/catagory/svg/health.svg" },
  { name: "Human Resources", icon: "/catagory/svg/human.svg" },
  { name: "Human Resources", icon: "/catagory/svg/human.svg" },
];

export default function CategoryComponent() {
  return (
    <section className="bg-white pt-8 flex items-center justify-center">
        <div className=" pb-3 w-[1280px]">
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
        {categories.map((category, index) => (
           <React.Fragment key={index}>
          <div
            key={index}
            className="flex items-center gap-4 text-center hover:bg-gray-100 p-4 rounded-lg"
          >
            <img
              src={category.icon}
              alt={category.name}
              className="w-10 h-10"
            />
            
            <p className="text-lg font-medium text-gray-800">{category.name}</p>
          </div>
          
          {(index + 1) % 3 === 0 && index + 1 !== categories.length && (
            <div className="col-span-full border-t border-gray-300 "></div>
          )}
        </React.Fragment>
        
      ))}
      </div>
    </div>
    </div>
    </section>
  );
}
