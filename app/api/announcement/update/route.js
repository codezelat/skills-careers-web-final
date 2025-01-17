import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PUT(req) {
  let client;

  try {
    const body = await req.json();
    const { _id, createdAt, ...updatedDetails } = body;

    if (!_id) {
      return NextResponse.json({ message: "No ID provided." }, { status: 400 });
    }

    client = await connectToDatabase();
    const db = client.db();

    const existingAnnouncement = await db
      .collection("announcements")
      .findOne({ _id: new ObjectId(_id) });

    if (!existingAnnouncement) {
      return NextResponse.json(
        { message: "Announcement not found." },
        { status: 404 }
      );
    }

    const result = await db
      .collection("announcements")
      .updateOne(
        { _id: new ObjectId(_id) },
        { $set: updatedDetails },
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
      client.close();
    }
  }
}
