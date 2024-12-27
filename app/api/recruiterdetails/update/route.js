import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const body = await req.json();

    const { _id, recruiterId, email, createdAt, ...updatedDetails } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Invalid email provided." },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db();

    const result = await db
      .collection("recruiters")
      .updateOne({ email }, { $set: updatedDetails }, { upsert: false });

    client.close();

    if (result.modifiedCount > 0) {
      return NextResponse.json(
        { message: "Details updated successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No changes were made." },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
