import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const recruiterId = searchParams.get("recruiterId");
    const showAll = searchParams.get("showAll") === "true"; // Parameter to optionally show all jobs

    // Use the cached client promise
    const client = await clientPromise;
    const db = client.db();

    let filter = {};

    // Add ID filter if provided
    if (id) {
      filter._id = new ObjectId(id);
    }

    // Add recruiter filter if provided
    if (recruiterId) {
      filter.recruiterId = new ObjectId(recruiterId);
    }

    // Only show published jobs unless showAll is true
    if (!showAll) {
      filter.isPublished = true;
    }

    const jobs = await db.collection("jobs").find(filter).toArray();
    const count = jobs.length;

    // Do NOT close the client:

    return NextResponse.json(
      { jobs, count },
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
    console.error("API Error in /api/job/all:", error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
