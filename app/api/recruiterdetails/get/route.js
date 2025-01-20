import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Add this import

export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const _id = searchParams.get("id");

    // Validate ID format
    let query = {};
    if (_id && ObjectId.isValid(_id)) {
      query._id = new ObjectId(_id);
    } else if (userId && ObjectId.isValid(userId)) {
      query.userId = new ObjectId(userId);
    } else {
      return NextResponse.json(
        { message: "Invalid or missing ID format" },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();

    const recruiter = await db
      .collection("recruiters")
      .findOne(query);

    if (!recruiter) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: recruiter._id.toString(),
      recruiterName: recruiter.recruiterName,
      email: recruiter.email,
      employeeRange: recruiter.employeeRange,
      contactNumber: recruiter.contactNumber,
      userId: recruiter.userId.toString(),
      createdAt: recruiter.createdAt,
      logo: recruiter.logo
      // website: recruiter.website,
      // companyDescription: recruiter.companyDescription,
      // industry: recruiter.industry,
      // location: recruiter.location,
      // logo: recruiter.logo,
      // facebook: recruiter.facebook,
      // instagram: recruiter.instagram,
      // linkedin: recruiter.linkedin,
      // x: recruiter.x,
    });
  } catch (error) {
    console.error("Recruiter fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch Recruiter details", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
