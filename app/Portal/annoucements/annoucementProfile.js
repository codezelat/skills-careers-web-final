"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PortalLoading from "../loading";

export default function AnnoucementProfile({ slug }) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [annoucementDetails, setAnnoucementDetails] = useState({
    _id: "",
    announcementTitle: "",
    announcementDescription: "",
    createdAt: "",
  });

  useEffect(() => {
    if (session?.user?.email) {
      const fetchAnnouncments = async () => {
        try {
          const response = await fetch(`/api/announcement/get?id=${slug}`);

          if (!response.ok) {
            if (response.status === 404) {
              setError("Announcement not found. It may have been deleted.");
            } else {
              throw new Error("Failed to fetch Announcements.");
            }
            setLoading(false);
            return;
          }

          const data = await response.json();
          setAnnoucementDetails(data.announcement); // Access the nested announcement object
          console.log(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchAnnouncments();
    }
  }, [session, slug]);

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
          Announcement Not Available
        </h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return <div>Title : {annoucementDetails.announcementTitle}</div>;
}
