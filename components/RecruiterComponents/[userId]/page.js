'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RecruiterProfile from "@/app/admindashboard/recruiters/RecruiterProfile";

export default function RecruiterDetailsPage() {
  const router = useRouter();
  const { userId } = router.query; // Use recruiterId instead of _id
  const [recruiterData, setRecruiterData] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchRecruiterData(userId);
    }
  }, [userId]);

  const fetchRecruiterData = async (userId) => {
    try {
      const response = await fetch(`/api/recruiter/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setRecruiterData(data);
      } else {
        console.error("Failed to fetch recruiter data");
      }
    } catch (error) {
      console.error("Error fetching recruiter data:", error);
    }
  };

  return (
    <div>
      {recruiterData ? (
        <RecruiterProfile recruiter={recruiterData} />
      ) : (
        <p>Loading recruiter profile...</p>
      )}
    </div>
  );
}
