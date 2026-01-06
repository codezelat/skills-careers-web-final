import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    // For debugging - log the search query
    console.log("Search query:", query);

    if (!query || query.length < 2) {
      return NextResponse.json({ jobs: [] });
    }

    // Connect to database
    client = await connectToDatabase();
    const db = client.db();

    // Create regex for case-insensitive partial match
    const searchRegex = new RegExp(query, "i");

    // Perform the search using MongoDB
    const jobs = await db
      .collection("jobs")
      .find({
        isPublished: true,
        $or: [
          { jobTitle: { $regex: searchRegex } },
          { location: { $regex: searchRegex } },
          { jobCategory: { $regex: searchRegex } },
          { jobExperience: { $regex: searchRegex } },
        ],
      })
      .toArray();



    // Transform _id to string to match previous format if necessary, 
    // although client component might handle _id. 
    // The previous implementation mapped _id to jobId.
    const formattedJobs = jobs.map((job) => ({
      ...job,
      jobId: job._id.toString(),
      _id: undefined, // Remove original _id to avoid confusion if jobId is used
    }));

    // For debugging - log the results
    console.log(`Found ${formattedJobs.length} jobs matching "${query}"`);

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

