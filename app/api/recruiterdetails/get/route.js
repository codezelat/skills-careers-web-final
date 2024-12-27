import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Add this import

export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Validate ID format
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid job ID format" },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();

    const recruiter = await db
      .collection("recruiters")
      .findOne({ _id: new ObjectId(id) });

    if (!recruiter) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: recruiter._id.toString(),
      recruiterName: recruiter.recruiterName,
      employeeRange: recruiter.employeeRange,
      email: recruiter.email,
      contactNumber: recruiter.contactNumber,
      website: recruiter.website,
      companyDescription: recruiter.companyDescription,
      industry: recruiter.industry,
      location: recruiter.location,
      logo: recruiter.logo,
      facebook: recruiter.facebook,
      instagram: recruiter.instagram,
      linkedin: recruiter.linkedin,
      x: recruiter.x,
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
