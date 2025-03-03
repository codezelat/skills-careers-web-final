import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { message: "Jobseeker ID is required" }, 
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db();
    
    // Get all job applications for this jobseeker
    const appliedJobs = await db.collection("jobapplication")
      .aggregate([
        {
          $match: { jobseekerId: new ObjectId(id) }
        },
        {
          // Join with recruiters collection to get recruiter details
          $lookup: {
            from: "recruiters",
            localField: "recruiterId",
            foreignField: "_id",
            as: "recruiterInfo"
          }
        },
        {
          $project: {
            jobId: 1,
            jobTitle: 1,  // Using jobTitle directly from jobapplication
            recruiterName: { $arrayElemAt: ["$recruiterInfo.recruiterName", 0] },
            status: 1,
            appliedAt: 1
          }
        }
      ])
      .toArray();

    client.close();
    return NextResponse.json({ appliedJobs }, { status: 200 }); 
  } catch (error) {
    console.error("Error in GET applied jobs:", error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}