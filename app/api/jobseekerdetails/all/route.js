import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const client = await connectToDatabase();
    const db = client.db();

    // Fetch all jobseekers
    const jobseekers = await db.collection("jobseekers").find().toArray();

    // Ensure userId is properly serialized as string
    const serializedJobseekers = jobseekers.map((jobseeker) => ({
      ...jobseeker,
      _id: jobseeker._id.toString(),
      userId: jobseeker.userId?.toString() || jobseeker.userId,
    }));

    const count = serializedJobseekers.length;

    return NextResponse.json(
      { jobseekers: serializedJobseekers, count },
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
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
