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
    <div className="fixed inset-0 bg-black/50 z-40">
      <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-[90vh] w-3/4 overflow-hidden overflow-y-auto bg-white shadow-2xl rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">View Press Release</h2>

          <button
            onClick={onClose}
            className="px-2 py-1 h-12 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
          >
            Close ✕
          </button>
        </div>

        <div className="flex justify-end">
          <div className="flex gap-2">
            {/* Edit Button */}
            <button
              onClick={handleOpenForm(setSelectedPressreleaseUpdate)}
              className="px-4 py-1 h-12 ml-auto border-2 border-green-500 text-green-500 hover:bg-green-500 hover:cursor-pointer hover:text-white rounded transition-colors"
            >
              Edit
            </button>
            {selectedPressreleaseUpdate && (
              <UpdatePressrelease
                onClose={handleCloseForm(setSelectedPressreleaseUpdate)}
                pressrelease={pressrelease}
              />
            )}

            {/* Delete Button */}
            <button
              onClick={handleOpenForm(setSelectedPressreleaseDelete)}
              className="px-4 py-1 h-12 ml-auto border-2 border-red-500 text-red-500 hover:bg-red-500 hover:cursor-pointer hover:text-white rounded transition-colors"
            >
              Delete
            </button>
            {selectedPressreleaseDelete && (
              <DeleteConfirmation
                onClose={handleCloseForm(setSelectedPressreleaseDelete)}
                pressrelease={pressrelease}
              />
            )}
          </div>
        </div>

        <div>
          <Image
            alt={pressrelease.title}
            src={pressrelease.image}
            className="w-fit"
            width={200}
            height={50}
          />

          <h1 className="text-xl font-semibold my-4">{pressrelease.title}</h1>
          <p className="text-sm my-2">{date}</p>
          <p className="text-sm text-gray-600">{pressrelease.description}</p>
        </div>
      </div>
    </div>
  );
}
export default ViewPressrelease;