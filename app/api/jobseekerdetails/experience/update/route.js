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

    // Get the existing experience to preserve the recruiterId
    const existingExperience = await db
      .collection("experiences")
      .findOne({ _id: new ObjectId(_id) });

    if (!existingExperience) {
      return NextResponse.json({ message: "Experience not found." }, { status: 404 });
    }

    // Keep the existing recruiterId and add new fields
    const updateData = {
      ...updateFields,
      jobseekerId: existingExperience.jobseekerId,
      createdAt: existingExperience.createdAt,
    };

    const result = await db
      .collection("experiences")
      .updateOne({ _id: new ObjectId(_id) }, { $set: updateData });

    if (result.modifiedCount > 0) {
      return NextResponse.json(
        { message: "Details updated successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No changes were made." },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
