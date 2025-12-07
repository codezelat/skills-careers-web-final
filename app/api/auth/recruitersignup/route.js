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
      category,
      employeeRange,
      email,
      contactNumber,
      password,
      confirmPassword,
      profileImage = "",
      role = "recruiter",
    } = data;

    // Validate firstName, lastName, recruiterName (only letters)
    if (!/^[A-Za-z]+$/.test(firstName)) {
      return NextResponse.json(
        { message: "First name can only contain letters." },
        { status: 422 }
      );
    }

    if (!/^[A-Za-z]+$/.test(lastName)) {
      return NextResponse.json(
        { message: "Last name can only contain letters." },
        { status: 422 }
      );
    }

    // Validate email (should include "@" and only allow "." as a special character)
    if (!email || !email.includes("@") || /[^a-zA-Z0-9.@]/.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format." },
        { status: 422 }
      );
    }

    // Validate contact number (only 10 digits)
    if (!/^\d{10}$/.test(contactNumber)) {
      return NextResponse.json(
        { message: "Contact number must be 10 digits." },
        { status: 422 }
      );
    }

    // Validate password (at least one uppercase, lowercase, number, special character, and length at least 8)
    if (!password || password.length < 8) {
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

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return NextResponse.json(
        { message: "Password must include at least one special character." },
        { status: 422 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match." },
        { status: 422 }
      );
    }

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

    const hashedPassword = await hashPassword(password);

    try {
      const userResult = await db.collection("users").insertOne({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        profileImage,
        role,
        createdAt: new Date(),
      });

      const recruiterResult = await db.collection("recruiters").insertOne({
        recruiterName,
        category,
        email,
        employeeRange,
        contactNumber,
        userId: new ObjectId(userResult.insertedId),
        createdAt: new Date(),
      });

      client.close();
      return NextResponse.json(
        { message: "User and recruiter created!" },
        { status: 201 }
      );
    } catch (insertError) {
      // If user was created but recruiter failed, try to clean up
      if (insertError.message && insertError.message.includes("recruiter")) {
        try {
          await db.collection("users").deleteOne({ email });
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
      }
      client.close();
      throw insertError;
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
