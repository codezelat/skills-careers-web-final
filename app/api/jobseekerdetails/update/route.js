import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { _id, jobseekerId, email, createdAt, userId, ...updatedDetails } =
      body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Invalid email provided." },
        { status: 400 },
      );
    }

    // Validate date of birth - cannot be in the future
    if (updatedDetails.dob) {
      const dob = new Date(updatedDetails.dob);
      if (Number.isNaN(dob.getTime())) {
        return NextResponse.json(
          { message: "Date of birth must be a valid date." },
          { status: 400 },
        );
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

      if (dob > today) {
        return NextResponse.json(
          { message: "Date of birth cannot be in the future." },
          { status: 400 },
        );
      }
    }

    const client = await connectToDatabase();
    const db = client.db();

    // Ensure profileImage is preserved if it's not being updated
    let updateData = updatedDetails;

    // If userId is provided, ensure it's stored as ObjectId
    if (userId) {
      if (ObjectId.isValid(userId)) {
        updateData.userId = new ObjectId(userId);
      }
    }

    if (!updatedDetails.profileImage) {
      const existingUser = await db.collection("jobseekers").findOne({ email });
      if (existingUser?.profileImage) {
        updateData.profileImage = existingUser.profileImage;
      }
    }

    const result = await db
      .collection("jobseekers")
      .updateOne({ email }, { $set: updateData }, { upsert: true });

    console.log("Update result:", result, "Data sent to DB:", updateData); // Debug log

    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      return NextResponse.json(
        { message: "Details updated successfully." },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: "No changes were made." },
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 },
    );
  }
}
