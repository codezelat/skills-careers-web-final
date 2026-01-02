import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PUT(req) {
  let client;

  try {
    const body = await req.json();
    const { _id, userId, createdAt, ...updatedDetails } = body;

    if (!_id) {
      return NextResponse.json({ message: "No ID provided." }, { status: 400 });
    }

    client = await connectToDatabase();
    const db = client.db();

    const existingInquiry = await db
      .collection("inquiries")
      .findOne({ _id: new ObjectId(_id) });

    if (!existingInquiry) {
      return NextResponse.json(
        { message: "Inquiry not found." },
        { status: 404 }
      );
    }

    const updatingDetails = {
      ...updatedDetails,
      repliedAt: new Date(), // Add the current timestamp
    };

    const result = await db
      .collection("inquiries")
      .updateOne(
        { _id: new ObjectId(_id) },
        { $set: updatingDetails },
        { upsert: false }
      );

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
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
    }
  }
}
