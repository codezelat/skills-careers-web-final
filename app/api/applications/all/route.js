import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db();

    const jobapplications = await db.collection("jobapplication").find().toArray();

    // Format data to match frontend needs
    const formattedApplications = jobapplications.map(app => ({
      id: app._id.toString(),
      candidateName: app.candidateName,
      jobTitle: app.jobTitle,
      email: app.email,
      date: new Date(app.date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).toUpperCase()
    }));

    client.close();

    return NextResponse.json(
      {
        applications: formattedApplications,
        count: formattedApplications.length
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "CDN-Cache-Control": "no-store",
          "Surrogate-Control": "no-store",
          Pragma: "no-cache",
          Expires: "0",
          "x-netlify-cache": "miss", // Explicitly tell Netlify to bypass cache
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}