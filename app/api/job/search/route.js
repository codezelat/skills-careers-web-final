// app/api/job/search/route.js
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
                  fields: [
                    "jobTitle",
                    "location",
                    "jobCategory",
                    "jobExperience",
                  ],
                  type: "phrase_prefix",
                },
              },
            ],
          },
        },
      },
    });

    // Extract and format the results
    const jobs = result.hits.hits.map((hit) => ({
      jobId: hit._source.jobId,
      jobTitle: hit._source.jobTitle,
      recruiterId: hit._source.recruiterId,
      location: hit._source.location,
      jobCategory: hit._source.jobCategory,
      jobExperience: hit._source.jobExperience,
      createdAt: hit._source.createdAt,
      jobTypes: hit._source.jobTypes,
      shortDescription: hit._source.shortDescription,
    }));

    // For debugging - log the results
    console.log("Search results:", jobs);

    return NextResponse.json({ jobs });
  } catch (error) {
    console.log(error);
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
