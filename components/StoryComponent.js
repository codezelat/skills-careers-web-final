"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";
import { storyData } from "../lib/successStory";
import Image from "next/image";
import Link from "next/link";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

export default function StoryComponent() {
  return (
    <>
      <div className="w-full">
        <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] flex justify-between">
          <div className="flex justify-start gap-4 text-[#33448D] font-bold text-lg lg:text-xl md:text-xl sm:text-lg">
            <p>Success Stories from Our Community</p>
          </div>
          <div className="flex justify-end gap-4 text-[#001571] font-bold text-lg lg:text-xl md:text-xl sm:text-lg">
            <Link href="">
              <p className="flex items-center">
                View All
                <span className="ml-2 sm:ml-3">
                  <BsArrowUpRightCircleFill />
                </span>
              </p>
            </Link>
          </div>
        </div>
        <div className="w-full mt-16">
          <div className="flex items-center justify-between relative w-full px-[20px] xl:px-[0px]">
            {/* Left navigation button */}
            <div className="swiper-button-prev-custom flex items-center justify-center">
              <img src="/left.png" alt="Previous" />
            </div>
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              pagination={{
                clickable: true,
                el: ".custom-pagination",
              }}
              loop={true}
              className="w-full max-w-[1280px] swiper-container"
              modules={[Pagination, Navigation]}
            >
              {storyData.map((story) => (
                <SwiperSlide key={story.id} className="mb-3 h-auto">
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg h-[380px] sm:h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <h1 className="w-full text-start text-[#001571] text-4xl sm:text-5xl font-bold leading-none">
                        “
                      </h1>
                    </div>
                    <div className="flex-1 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-[#001571] scrollbar-track-gray-100">
                      <p className="text-[#000000] text-sm sm:text-base leading-relaxed font-medium pr-2">
                        {story.description}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <hr className="my-3 border-t-2 border-[#001571]" />
                      <div className="grid grid-cols-3 gap-3 sm:gap-4 items-center">
                        <div className="col-span-1 flex justify-center sm:justify-start">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-[#001571] overflow-hidden flex-shrink-0">
                            <Image
                              src={story.image}
                              width={64}
                              height={64}
                              alt={story.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="col-span-2 min-w-0">
                          <p className="text-sm sm:text-base font-bold text-[#001571] leading-tight truncate">
                            {story.name}
                          </p>
                          {story.title && story.title.trim() !== "" && (
                            <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-0.5 leading-tight">
                              {story.title}
                            </p>
                          )}
                          {story.company && story.company.trim() !== "" && (
                            <p className="text-xs sm:text-sm font-medium text-gray-600 leading-tight">
                              {story.company}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              <div className="custom-pagination mt-16" />
            </Swiper>
            {/* Right navigation button */}
            <div className="swiper-button-next-custom flex items-center justify-center">
              <img src="/right.png" alt="Next" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
