import { connectToDatabase } from "@/lib/db";
import { escapeRegex } from "@/lib/escapeRegex";
import { NextResponse } from "next/server";

export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    // For debugging - log the search query
    console.log("Search query:", query);

    if (!query || query.length < 3) {
      return NextResponse.json({ recruiters: [] });
    }

    // Connect to database
    client = await connectToDatabase();
    const db = client.db();

    // Create regex for case-insensitive partial match
    const searchRegex = new RegExp(escapeRegex(query), "i");

    // Perform the search using MongoDB
    // Search by name, email, location, district, province, or country
    const recruiters = await db
      .collection("recruiters")
      .find({
        $or: [
          { recruiterName: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          { location: { $regex: searchRegex } },
          { district: { $regex: searchRegex } },
          { province: { $regex: searchRegex } },
          { country: { $regex: searchRegex } },
          { category: { $regex: searchRegex } },
        ],
      })
      .toArray();

    // No specific transform was needed in original code other than _source spread,
    // but here we just return the docs directly.
    // If client needs specific fields we can map them, but Mongo returns full doc by default.

    // For debugging - log the results
    console.log(`Found ${recruiters.length} recruiters matching "${query}"`);

    return NextResponse.json({ recruiters });
  } catch (error) {
    console.error("Search error:", error);

    return NextResponse.json(
      {
        message: "Failed to search recruiters",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (client) {
    }
  }
}
