// app/api/auth/jobseekersignup/route.js
import { hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
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
    } = data;

    if (
      !firstName ||
      !lastName ||
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
        { message: "Password does not match" },
        { status: 422 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db();

    const existingUser = await db.collection("jobseekers").findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User exists already!" },
        { status: 422 }
      );
    } 

    const hashedPassword = await hashPassword(password);
    const result = await db.collection("jobseekers").insertOne({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      profileImage,
      createdAt: new Date(),
    });
    
    client.close();

    return NextResponse.json({ message: "User created!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
