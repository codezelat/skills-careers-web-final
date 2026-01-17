import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const recruiterId = searchParams.get("recruiterId");

    const client = await connectToDatabase();
    const db = client.db();
    let filter = {};

    // Add recruiter filter if provided
    if (recruiterId) {
      filter.recruiterId = new ObjectId(recruiterId);
    }

    // Add published filter if provided
    const published = searchParams.get("published");
    if (published === "true") {
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
            { recruiterInfo: { $size: 0 } }, // Include tickets without recruiter match (edge case)
          ],
        },
      },
      {
        $project: {
          recruiterInfo: 0, // Remove recruiter info from response
        },
      },
      // Sort by createdAt in descending order (newest first)
      { $sort: { createdAt: -1 } },
    ];

    // Execute the query
    const tickets = await db
      .collection("tickets")
      .aggregate(pipeline)
      .toArray();
    const count = tickets.length;
    return NextResponse.json(
      { tickets, count },
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
