import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, jobId, createdAt, ...updatedDetails } = body; 
    
    if (!id) {
      return NextResponse.json({ message: "No ID provided." }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db();

    // Get the existing job to preserve the recruiterId
    const existingJob = await db.collection("jobs").findOne({ _id: new ObjectId(id) });
    if (!existingJob) {
      return NextResponse.json({ message: "Job not found." }, { status: 404 });
    }

    // Keep the existing recruiterId
    const updateData = {
      ...updatedDetails,
      recruiterId: existingJob.recruiterId // Preserve the original recruiterId
    };

    const result = await db
      .collection("jobs")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { upsert: false }
      );

    if (result.modifiedCount > 0) {
      return NextResponse.json({ message: "Details updated successfully." }, { status: 200 });
    } else {
      return NextResponse.json({ message: "No changes were made." }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}