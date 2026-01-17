// app/api/jobs/[id]/route.js - Delete endpoint
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  let client;
  try {
    const { id: jobId } = await params;

    if (!ObjectId.isValid(jobId)) {
      return NextResponse.json({ message: "Invalid job ID" }, { status: 400 });
    }

    // Connect to database
    client = await connectToDatabase();
    const db = client.db();

    // First verify the job exists
    const job = await db.collection("jobs").findOne({
      _id: new ObjectId(jobId),
    });

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    // Mark all related job applications as deleted (soft delete)
    // This preserves application records while indicating the job is no longer available
    const applicationsResult = await db.collection("jobapplication").updateMany(
      { jobId: new ObjectId(jobId) },
      {
        $set: {
          jobDeleted: true,
          jobTitle: `${job.jobTitle || "Job"} (Deleted)`,
          updatedAt: new Date(),
        },
      }
    );

    // Delete the job
    const result = await db.collection("jobs").deleteOne({
      _id: new ObjectId(jobId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Job deletion failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Job deleted successfully",
        affectedApplications: applicationsResult.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Job deletion error:", error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      // Connection is managed by pool, don't close
    }
  }
}
