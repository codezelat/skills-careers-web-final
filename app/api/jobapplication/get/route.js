import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const client = await connectToDatabase();

  try {
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("id"); 
    const jobId = searchParams.get("jobId"); 

    if (!_id && !jobId) {
      return NextResponse.json(
        { error: "Either _id or jobId is required" },
        { status: 400 }
      );
    }

    const db = client.db();

    if (_id) {
      const jobApplication = await db
        .collection("jobapplication")
        .findOne({ _id: new ObjectId(_id) });

      if (!jobApplication) {
        return NextResponse.json(
          { error: "Application not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          application: jobApplication,
        },
        { status: 200 }
      );
    } else if (jobId) {
      const jobApplications = await db
        .collection("jobapplication")
        .find({ jobId: new ObjectId(jobId) })
        .toArray();

      const applicationCount = jobApplications.length;

      return NextResponse.json(
        {
          success: true,
          applications: jobApplications,
          count: applicationCount,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching job application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}