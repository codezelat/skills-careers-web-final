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
      recruiterName,
      employeeRange,
      email,
      contactNumber,
      password,
      confirmPassword,
      profileImage = "",
      role = "recruiter",
    } = data;

    if (
      !firstName ||
      !lastName ||
      !recruiterName ||
      !employeeRange ||
      !email ||
      !email.includes("@") ||
      !contactNumber ||
      !password ||
      password.trim().length < 7 ||
      !confirmPassword ||
      confirmPassword.trim().length < 7
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

    // Connect to database
    const client = await connectToDatabase();
    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      client.close();
      return NextResponse.json(
        { message: "User exists already!" },
        { status: 422 }
      );
    }

    const existingRecruiter = await db
      .collection("recruiters")
      .findOne({ email });
    if (existingRecruiter) {
      client.close();
      return NextResponse.json(
        { message: "Recruiter exists already!" },
        { status: 422 }
      );
    }

    // Hash password
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

        const recruiterResult = await db.collection("recruiters").insertOne(
          {
            recruiterName,
            email,
            employeeRange,
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
        { message: "User and recruiter created!" },
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
