import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const jobseekerId = searchParams.get("jobseekerId");
    const ticketId = searchParams.get("ticketId");

    const client = await connectToDatabase();
    const db = client.db();
    let filter = {};

    // Add recruiter filter if provided
    if (jobseekerId) {
      filter.jobseekerId = new ObjectId(jobseekerId);
    }

    if (ticketId) {
      filter.ticketId = new ObjectId(ticketId);
    }

    // Create the base query
    let query = db.collection("ticketenrollments").find(filter);

    // Sort by createdAt in descending order (newest first)
    query = query.sort({ createdAt: -1 });

    // Execute the query
    const ticketenrollments = await query.toArray();
    const count = ticketenrollments.length;

    client.close();
    return NextResponse.json(
      { ticketenrollments, count },
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
