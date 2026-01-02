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

    // Create the base query
    let query = db.collection("tickets").find(filter);

    // Sort by createdAt in descending order (newest first)
    query = query.sort({ createdAt: -1 });

    // Execute the query
    const tickets = await query.toArray();
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
