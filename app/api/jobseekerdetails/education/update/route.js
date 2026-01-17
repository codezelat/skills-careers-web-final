import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { _id, ...updateFields } = body;

    if (!_id) {
      return NextResponse.json({ message: "No ID provided." }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db();

    // Get the existing education to preserve the recruiterId
    const existingEducation = await db
      .collection("educations")
      .findOne({ _id: new ObjectId(_id) });

    if (!existingEducation) {
      return NextResponse.json(
        { message: "Education not found." },
        { status: 404 },
      );
    }

    // Validate dates
    if (updateFields.startDate && updateFields.endDate) {
      const start = new Date(updateFields.startDate);
      const end = new Date(updateFields.endDate);

      if (end < start) {
        return NextResponse.json(
          { message: "End date cannot be before start date." },
          { status: 400 },
        );
      }
    }

    // Keep the existing recruiterId and add new fields
    const updateData = {
      ...updateFields,
      jobseekerId: existingEducation.jobseekerId,
      createdAt: existingEducation.createdAt,
    };

    const result = await db
      .collection("educations")
      .updateOne({ _id: new ObjectId(_id) }, { $set: updateData });

    if (result.modifiedCount > 0) {
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
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 },
    );
  }
}
