import { hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      password,
      confirmPassword,
      profileImage = "",
      role = "jobseeker",
    } = data;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !email.includes("@") ||
      !contactNumber ||
      !password ||
      password.trim().length < 8 ||
      !confirmPassword ||
      confirmPassword.trim().length < 8
    ) {
      return NextResponse.json({ message: "Invalid input." }, { status: 422 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Password does not match." },
        { status: 422 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 422 }
      );
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { message: "Password must include at least one uppercase letter." },
        { status: 422 }
      );
    }

    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { message: "Password must include at least one lowercase letter." },
        { status: 422 }
      );
    }

    if (!/\d/.test(password)) {
      return NextResponse.json(
        { message: "Password must include at least one number." },
        { status: 422 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email });
    const existingJobseeker = await db
      .collection("jobseekers")
      .findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User exists already!" },
        { status: 422 }
      );
    }

    if (existingJobseeker) {
      return NextResponse.json(
        { message: "User exists already!" },
        { status: 422 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        const userResult = await db.collection("users").insertOne(
          {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profileImage,
            role,
            createdAt: new Date(),
          },
          { session }
        );

        const jobseekerResult = await db.collection("jobseekers").insertOne(
          {
            email,
            contactNumber,
            userId: new ObjectId(userResult.insertedId),
            createdAt: new Date(),
          },
          { session }
        );
      });

      await session.endSession();
      client.close();
      return NextResponse.json(
        { message: "User & Jobseeker created!" },
        { status: 201 }
      );
    } catch (transactionError) {
      await session.endSession();
      client.close();
      throw transactionError;
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
