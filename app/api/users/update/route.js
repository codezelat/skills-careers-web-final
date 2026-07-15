import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req) {
  let client;
  try {
    const body = await req.json();
    const { _id, email, createdAt, role, ...updatedDetails } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Invalid email provided." },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();

    // Fetch existing user to determine role and preserve profileImage
    const existingUser = await db.collection("users").findOne({ email });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    const userRole = role || existingUser.role;

    // Ensure profileImage is preserved if it's not being updated
    let updateData = { ...updatedDetails };

    if (!updatedDetails.profileImage && existingUser?.profileImage) {
      updateData.profileImage = existingUser.profileImage;
    }

    // Update the users collection
    const result = await db
      .collection("users")
      .updateOne({ email }, { $set: updateData }, { upsert: false });

    // If the user is an admin and contactNumber is being updated,
    // also update the admins collection (where admin contactNumber is stored)
    if (userRole === "admin" && updatedDetails.contactNumber !== undefined) {
      await db
        .collection("admins")
        .updateOne(
          { email },
          { $set: { contactNumber: updatedDetails.contactNumber } },
          { upsert: false }
        );
    }

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
