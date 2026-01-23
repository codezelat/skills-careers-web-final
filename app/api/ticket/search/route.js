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
      return NextResponse.json({ tickets: [] });
    }

    // Connect to database
    client = await connectToDatabase();
    const db = client.db();

    // Create regex for case-insensitive partial match
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(escapedQuery, "i");

    // Perform the search using MongoDB
    const tickets = await db
      .collection("tickets")
      .find({
        isPublished: true,
        $or: [
          { name: { $regex: searchRegex } },
          { location: { $regex: searchRegex } },
        ],
      })
      .toArray();

    // Transform _id to ticketId to match previous format
    const formattedTickets = tickets.map((ticket) => ({
      ...ticket,
      ticketId: ticket._id.toString(),
      _id: undefined,
    }));

    // For debugging - log the results
    console.log(`Found ${formattedTickets.length} tickets matching "${query}"`);

    return NextResponse.json({ tickets: formattedTickets });
  } catch (error) {
    console.error("Search error:", error);

    return NextResponse.json(
      {
        message: "Failed to search tickets",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (client) {
    }
  }
}
