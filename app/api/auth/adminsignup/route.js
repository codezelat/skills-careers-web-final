import { hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  let client;
  let session;

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

    session = client.startSession();

    await session.withTransaction(async () => {
      const userResult = await db.collection("users").insertOne(
        {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          profileImage,
          role: "admin",
          createdAt: new Date(),
        },
        { session }
      );

      await db.collection("admins").insertOne(
        {
          firstName,
          lastName,
          contactNumber,
          email,
          password: hashedPassword,
          profileImage,
          userId: new ObjectId(userResult.insertedId),
          createdAt: new Date(),
        },
        { session }
      );
    });

    return NextResponse.json({ message: "Admin created!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (session) {
      await session.endSession();
    }
    if (client) {
      await client.close();
    }
  }
}
