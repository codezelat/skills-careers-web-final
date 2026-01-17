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

    // Validate dates
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        return NextResponse.json(
          { message: "End date cannot be before start date." },
          { status: 400 }
        );
      }
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
