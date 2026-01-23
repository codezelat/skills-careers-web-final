import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req) {
  let client;
  try {
    const body = await req.json();
    const { _id, email, createdAt, ...updatedDetails } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Invalid email provided." },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();

    // Ensure profileImage is preserved if it's not being updated
    const updateData = { ...updatedDetails };

    if (!updatedDetails.profileImage) {
      const existingUser = await db.collection("users").findOne({ email });
      if (existingUser?.profileImage) {
        updateData.profileImage = existingUser.profileImage;
      }
    }

    const result = await db
      .collection("users")
      .updateOne({ email }, { $set: updateData }, { upsert: false });

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
  } finally {
    if (client) {
    }
  }
}
