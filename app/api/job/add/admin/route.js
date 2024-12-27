import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();

    const {
      jobTitle,
      recruiterName,
      recruiterEmail,
      location,
      jobTypes,
      jobDescription,
      keyResponsibilities,
    } = data;

    // Validate required fields
    if (
      !jobTitle ||
      !recruiterName ||
      !recruiterEmail ||
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

    let recruiter = await db
      .collection("recruiters")
      .findOne({ recruiterName, email: recruiterEmail });

    if (!recruiter) {
      return NextResponse.json({ message: "No Recrutier Found. Please check the name and email." }, { status: 422 });
    }

    // Insert Jobs into the database
    const result = await db.collection("jobs").insertOne({
      jobTitle,
      recruiterId: new ObjectId(recruiter._id),
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
