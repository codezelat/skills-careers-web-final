import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();
  const { email } = data;

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { Message: "Enter a valid email" },
      { status: 402 }
    );
  }

  const client = await connectToDatabase();
  const db = client.db();

  const existingUser = await db.collection("newsletter").findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "You have already signuped!!!" },
      { status: 422 }
    );
  }

  const result = await db
    .collection("newsletter")
    .insertOne({ email, createdAt: new Date() });

  if (result.insertedId) {
    await db
      .collection("newsletter")
      .updateOne(
        { _id: result.insertedId },
        { $set: { newsletterId: new ObjectId(result.insertedId) } }
      );
  }

  return NextResponse.json(
    { message: "Successfully joined newsletter" },
    { status: 201 }
  );
}
