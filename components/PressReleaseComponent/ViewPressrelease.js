"use client";
import { useState } from "react";
import { formatDate, handleCloseForm, handleOpenForm } from "@/handlers";
import DeleteConfirmation from "./DeleteConfirmation";
import UpdatePressrelease from "./UpdatePressrelease";
import Image from "next/image";

function ViewPressrelease({ pressrelease, onClose }) {
  const [selectedPressreleaseUpdate, setSelectedPressreleaseUpdate] =
    useState(false);
  const [selectedPressreleaseDelete, setSelectedPressreleaseDelete] =
    useState(false);
  const date = formatDate(pressrelease.createdAt);

  return (
    <div className="flex flex-col p-6 bg-white rounded-xl">
      <div className="p-4">
        <div className="flex justify-between mb-6">
          <div className="flex flex-col space-y-1">
            <p className="text-xl font-semibold text-[#001571]">
              {pressrelease.title}
            </p>
            <p className="text-sm font-semibold text-[#001571] mb-8">{date}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleOpenForm(setSelectedPressreleaseUpdate)}
              className=" text-white  rounded-md"
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/images/miyuri_img/editblue.png"
                  alt="arrow"
                  width={50}
                  height={16}
                />
              </div>
            </button>
            {selectedPressreleaseUpdate && (
              <UpdatePressrelease
                onClose={handleCloseForm(setSelectedPressreleaseUpdate)}
                pressrelease={pressrelease}
              />
            )}

            <button
              onClick={handleOpenForm(setSelectedPressreleaseDelete)}
              className=" text-white  rounded-md"
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/images/miyuri_img/deleteblue.png"
                  alt="delete"
                  width={50}
                  height={20}
                />
              </div>
            </button>
            {selectedPressreleaseDelete && (
              <DeleteConfirmation
                onClose={handleCloseForm(setSelectedPressreleaseDelete)}
                pressrelease={pressrelease}
              />
            )}
          </div>
        </div>
        <div className="relative w-full h-[400px] mb-4 z-0">
        <Image
            src={pressrelease.image}
            alt="img"
            layout="fill" // Automatically adjusts to the container
            objectFit="cover" // Ensures the image fills the container
            className="rounded-lg"
          />
        </div>
        <div>
          <p className="mb-2">{pressrelease.description}</p>
        </div>
      </div>
    </div>
  );
}
export default ViewPressrelease;
