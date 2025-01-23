import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) { 
  try {
    const client = await connectToDatabase();
    const db = client.db();

    // Fetch all appointments
    const announcements = await db.collection("announcements").find().toArray();
    const count = announcements.length;
    client.close();

    return NextResponse.json(
      { announcements, count },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
