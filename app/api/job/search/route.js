// app/api/job/search/route.js
import { Client } from "@elastic/elasticsearch";
import { NextResponse } from "next/server";

// Create the client instance
const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ELASTIC_USERNAME || "elastic",
    password: process.env.ELASTIC_PASSWORD,
  },
});

export async function GET(req) {
  // Add at the start of the GET function
  try {
    await client.ping();
    console.log('Successfully connected to Elasticsearch');
  } catch (error) {
    console.error('Elasticsearch connection failed:', error);
    return NextResponse.json(
      { message: "Elasticsearch connection failed" },
      { status: 500 }
    );
  }
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    // For debugging - log the search query
    console.log("Search query:", query);
    console.log("Elasticsearch config:", {
      ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
      username: process.env.ELASTIC_USERNAME,
    });

    if (!query || query.length < 2) {
      return NextResponse.json({ jobs: [] });
    }

    // Perform the search 
    const result = await client.search({
      index: "jobs",
      body: {
        query: {
          bool: {
            should: [
              // Wildcard match for jobId
              // {
              //   wildcard: {
              //     jobId: `*${query}*`, // This will match the number anywhere in the phone number
              //   },
              // },
              // Regular text search for other fields
              {
                multi_match: {
                  query: query,
                  fields: ["jobTitle", "location", "recruiterId"],
                  type: "cross_fields",
                  operator: "or"
                },
              },
            ],
          },
        },
      },
    });

    console.log("Raw Elasticsearch response:", JSON.stringify(result, null, 2));

    // Extract and format the results
    const jobs = result.hits.hits.map((hit) => ({
      jobId: hit._source.jobId,
      jobTitle: hit._source.jobTitle,
      location: hit._source.location,
      recruiterId: hit._source.recruiterId,
    }));

    // For debugging - log the results
    console.log("Search results:", jobs);

    return NextResponse.json({ jobs });
  } catch (error) {
    console.log(error)
    console.error("Search error:", error);

    // Send a more detailed error response
    return NextResponse.json(
      {
        message: "Failed to search jobs",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
