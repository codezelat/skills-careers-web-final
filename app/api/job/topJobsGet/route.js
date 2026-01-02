import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET() {
  let client;
  try {
    client = await connectToDatabase();
    const db = client.db();

    const mostDemandedJobs = await db
      .collection("jobapplication")
      .aggregate([
        {
          $group: {
            _id: "$jobId",
            applicationCount: { $sum: 1 }
          }
        },
        {
          $sort: { applicationCount: -1 }
        },
        {
          $limit: 10 
        },
        {
          $lookup: {
            from: "jobs",
            localField: "_id",
            foreignField: "_id",
            as: "jobDetails"
          }
        },
        {
          $unwind: "$jobDetails"
        },
        {
          $lookup: {
            from: "recruiters",
            localField: "jobDetails.recruiterId",
            foreignField: "_id",
            as: "recruiterDetails"
          }
        },
        {
          $unwind: "$recruiterDetails"
        },
        {
          $project: {
            _id: 0,
            jobId: "$_id",
            applicationCount: 1,
            jobTitle: "$jobDetails.jobTitle",
            location: "$jobDetails.location",
            salaryRs: "$jobDetails.salaryRs",
            jobTypes: "$jobDetails.jobTypes",
            jobExperience: "$jobDetails.jobExperience",
            jobDescription: "$jobDetails.jobDescription",
            shortDescription: "$jobDetails.shortDescription",
            keyResponsibilities: "$jobDetails.keyResponsibilities",
            requiredQualifications: "$jobDetails.requiredQualifications",
            perksAndBenefits: "$jobDetails.perksAndBenefits",
            createdAt: "$jobDetails.createdAt",
            postedDate: "$jobDetails.postedDate",
            isPublished: "$jobDetails.isPublished",
            recruiterName: "$recruiterDetails.recruiterName",
            logo: "$recruiterDetails.logo"
          }
        }
      ])
      .toArray();

    return NextResponse.json(
      {
        success: true,
        jobs: mostDemandedJobs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching most demanded jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch most demanded jobs" },
      { status: 500 }
    );
  } finally {
    if (client) {
    }
  }
}