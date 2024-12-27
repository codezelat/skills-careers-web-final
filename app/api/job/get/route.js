import { connectToDatabase } from "@/lib/db"; 
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Add this import

export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Validate ID format
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid job ID format" },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();

    const job = await db.collection("jobs").findOne({ _id: new ObjectId(id) });

    if (!job) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: job._id.toString(),
      jobTitle: job.jobTitle,
      recruiterId: job.recruiterId,
      location: job.location,
      jobTypes: job.jobTypes,
      jobDescription: job.jobDescription,
      keyResponsibilities: job.keyResponsibilities,
      createdAt: job.createdAt,
    });

  } catch (error) {
    console.error("Job fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch job details", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}