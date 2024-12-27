import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    
    const {
      jobTitle,
      recruiterId,
      location,
      jobTypes,
      jobDescription,
      keyResponsibilities,
    } = data;

    // Validate required fields
    if (
      !jobTitle ||
      !recruiterId ||
      !jobTypes ||
      !location ||
      !jobDescription ||
      !keyResponsibilities
    ) {
      return NextResponse.json({ message: "Invalid input." }, { status: 422 });
    }

    // Connect to database
    const client = await connectToDatabase();
    const db = client.db();

    // Insert Jobs into the database
    const result = await db.collection("jobs").insertOne({
      jobTitle,
      recruiterId: new ObjectId(recruiterId),
      location,
      jobTypes,
      jobDescription,
      keyResponsibilities,
      createdAt: new Date(), // Save current date and time
    });

    if (result.insertedId) {
      await db
        .collection("jobs")
        .updateOne(
          { _id: result.insertedId },
          { $set: { jobId: new ObjectId(result.insertedId) } }
        );
    }

    // Close the database connection
    client.close();
    return NextResponse.json({ message: "Job created!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
