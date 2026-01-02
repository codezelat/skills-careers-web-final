import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id && !userId) {
      return NextResponse.json(
        { message: "Either id or userId must be provided." },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();
    const jobseekersCollection = db.collection("jobseekers");

    let query = {};
    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { message: "Invalid jobseeker ID format" },
          { status: 400 }
        );
      }
      query._id = new ObjectId(id);
    } else {
      if (!ObjectId.isValid(userId)) {
        return NextResponse.json(
          { message: "Invalid user ID format" },
          { status: 400 }
        );
      }
      query.userId = new ObjectId(userId);
    }

    const jobseeker = await jobseekersCollection.findOne(query);

    if (!jobseeker) {
      return NextResponse.json(
        { message: "Jobseeker not found" },
        { status: 404 }
      );
    }

    const jobseekerId = jobseeker._id;

    const educations = await db
      .collection("educations")
      .find({ jobseekerId: new ObjectId(jobseekerId) })
      .toArray();

    const experiences = await db
      .collection("experiences")
      .find({ jobseekerId: new ObjectId(jobseekerId) })
      .toArray();

    const certifications = await db
      .collection("licensesandcertifications")
      .find({ jobseekerId: new ObjectId(jobseekerId) })
      .toArray();

    const jobseekerDetails = {
      ...jobseeker,
      educations,
      experiences,
      certifications,
    };

    return NextResponse.json(
      { jobseeker: jobseekerDetails },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "CDN-Cache-Control": "no-store",
          "Surrogate-Control": "no-store",
          Pragma: "no-cache",
          Expires: "0",
          "x-netlify-cache": "miss",
        },
      }
    );

  } catch (error) {
    console.error("Jobseeker fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch jobseeker details", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
    }
  }
}