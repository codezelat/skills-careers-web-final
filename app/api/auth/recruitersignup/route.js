import { hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      firstName ,
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

    if (!firstName) {
      return NextResponse.json({ message: "First name is required." }, { status: 422 });
    }
    if (!lastName) {
      return NextResponse.json({ message: "Last name is required." }, { status: 422 });
    }
    if (!recruiterName) {
      return NextResponse.json({ message: "Recruiter name is required." }, { status: 422 });
    }
    if (!employeeRange) {
      return NextResponse.json({ message: "Employee range is required." }, { status: 422 });
    }
    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 422 });
    }
    if (!email.includes("@")) {
      return NextResponse.json({ message: "Email is invalid." }, { status: 422 });
    }
    if (!contactNumber) {
      return NextResponse.json({ message: "Contact number is required." }, { status: 422 });
    }
    if (!password) {
      return NextResponse.json({ message: "Password is required." }, { status: 422 });
    }
    if (password.trim().length < 7) {
      return NextResponse.json({ message: "Password must be at least 7 characters long." }, { status: 422 });
    }
    if (!confirmPassword) {
      return NextResponse.json({ message: "Confirm password is required." }, { status: 422 });
    }
    if (confirmPassword.trim().length < 7) {
      return NextResponse.json({ message: "Confirm password must be at least 7 characters long." }, { status: 422 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match." }, { status: 422 });
    }
    
    // Continue with the rest of your logic here

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
