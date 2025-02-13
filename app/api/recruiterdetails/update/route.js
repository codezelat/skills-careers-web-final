import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req) {
  let client;
  try {
    const body = await req.json();
    console.log("Request Body:", body); // Log the request body

    const { _id, recruiterId, userId, email, createdAt, ...updatedDetails } = body;

    // Validate the email field
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Invalid email provided." },
        { status: 400 }
      );
    }

    // Connect to the database
    client = await connectToDatabase();
    const db = client.db();

    // Update the recruiter details
    const result = await db
      .collection("recruiters")
      .updateOne({ email }, { $set: updatedDetails }, { upsert: false });

    console.log("Update Result:", result); // Log the update result

    if (result.modifiedCount > 0) {
      return NextResponse.json(
        { message: "Details updated successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No changes were made." },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Server Error:", error); // Log the error
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.close();
    }
  }
}import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req) {
  let client;
  try {
    const body = await req.json();
    console.log("Request Body:", body); // Log the request body

    const { _id, recruiterId, userId, email, createdAt, ...updatedDetails } = body;

    // Validate the email field
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Invalid email provided." },
        { status: 400 }
      );
    }

    // Connect to the database
    client = await connectToDatabase();
    const db = client.db();

    // Update the recruiter details
    const result = await db
      .collection("recruiters")
      .updateOne({ email }, { $set: updatedDetails }, { upsert: false });

    console.log("Update Result:", result); // Log the update result

    if (result.modifiedCount > 0) {
      return NextResponse.json(
        { message: "Details updated successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No changes were made." },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Server Error:", error); // Log the error
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.close();
    }
  }
}