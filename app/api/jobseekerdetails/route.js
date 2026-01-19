import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const client = await connectToDatabase();
    const db = client.db();

    // Fetch all jobseekers
    const jobseekers = await db.collection("jobseekers").find().toArray();

    // Ensure proper serialization
    const serializedJobseekers = jobseekers.map((jobseeker) => ({
      ...jobseeker,
      _id: jobseeker._id.toString(),
      userId: jobseeker.userId?.toString() || jobseeker.userId,
    }));

    const count = serializedJobseekers.length;

    return NextResponse.json(
      { jobseekers: serializedJobseekers, count },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { userId, email, firstName, lastName, profileImage } =
      await req.json();

    if (!userId || !email) {
      return NextResponse.json(
        { message: "userId and email are required" },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db();

    // Check if jobseeker profile already exists
    const existing = await db.collection("jobseekers").findOne({
      userId: new ObjectId(userId),
    });

    if (existing) {
      return NextResponse.json(
        { message: "Jobseeker profile already exists", jobseeker: existing },
        { status: 200 }
      );
    }

    // Create new jobseeker profile
    const jobseekerProfile = {
      userId: new ObjectId(userId),
      email,
      firstName: firstName || "",
      lastName: lastName || "",
      profileImage: profileImage || null,
      contactNumber: "",
      bio: "",
      city: "",
      country: "",
      dob: null,
      gender: "",
      skills: [],
      softSkills: [],
      expertise: [],
      socialMedia: {
        linkedin: "",
        github: "",
        twitter: "",
        facebook: "",
        instagram: "",
        website: "",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("jobseekers")
      .insertOne(jobseekerProfile);

    return NextResponse.json(
      {
        message: "Jobseeker profile created successfully",
        jobseeker: { ...jobseekerProfile, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create jobseeker profile error:", error);
    return NextResponse.json(
      { message: "Failed to create jobseeker profile", error: error.message },
      { status: 500 }
    );
  }
}
