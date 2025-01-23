import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) { 
  try {
    const client = await connectToDatabase();
    const db = client.db();

    // Fetch all appointments
    const pressreleases = await db.collection("pressreleases").find().toArray();
    client.close();

    return NextResponse.json(
      { pressreleases },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
