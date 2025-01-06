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
      <div className="w-[1280px] bg-custom-double grid grid-cols-1 sm:grid-cols-2 pt-5 gap-y-4 sm:gap-y-0">

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
      <div className="w-[1280px] mt-16">
        <div className="flex items-center justify-between relative w-full">
          {/* Left navigation button */}
          <div className="swiper-button-prev-custom mr-2 sm:mr-6 hidden sm:block">
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
            className="w-full"
            modules={[Pagination, Navigation]}
          >
            {storyData.map((story) => (
              <SwiperSlide key={story.id} className="mb-3">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="w-full text-start text-[#001571] text-4xl sm:text-5xl font-bold">
                      “
                    </h1>
                  </div>
                  <p className="text-[#000000] text-sm text-justify sm:text-base mb-4 font-semibold">
                    {story.description}
                  </p>
                  <hr className="my-4 border-t-2 border-[#001571]" />
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
                    <div className="col-span-1 flex justify-center sm:justify-start">
                      <Image
                        src={story.image}
                        width={50}
                        height={50}
                        alt="User"
                        className="rounded-full border border-4 border-[#001571]"
                      />
                    </div>
                    <div className="col-span-2">
                      <p className="text-md sm:text-xl font-bold text-[#001571]">
                        {story.name}
                      </p>
                      <p className="text-sm sm:text-md font-bold text-[#000000]">
                        {story.title}
                      </p>
                      <p className="text-sm sm:text-md font-bold text-[#000000]">
                        {story.company}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="custom-pagination mt-16" />
          </Swiper>
          {/* Right navigation button */}
          <div className="swiper-button-next-custom ml-2 sm:ml-6 hidden sm:block">
            <img src="/right.png" alt="Next" />
          </div>
        </div>
      </div>
    </>
  );
}
