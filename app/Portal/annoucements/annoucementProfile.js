"use client"
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
                        throw new Error("Failed to fetch Announcements.");
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

    return (
        <div>
            Title : {annoucementDetails.announcementTitle} 
        </div>
    )
}