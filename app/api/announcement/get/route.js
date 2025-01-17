import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Add this import

export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Validate ID format
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid Announcement ID format" },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();

    const announcement = await db 
      .collection("announcements")
      .findOne({ _id: new ObjectId(id) });

    if (!announcement) {
      return NextResponse.json(
        { message: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      announcement,
    });
    
  } catch (error) {
    console.error("Announcement fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch Announcement details", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
