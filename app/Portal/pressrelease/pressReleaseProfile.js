"use client"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PortalLoading from "../loading";

export default function PressreleaseProfile({ slug }) {

    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [pressreleaseDetails, setPressreleaseDetails] = useState({
        _id: "",
        title: "",
        description: "",
        image: "",
        createdAt: ""
    });

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
                    console.log(data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchPressreleases();
        }
    }, [session, slug]);


    if (loading) return <PortalLoading />;

    return (
        <div>
            Title : {pressreleaseDetails.title} 
        </div>
    )
}