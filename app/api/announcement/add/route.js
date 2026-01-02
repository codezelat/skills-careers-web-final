import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();

    const { announcementTitle, announcementDescription } = data;

    // Validate required fields
    if (!announcementTitle || !announcementDescription) {
      return NextResponse.json({ message: "Invalid input." }, { status: 422 });
    }

    // Connect to database
    const client = await connectToDatabase();
    const db = client.db();

    // Insert Jobs into the database
    const result = await db.collection("announcements").insertOne({
      announcementTitle,
      announcementDescription,
      createdAt: new Date(), // Save current date and time
    });

    // Close the database connection
    return NextResponse.json(
      { message: "Announcement created!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
