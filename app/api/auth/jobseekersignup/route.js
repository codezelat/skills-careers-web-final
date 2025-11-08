import { hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    console.log("Received signup data:", {
      ...data,
      password: "***",
      confirmPassword: "***",
    });

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

    const normalizedFirstName = (firstName || "").trim();
    const normalizedLastName = (lastName || "").trim();
    const normalizedEmail = (email || "").trim();
    const normalizedContactNumber = (contactNumber || "").trim();

    // Allow alphabetic names with common separators such as spaces, apostrophes, and hyphens.
    const nameRegex = /^[A-Za-z][A-Za-z\s'-]*$/;
    if (!normalizedFirstName || !nameRegex.test(normalizedFirstName)) {
      return NextResponse.json(
        {
          message:
            "First name may contain letters, spaces, apostrophes, and hyphens only.",
        },
        { status: 422 }
      );
    }

    if (!normalizedLastName || !nameRegex.test(normalizedLastName)) {
      return NextResponse.json(
        {
          message:
            "Last name may contain letters, spaces, apostrophes, and hyphens only.",
        },
        { status: 422 }
      );
    }

    // RFC compliant email validation is complex; this regex mirrors common web validation and allows aliases.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { message: "Invalid email format." },
        { status: 422 }
      );
    }

    // Validate contact number (only 10 digits)
    if (!/^\d{10}$/.test(normalizedContactNumber)) {
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
        { message: "Password does not match." },
        { status: 422 }
      );
    }

    console.log("Attempting to connect to database...");
    const client = await connectToDatabase();
    const db = client.db();
    console.log("Database connected successfully");

    const existingUser = await db
      .collection("users")
      .findOne({ email: normalizedEmail });
    const existingJobseeker = await db
      .collection("jobseekers")
      .findOne({ email: normalizedEmail });

    if (existingUser) {
      client.close();
      return NextResponse.json(
        { message: "User exists already!" },
        { status: 422 }
      );
    }

    if (existingJobseeker) {
      client.close();
      return NextResponse.json(
        { message: "User exists already!" },
        { status: 422 }
      );
    }

    console.log("Hashing password...");
    const hashedPassword = await hashPassword(password);
    console.log("Password hashed successfully");

    try {
      console.log("Creating user...");
      const userResult = await db.collection("users").insertOne({
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        email: normalizedEmail,
        password: hashedPassword,
        profileImage,
        role,
        createdAt: new Date(),
      });
      console.log("User created with ID:", userResult.insertedId);

      console.log("Creating jobseeker...");
      const jobseekerResult = await db.collection("jobseekers").insertOne({
        email: normalizedEmail,
        contactNumber: normalizedContactNumber,
        userId: new ObjectId(userResult.insertedId),
        createdAt: new Date(),
      });
      console.log("Jobseeker created with ID:", jobseekerResult.insertedId);

      client.close();
      console.log("User & Jobseeker created successfully");
      return NextResponse.json(
        { message: "User & Jobseeker created!" },
        { status: 201 }
      );
    } catch (insertError) {
      console.error("Insert error:", insertError);
      // If user was created but jobseeker failed, try to clean up
      if (insertError.message && insertError.message.includes("jobseeker")) {
        try {
          await db.collection("users").deleteOne({ email: normalizedEmail });
          console.log("Cleaned up user record after jobseeker insert failure");
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
      }
      client.close();
      throw insertError;
    }
  } catch (error) {
    console.error("Error in jobseeker signup:", error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
