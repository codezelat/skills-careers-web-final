import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Verify request has body
    if (!req.body) {
      return NextResponse.json(
        { message: "Request body is empty" },
        { status: 400 }
      );
    }

    const data = await req.json();

    // Validate required fields
    const requiredFields = [
      'jobTitle',
      'recruiterId',
      'location',
      'jobTypes',
      'jobDescription',
      'keyResponsibilities'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          message: "Missing required fields",
          missing: missingFields 
        },
        { status: 422 }
      );
    }

    // Validate ObjectID format
    if (!ObjectId.isValid(data.recruiterId)) {
      return NextResponse.json(
        { message: "Invalid recruiter ID format" },
        { status: 422 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db();

    // Verify recruiter exists
    const recruiter = await db.collection("recruiters").findOne({
      _id: new ObjectId(data.recruiterId)
    });

    if (!recruiter) {
      await client.close();
      return NextResponse.json(
        { message: "Recruiter not found" },
        { status: 404 }
      );
    }

    // Insert job
    const result = await db.collection("jobs").insertOne({
      ...data,
      recruiterId: new ObjectId(data.recruiterId),
      createdAt: new Date(),
    });

    await client.close();
    
    return NextResponse.json(
      {
        message: "Job created successfully",
        jobId: result.insertedId
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message
      },
      { status: 500 }
    );
  }
}