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
        { message: "Invalid Inquiry ID format" },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();

    const inquiry = await db 
      .collection("inquiries")
      .findOne({ _id: new ObjectId(id) });

    if (!inquiry) {
      return NextResponse.json(
        { message: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      inquiry,
    });
    
  } catch (error) {
    console.error("Inquiry fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch Inquiry details", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
