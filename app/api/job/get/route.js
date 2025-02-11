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

    const job = await db.collection("jobs").findOne({ _id: new ObjectId(id) });

    if (!job) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: job._id.toString(),
        jobTitle: job.jobTitle,
        recruiterId: job.recruiterId,
        jobCategory: job.jobCategory,
        location: job.location,
        salaryRs: job.salaryRs,
        salaryCents: job.salaryCents,
        jobTypes: job.jobTypes,
        jobExperience: job.jobExperience,
        jobDescription: job.jobDescription,
        shortDescription: job.shortDescription,
        keyResponsibilities: job.keyResponsibilities,
        requiredQualifications: job.requiredQualifications,
        perksAndBenefits: job.perksAndBenefits,
        createdAt: job.createdAt,
        postedDate: job.postedDate,
        isPublished: job.isPublished
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
      }
    );

  } catch (error) {
    console.error("Job fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch job details", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}