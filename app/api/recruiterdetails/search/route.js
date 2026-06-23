import { connectToDatabase } from "@/lib/db";
import { escapeRegex } from "@/lib/escapeRegex";
import { NextResponse } from "next/server";

export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query || query.length < 2) {
      return NextResponse.json({ recruiters: [] });
    }

    // Connect to database
    client = await connectToDatabase();
    const db = client.db();

    // Create regex for case-insensitive partial match
    const searchRegex = new RegExp(escapeRegex(query), "i");

    // Perform the search using MongoDB, excluding restricted recruiters
    const recruiters = await db
      .collection("recruiters")
      .find({
        isRestricted: { $ne: true },
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

    return NextResponse.json(
      { recruiters },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15",
        },
      }
    );
  } catch (error) {
    console.error("Recruiter search error:", error);

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
