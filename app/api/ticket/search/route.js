// app/api/ticket/search/route.js
import { Client } from "@elastic/elasticsearch";
import { NextResponse } from "next/server";

// Create the client instance
const client = new Client({
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID,
  },
  auth: {
    apiKey: process.env.ELASTIC_API_KEY,
  },
});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    // For debugging - log the search query
    console.log("Search query:", query);

    if (!query || query.length < 2) {
      return NextResponse.json({ tickets: [] });
    }

    // Perform the search
    const result = await client.search({
      index: "tickets",
      body: {
        query: {
          bool: {
            should: [
              // Text search for text fields
              {
                multi_match: {
                  query: query,
                  fields: [
                    "name",
                    "location",
                    // "date" removed from here
                  ],
                  type: "phrase_prefix",
                },
              },
              // If you need to match dates, you could add something like this:
              // (only if the query looks like a date)
              // {
              //   range: {
              //     date: {
              //       gte: parsedDateFromQuery,
              //       lte: parsedDateFromQuery
              //     }
              //   }
              // }
            ],
          },
        },
      },
    });

    // Extract and format the results
    const tickets = result.hits.hits.map((hit) => ({
      ticketId: hit._source.ticketId,
      name: hit._source.name,
      description: hit._source.description,
      location: hit._source.location,
      date: hit._source.date,
      startTime: hit._source.startTime,
      endTime: hit._source.endTime,
      capacity: hit._source.capacity,
      closingDate: hit._source.closingDate,
      eventProfile: hit._source.eventProfile,
      createdAt: hit._source.createdAt,
    }));

    // For debugging - log the results
    console.log("Search results:", tickets);

    return NextResponse.json({ tickets });
  } catch (error) {
    console.log(error);
    console.error("Search error:", error);

    // Send a more detailed error response
    return NextResponse.json(
      {
        message: "Failed to search tickets",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
