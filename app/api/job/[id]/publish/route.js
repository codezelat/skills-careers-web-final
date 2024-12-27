// app/api/jobs/[id]/publish/route.js - Publish/Unpublish endpoint
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const jobId = params.id;
    const data = await req.json();
    const { isPublished } = data;

    if (!ObjectId.isValid(jobId)) {
      return NextResponse.json(
        { message: "Invalid job ID" },
        { status: 400 }
      );
    }

    if (typeof isPublished !== "boolean") {
      return NextResponse.json(
        { message: "isPublished must be a boolean" },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await connectToDatabase();
    const db = client.db();

    const result = await db.collection("jobs").updateOne(
      { _id: new ObjectId(jobId) },
      { $set: { isPublished: isPublished } }
    );

    // Close the database connection
    client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: `Job ${isPublished ? "published" : "unpublished"} successfully` 
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}