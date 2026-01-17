import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  let client;
  try {
    // Check for empty request body
    if (!req.body) {
      return NextResponse.json(
        { message: "Request body is empty" },
        { status: 400 }
      );
    }

    const data = await req.json();

    // Validate required fields
    const requiredFields = [
      "jobTitle",
      "recruiterId",
      "location",
      "jobTypes",
      "jobDescription",
      "keyResponsibilities",
      "shortDescription",
      "requiredQualifications",
      "perksAndBenefits",
    ];

    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: "Missing required fields",
          missing: missingFields,
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

    client = await connectToDatabase();
    const db = client.db();

    // Verify recruiter exists and is not restricted
    const recruiter = await db.collection("recruiters").findOne({
      _id: new ObjectId(data.recruiterId),
    });

    if (!recruiter) {
      return NextResponse.json(
        { message: "Recruiter not found" },
        { status: 404 }
      );
    }

    if (recruiter.isRestricted === true) {
      return NextResponse.json(
        {
          message:
            "Your account has been restricted. You cannot post jobs at this time. Please contact support.",
        },
        { status: 403 }
      );
    }

    // Insert job with proper data formatting
    const result = await db.collection("jobs").insertOne({
      ...data,
      recruiterId: new ObjectId(data.recruiterId),
      createdAt: new Date(),
      postedDate: new Date(),
      isPublished: false,
    });

    return NextResponse.json(
      {
        message: "Job created successfully",
        jobId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    // Ensure database connection is closed
    if (client) {
    }
  }
}
