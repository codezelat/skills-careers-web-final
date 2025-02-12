import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Validate userId format
    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid User ID format" },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();

    // Fetch all inquiries for the given userId
    const inquiries = await db
      .collection("inquiries")
      .find({ userId: new ObjectId(userId) })
      .toArray();

    if (!inquiries || inquiries.length === 0) {
      return NextResponse.json(
        { message: "No inquiries found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("Inquiry fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch inquiries", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}