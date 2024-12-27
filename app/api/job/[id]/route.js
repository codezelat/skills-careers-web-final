// app/api/jobs/[id]/route.js - Delete endpoint
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const jobId = params.id; 

    if (!ObjectId.isValid(jobId)) {
      return NextResponse.json(
        { message: "Invalid job ID" },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await connectToDatabase();
    const db = client.db();

    const result = await db.collection("jobs").deleteOne({
      _id: new ObjectId(jobId),
    });

    // Close the database connection
    client.close();

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Job deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}