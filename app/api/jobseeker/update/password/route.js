import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { hashPassword, verifyPassword } from "@/lib/auth";

export async function PUT(req) {
  let client;
  try {
    const { userId, oldPassword, newPassword, confirmNewPassword } =
      await req.json();

    // Input validation
    if (!userId || !oldPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate password length
    if (newPassword.trim().length < 7) {
      return NextResponse.json(
        { message: "New password must be at least 7 characters long" },
        { status: 422 }
      );
    }

    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { message: "New passwords do not match" },
        { status: 422 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();

    const existingUser = await db
      .collection("jobseekers")
      .findOne({ _id: new ObjectId(userId) });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Verify old password
    const isValidPassword = await verifyPassword(
      oldPassword,
      existingUser.password
    );
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(confirmNewPassword);

    const updateData = {
      password: hashedNewPassword,
    };

    const result = await db
      .collection("jobseekers")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData },
        { upsert: false }
      );

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
    console.error("Password update error:", error);
    return NextResponse.json(
      { message: "Something went wrong - Backend.", error: error.message },
      { status: 500 }
    );
  }
}
