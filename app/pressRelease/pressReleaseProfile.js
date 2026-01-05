"use client";

import { useSession } from "next-auth/react";
import { formatDate, handleCloseForm, handleOpenForm } from "@/lib/handlers";
import { useEffect, useState } from "react";
import PortalLoading from "../loading";
import Image from "next/image";

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
            throw new Error("Failed to fetch Press.");
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
        </div>
        <div className="relative w-full h-[400px] mb-4 z-0">
          {pressreleaseDetails.image &&
          pressreleaseDetails.image.trim() !== "" ? (
            <Image
              src={pressreleaseDetails.image}
              alt="img"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          ) : (
            <Image
              src="/images/pressrelease-default.jpg"
              alt="img"
              layout="fill"
              objectFit="cover"
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
