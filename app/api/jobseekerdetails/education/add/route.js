import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const { jobseekerId, educationName, location, startDate, endDate } = data;

    if (!jobseekerId || !educationName) {
      return NextResponse.json({ message: "Invalid input." }, { status: 422 });
    }

    const client = await connectToDatabase();
    const db = client.db();

    const result = await db.collection("educations").insertOne({
      jobseekerId: new ObjectId(jobseekerId),
      educationName,
      location,
      startDate,
      endDate,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Education Added!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
