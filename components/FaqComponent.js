"use client";
import Link from "next/link";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faqs } from "../lib/faq";
import { useState } from "react";

export default function FaqComponent() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <>
      <div className="w-[1280px] grid grid-cols-2 mt-32">
        <div className="flex justify-start gap-4 mb-8 text-[#33448D] font-bold text-lg lg:text-xl md:text-xl sm:text-lg">
          <p>FAQ</p>
        </div>
        <div className="flex justify-end -2 gap-4 mb-8 text-[#001571] font-bold text-lg lg:text-xl md:text-xl sm:text-lg">
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
      <div className="w-[1280px] mt-6">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-300">
              <button
                className="w-full text-left py-3 text-lg text-black font-bold flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span>
                  {activeIndex === index ? (
                    <FontAwesomeIcon icon={faAngleUp} />
                  ) : (
                    <FontAwesomeIcon icon={faAngleDown} />
                  )}
                </span>
              </button>
              {activeIndex === index && (
                <div className="text-black font-semibold text-base mb-4 px-4">
                  {faq.answer || "Content for this question is not available."}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
