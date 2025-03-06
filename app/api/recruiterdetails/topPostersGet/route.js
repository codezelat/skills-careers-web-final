import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let client;
  try {
    client = await connectToDatabase();
    const db = client.db();

    const topRecruiters = await db
      .collection("jobs")
      .aggregate([
        {
          $group: {
            _id: "$recruiterId",
            jobCount: { $sum: 1 }
          }
        },
        {
          $sort: { jobCount: -1 }
        },
        {
          $limit: 10 
        },
        {
          $lookup: {
            from: "recruiters",
            localField: "_id",
            foreignField: "_id",
            as: "recruiterDetails"
          }
        },
        {
          $unwind: "$recruiterDetails"
        },
        {
          $project: {
            _id: 0,
            recruiterId: "$_id",
            jobCount: 1,
            recruiterName: "$recruiterDetails.recruiterName",
            logo: "$recruiterDetails.logo"
          }
        }
      ])
      .toArray();

    return NextResponse.json(
      {
        success: true,
        recruiters: topRecruiters,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching top recruiters:", error);
    return NextResponse.json(
      { error: "Failed to fetch top recruiters" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}