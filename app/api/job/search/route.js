import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query || query.length < 2) {
      return NextResponse.json({ jobs: [] });
    }

    // Connect to database
    client = await connectToDatabase();
    const db = client.db();

    // Create regex for case-insensitive partial match
    const searchRegex = new RegExp(query, "i");

    // First search for matching recruiters
    const matchingRecruiters = await db
      .collection("recruiters")
      .find({
        recruiterName: { $regex: searchRegex },
      })
      .project({ _id: 1 })
      .toArray();

    // Keep as ObjectIds for querying the jobs collection if recruiterId is stored as ObjectId
    const recruiterIds = matchingRecruiters.map((r) => r._id);

    // Build the search query
    const searchConditions = [
      { jobTitle: { $regex: searchRegex } },
      { location: { $regex: searchRegex } },
      { jobCategory: { $regex: searchRegex } },
      { jobExperience: { $regex: searchRegex } },
    ];

    if (recruiterIds.length > 0) {
      searchConditions.push({ recruiterId: { $in: recruiterIds } });
    }

    // Perform the search using MongoDB
    const jobs = await db
      .collection("jobs")
      .find({
        isPublished: true,
        $or: searchConditions,
      })
      .toArray();

    // Transform _id to string to match previous format if necessary,
    // although client component might handle _id.
    // The previous implementation mapped _id to jobId.
    const formattedJobs = jobs.map((job) => ({
      ...job,
      _id: job._id.toString(), // Keep _id as string
      jobId: job._id.toString(),
    }));

    return NextResponse.json({ jobs: formattedJobs });
  } catch (error) {
    console.error("Search error:", error);

    return NextResponse.json(
      {
        message: "Failed to search jobs",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (client) {
    }
  }
}
