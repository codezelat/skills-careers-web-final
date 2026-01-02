import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      jobseekerId,
      position,
      companyName,
      description,
      country,
      city,
      startDate,
      endDate,
    } = data;

    if (!jobseekerId || !position) {
      return NextResponse.json({ message: "Invalid input." }, { status: 422 });
    }

    const client = await connectToDatabase();
    const db = client.db();

    const result = await db.collection("experiences").insertOne({
      jobseekerId: new ObjectId(jobseekerId),
      position,
      companyName,
      description,
      country,
      city,
      startDate,
      endDate,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Experience Added!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
