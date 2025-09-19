import Link from "next/link";
import React from "react";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

const categories = [
  { name: "IT - Software & Internet", icon: "/catagory/svg/creative.svg" },
  { name: "IT - Hardware, Network & Telecoms", icon: "/catagory/svg/operation.svg" },
  { name: "Accounting, Banking, Finance & Insurance", icon: "/catagory/svg/finance.svg" },
  { name: "Sales, Marketing & Digital", icon: "/catagory/svg/education.svg" },
  { name: "Corporate & Senior Management", icon: "/catagory/svg/human.svg" },
  { name: "HR, Administration & Office Support", icon: "/catagory/svg/marketing.svg" },
  { name: "Civil Engineering, Architecture & Design", icon: "/catagory/svg/health.svg" },
  { name: "Mechanical, Electrical & Technical Engineerings", icon: "/catagory/svg/human.svg" },
  { name: "Manufacturing, Operations & Quality", icon: "/catagory/svg/human.svg" },
  { name: "Logistics, Supply Chain, Imports & Exports", icon: "/catagory/svg/creative.svg" },
  { name: "Media, Advertising & Creatives", icon: "/catagory/svg/operation.svg" },
  { name: "Hospitality, Tourism & Leisure", icon: "/catagory/svg/finance.svg" },
  { name: "Sports, Fitness & Recreation", icon: "/catagory/svg/education.svg" },
  { name: "Healthcare & Pharmaceutical", icon: "/catagory/svg/human.svg" },
  { name: "Legal, Government & Public Sector", icon: "/catagory/svg/marketing.svg" },
  { name: "Science, Research & Development", icon: "/catagory/svg/health.svg" },
  { name: "Apparel, Retail & Fashion", icon: "/catagory/svg/human.svg" },
  { name: "Education & Training", icon: "/catagory/svg/human.svg" },
  { name: "Agriculture, Environment & Green Jobs", icon: "/catagory/svg/finance.svg" },
  { name: "Security, Military & Risk Management", icon: "/catagory/svg/education.svg" },
  { name: "NGOs, International Development & Volunteering", icon: "/catagory/svg/human.svg" },
  { name: "Foreign Jobs", icon: "/catagory/svg/marketing.svg" },
  { name: "Flexible / Remote Work", icon: "/catagory/svg/health.svg" },
  { name: "Startups & Tech Innovation", icon: "/catagory/svg/human.svg" },
  { name: "Specialized & Miscellaneous", icon: "/catagory/svg/human.svg" },
];

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
    <div
      className="flex items-center gap-4 text-center hover:bg-gray-100 p-4 rounded-lg"
    >
      <img
        src={category.icon}
        alt={category.name}
        className="w-10 h-10"
      />
      <p className="text-lg font-medium text-gray-800">{category.name}</p>
    </div>

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
