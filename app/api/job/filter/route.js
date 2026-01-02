import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const jobCategory = searchParams.get("jobCategory");
    const jobExperience = searchParams.get("jobExperience");

    // Build filter query
    const filterQuery = {};
    if (jobCategory) {
      filterQuery.jobCategory = jobCategory;
    }
    if (jobExperience) {
      filterQuery.jobExperience = jobExperience;
    }

    // If no filters provided, return error
    if (!jobCategory && !jobExperience) {
      return NextResponse.json(
        { message: "No filter criteria provided" },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();
    const jobs = await db
      .collection("jobs")
      .find(filterQuery)
      .toArray();

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ 
        message: "No jobs found matching the criteria",
        jobs: [] 
      }, { status: 200 });
    }

    return NextResponse.json({ jobs });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch jobs", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
    }
  }
}