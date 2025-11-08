import { hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  let client;

  try {
    const data = await req.json();
    const {
      firstName,
      lastName,
      contactNumber,
      email,
      password,
      confirmPassword,
      profileImage = "",
    } = data;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !contactNumber ||
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7 ||
      !confirmPassword ||
      confirmPassword.trim().length < 7
    ) {
      return NextResponse.json({ message: "Invalid input." }, { status: 422 });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Password does not match" },
        { status: 422 }
      );
    }

    // Connect to database
    client = await connectToDatabase();
    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User exists already!" },
        { status: 422 }
      );
    }

    // Check if user already exists
    const existingAdmin = await db.collection("admins").findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin exists already!" },
        { status: 422 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user first
    const userResult = await db.collection("users").insertOne({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImage,
      role: "admin",
      createdAt: new Date(),
    });

    // Create admin with the userId
    await db.collection("admins").insertOne({
      firstName,
      lastName,
      contactNumber,
      email,
      password: hashedPassword,
      profileImage,
      userId: new ObjectId(userResult.insertedId),
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Admin created!" }, { status: 201 });
  } catch (error) {
    console.error("Admin signup error:", error);
    return NextResponse.json(
      {
        message: "Something went wrong.",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (e) {
        console.error("Error closing client:", e);
      }
    }
  }
}
