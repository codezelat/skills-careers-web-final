import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const data = await req.json();

    const {
      userId,
      userName,
      userRole,
      inquiryTitle,
      inquiryDescription,
      status = "Pending",
      reply = "",
    } = data;

    // Validate required fields
    if (
      //  !userId ||
      // !userName ||
        !userRole ||
      !inquiryTitle ||
      !inquiryDescription
    ) {
      return NextResponse.json({ message: "Invalid input." }, { status: 422 });
    }

    // Connect to database
    const client = await connectToDatabase();
    const db = client.db();

    // Insert Jobs into the database
    const result = await db.collection("inquiries").insertOne({
      userId: new ObjectId(userId),
      userName,
      userRole,
      inquiryTitle,
      inquiryDescription,
      status,
      createdAt: new Date(),
      reply,    
    });

    // Close the database connection
    client.close();
    return NextResponse.json({ message: "Inquiry created!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
