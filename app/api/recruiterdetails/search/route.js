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
    console.log("Elasticsearch config:", {
      ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
      username: process.env.ELASTIC_USERNAME,
    });

    if (!query || query.length < 3) {
      return NextResponse.json({ recruiters: [] });
    }

    // Perform the search
    const result = await client.search({
      index: "recruiters",
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ["recruiterName", "email^2"], // Boost email matches
            type: "phrase_prefix",
          },
        },
      },
    });

    // Extract and format the results
    const recruiters = result.hits.hits.map((hit) => ({
      recruiterName: hit._source.recruiterName,
      email: hit._source.email,
    }));

    // For debugging - log the results
    console.log("Search results:", recruiters);

    return NextResponse.json({ recruiters });
  } catch (error) {
    console.error("Search error:", error);

    // Send a more detailed error response
    return NextResponse.json(
      {
        message: "Failed to search recruiters",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
