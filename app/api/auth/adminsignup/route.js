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
    const client = await connectToDatabase();
    const db = client.db();

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

    // Insert user into the database
    const result = await db.collection("admins").insertOne({
      firstName,
      lastName,
      contactNumber,
      email,
      password: hashedPassword,
      profileImage,
      createdAt: new Date(),
    });

    if (result.insertedId) {
      await db
        .collection("admins")
        .updateOne(
          { _id: result.insertedId },
          { $set: { adminId: new ObjectId(result.insertedId) } }
        );
    }

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
