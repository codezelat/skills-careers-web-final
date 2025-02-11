import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const client = await connectToDatabase();
    const db = client.db();

    // Fetch all jobseekers
    const users = await db.collection("users").find().toArray();

    const count = users.length;

    client.close();

    return NextResponse.json(
      { users, count },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
