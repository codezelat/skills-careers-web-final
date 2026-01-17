"use client";

import { useSession } from "next-auth/react";
import { formatDate, handleCloseForm, handleOpenForm } from "@/lib/handlers";
import { useEffect, useState } from "react";
import PortalLoading from "../loading";
import Image from "next/image";
import UpdatePressrelease from "./UpdatePressrelease";
import DeleteConfirmation from "./DeleteConfirmation";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";

export default function PressreleaseProfile({ slug, onClose = () => {} }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [selectedPressreleaseUpdate, setSelectedPressreleaseUpdate] =
    useState(false);
  const [selectedPressreleaseDelete, setSelectedPressreleaseDelete] =
    useState(false);

  const [error, setError] = useState(null);
  const [pressreleaseDetails, setPressreleaseDetails] = useState({
    _id: "",
    title: "",
    description: "",
    image: "",
    createdAt: "",
  });

  const date = formatDate(pressreleaseDetails.createdAt);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchPressreleases = async () => {
        try {
          const response = await fetch(`/api/pressrelease/get?id=${slug}`);
          if (!response.ok) {
            if (response.status === 404) {
              setError("Press release not found. It may have been deleted.");
            } else {
              throw new Error("Failed to fetch Press Release.");
            }
            setLoading(false);
            return;
          }
          const data = await response.json();
          setPressreleaseDetails(data.pressrelease);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPressreleases();
    }
  }, [session, slug]);

  const submitHandler = async (updatedDetails, file) => {
    const formData = new FormData();
    formData.append("_id", updatedDetails._id);
    formData.append("title", updatedDetails.title);
    formData.append("description", updatedDetails.description);
    formData.append("currentImageUrl", updatedDetails.image);
    if (file) formData.append("image", file);

    try {
      const response = await fetch(`/api/pressrelease/update`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPressreleaseDetails((prev) => ({
          ...prev,
          image: data.imageUrl || prev.image,
        }));
        handleCloseForm(setSelectedPressreleaseUpdate); // Close the update form
      } else {
        console.error("Error updating press release details:", err);
      }
    } catch (err) {
      console.error("Error updating press release details:", err);
    }
  };

  if (loading) return <PortalLoading />;
  if (error) {
    return (
      <div className="bg-white rounded-xl py-10 px-7 text-center">
        <div className="text-red-500 mb-4">
          <svg
            className="inline-block w-16 h-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#001571] mb-2">
          Press Release Not Available
        </h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 bg-white rounded-xl min-h-screen">
      <div className="p-4">
        <div className="flex justify-between mb-6">
          <div className="flex flex-col space-y-1">
            <p className="text-xl font-semibold text-[#001571]">
              {pressreleaseDetails.title}
            </p>
            <p className="text-sm font-semibold text-[#001571] mb-8">{date}</p>
          </div>
          {session?.user?.role === "admin" && (
            <div className="flex space-x-3">
              <button
                onClick={handleOpenForm(setSelectedPressreleaseUpdate)}
                className="text-white rounded-md"
              >
                <MdOutlineModeEdit
                  size={25}
                  color="white"
                  className="bg-[#001571] rounded-full p-2 w-10 h-10"
                />{" "}
              </button>
              {selectedPressreleaseUpdate && (
                <UpdatePressrelease
                  pressreleaseDetails={pressreleaseDetails}
                  onClose={handleCloseForm(setSelectedPressreleaseUpdate)}
                  onSubmit={submitHandler}
                />
              )}

              <button
                onClick={handleOpenForm(setSelectedPressreleaseDelete)}
                className=" text-white  rounded-md"
              >
                <div className="flex items-center gap-2">
                  <RiDeleteBin5Line
                    size={25}
                    color="white"
                    className="bg-[#001571] rounded-full p-2 w-10 h-10"
                  />
                </div>
              </button>
              {selectedPressreleaseDelete && (
                <DeleteConfirmation
                  onClose={handleCloseForm(setSelectedPressreleaseDelete)}
                  pressreleaseDetails={pressreleaseDetails}
                  slug={slug}
                />
              )}
            </div>
          )}
        </div>
        <div className="relative w-full h-[400px] mb-4 z-0">
          {pressreleaseDetails.image &&
          pressreleaseDetails.image.trim() !== "" ? (
            <Image
              src={pressreleaseDetails.image}
              alt="img"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          ) : (
            <Image
              src="/images/pressrelease-default.jpg"
              alt="img"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          )}
        </div>
        <div>
          <p className="mb-2">{pressreleaseDetails.description}</p>
        </div>
      </div>
    </div>
  );
}
