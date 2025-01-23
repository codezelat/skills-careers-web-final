import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const client = await connectToDatabase();
    const db = client.db();

    let filter = {};

    // Add ID filter if provided
    if (id) {
      filter.userId = new ObjectId(id);
    }

    // Fetch all inquiries
    const inquiries = await db.collection("inquiries").find(filter).toArray();
    
    client.close();

    return NextResponse.json({ inquiries }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
