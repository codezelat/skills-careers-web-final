// app/api/applications/route.js
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const client = await connectToDatabase();

  try {
    // Get query parameters from URL
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const recruiterId = searchParams.get("recruiterId");

    if (!jobId || !recruiterId) {
      return NextResponse.json(
        { error: "JobId and recruiterId are required" },
        { status: 400 }
      ); 
    }

    const db = client.db();
    const jobApplications = await db.collection("jobapplication")
      .find({
        jobId: new ObjectId(jobId),
        recruiterId: new ObjectId(recruiterId)
      })
      .toArray();

    const applicationCount = jobApplications.length;

    return NextResponse.json({
      success: true,
      applications: jobApplications,
      count: applicationCount
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}