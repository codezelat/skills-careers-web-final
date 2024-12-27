import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const client = await connectToDatabase();
    const db = client.db();

    // Fetch all job aplications
    const jobapplications = await db.collection("jobapplication").find().toArray();
    const count = jobapplications.length;
    client.close();

    return NextResponse.json(
      { jobapplications, count },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
