import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, firstName, lastName, role, profileImage, provider } =
      await req.json();

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    if (!["jobseeker", "recruiter"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'jobseeker' or 'recruiter'" },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      // User exists, just return their role
      return NextResponse.json({
        success: true,
        message: "User already exists",
        userId: existingUser._id,
        role: existingUser.role,
      });
    }

    // Create new user with specified role
    const newUser = {
      firstName: firstName || email.split("@")[0],
      lastName: lastName || "",
      email,
      role,
      profileImage: profileImage || null,
      createdAt: new Date(),
      isVerified: true, // OAuth users are pre-verified
      authProvider: provider,
    };

    const result = await db.collection("users").insertOne(newUser);

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      userId: result.insertedId,
      role,
    });
  } catch (error) {
    console.error("OAuth signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
