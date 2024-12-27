import { hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      recruiterName,
      employeeRange,
      email,
      contactNumber,
      password,
      confirmPassword,
      website = "", // Default empty
      companyDescription = "", // Default empty
      industry = "", // Default empty
      location = "",
      logo = "",
      facebook = "",
      instagram = "",
      linkedin = "",
      x = "",
    } = data;

    // Validate required fields
    if (
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
    const existingUser = await db.collection("recruiters").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User exists already!" },
        { status: 422 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user into the database
    const result = await db.collection("recruiters").insertOne({
      recruiterName,
      employeeRange,
      email,
      contactNumber,
      password: hashedPassword,
      website, // Add website field
      companyDescription, // Add company description field
      industry, // Add industry field
      location, // Add industry field
      logo,
      createdAt: new Date(), // Save current date and time
      facebook,
      instagram,
      linkedin,
      x
    });
    
    if (result.insertedId) {
      await db
        .collection("recruiters")
        .updateOne(
          { _id: result.insertedId },
          { $set: { recruiterId: new ObjectId(result.insertedId) } }
        );
    }

    // Close the database connection
    client.close();

    return NextResponse.json({ message: "User created!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
