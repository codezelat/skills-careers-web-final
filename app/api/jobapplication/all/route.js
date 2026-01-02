import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const recruiterId = searchParams.get("recruiterId");

    const client = await connectToDatabase();
    const db = client.db();

    // Fetch all job aplications
    const jobapplications = await db
      .collection("jobapplication")
      .find({
        recruiterId: new ObjectId(recruiterId),
      })
      .toArray();

    const count = jobapplications.length;
    // Don't close the connection - it's cached and reused

    return NextResponse.json({ jobapplications, count }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
