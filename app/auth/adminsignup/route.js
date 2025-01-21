import { hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
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
      role = "admin",
    } = data;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !contactNumber ||
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 8 ||
      !confirmPassword ||
      confirmPassword.trim().length < 8
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
    const client = await connectToDatabase();
    const db = client.db();

    // Check if user already exists
    const existingAdmin = await db.collection("users").findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin exists already!" },
        { status: 422 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user into the database
    const result = await db.collection("users").insertOne({
      firstName,
      lastName,
      contactNumber,
      email,
      password: hashedPassword,
      profileImage,
      role,
      createdAt: new Date(),
    });

    // Close the database connection
    client.close();

    return NextResponse.json({ message: "Admin created!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
