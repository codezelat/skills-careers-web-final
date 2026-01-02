import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const recruiterId = searchParams.get("recruiterId");
    const jobseekerId = searchParams.get("jobseekerId");

    // Validate input parameters
    if (recruiterId && jobseekerId) {
      return NextResponse.json(
        { message: "Provide either recruiterId OR jobseekerId, not both" },
        { status: 400 }
      );
    }

    if (!recruiterId && !jobseekerId) {
      return NextResponse.json(
        { message: "Either recruiterId or jobseekerId must be provided." },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();
    const jobApplicationsCollection = db.collection("jobapplication");

    let query = {};
    if (recruiterId) {
      if (!ObjectId.isValid(recruiterId)) {
        return NextResponse.json(
          { message: "Invalid recruiter ID format" },
          { status: 400 }
        );
      }
      query.recruiterId = new ObjectId(recruiterId);
    } else {
      if (!ObjectId.isValid(jobseekerId)) {
        return NextResponse.json(
          { message: "Invalid jobseeker ID format" },
          { status: 400 }
        );
      }
      query.jobseekerId = new ObjectId(jobseekerId);
    }

    const jobApplications = await jobApplicationsCollection.find(query).toArray();
    const applicationCount = jobApplications.length;

    return NextResponse.json({
      success: true,
      applications: jobApplications,
      count: applicationCount
    },
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
          "x-netlify-cache": "miss", // Explicitly tell Netlify to bypass cache
        },
      });

  } catch (error) {
    console.error("Job applications fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch applications", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
    }
  }
}