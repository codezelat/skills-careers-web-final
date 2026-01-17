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

    // Use aggregation to join with recruiters and filter out restricted ones
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "recruiters",
          localField: "recruiterId",
          foreignField: "_id",
          as: "recruiterInfo",
        },
      },
      {
        $match: {
          $or: [
            { "recruiterInfo.isRestricted": { $ne: true } },
            { recruiterInfo: { $size: 0 } }, // Include jobs without recruiter match (edge case)
          ],
        },
      },
      {
        $project: {
          recruiterInfo: 0, // Remove recruiter info from response
        },
      },
    ];

    const jobs = await db.collection("jobs").aggregate(pipeline).toArray();
    const count = jobs.length;

    // Add smart caching: public jobs can be cached, admin views shouldn't be
    const cacheControl = showAll
      ? "no-store, no-cache, must-revalidate"
      : "public, s-maxage=30, stale-while-revalidate=15";

    return NextResponse.json(
      { jobs, count },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": cacheControl,
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
