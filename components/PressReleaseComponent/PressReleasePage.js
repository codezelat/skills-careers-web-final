import Image from "next/image";
import { useState } from "react";
import EditRelease from "./EditReleaseForm";

export default function PressReleasePage({ pressrelease, onViewPressrelease }) {
  const handleViewPressrelease = () => {
    onViewPressrelease?.();
  };

  const date = formatDate(pressrelease.createdAt);
    const [showReleaseEditForm, setShowReleaseEditForm] = useState(false);
  
  return (
    <div className="flex flex-col p-6 bg-white rounded-xl">
        <div  className="p-4">
          <div className="flex justify-between mb-6">
            <div className="flex flex-col space-y-1">
              <p className="text-xl font-semibold text-[#001571]">
                {pressrelease.title}
              </p>
              <p className="text-sm font-semibold text-[#001571] mb-8">
                {date}
              </p>
            </div>
            <div className="flex space-x-3">
            <button
              onClick={() => setShowReleaseEditForm(true)}
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
              <Image
                src="/images/miyuri_img/deleteblue.png"
                alt="delete"
                width={50}
                height={20}
              />
            </div>
          </div>
          <div className="relative w-full h-[400px] mb-4">
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
            {pressrelease.description}
          </div>
        </div>
              {/* Edit Release Popup */}
              {showReleaseEditForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                  <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
                    <EditRelease
                      onClose={() => setShowReleaseEditForm(false)}
                    />
                  </div>
                </div>
              )}
      
    </div>
  );
}
