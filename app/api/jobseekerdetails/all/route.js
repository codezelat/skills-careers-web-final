import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const client = await connectToDatabase();
    const db = client.db();

    // Fetch all jobseekers
    const jobseekers = await db.collection("jobseekers").find().toArray();

    const count = jobseekers.length;

    client.close();

    return NextResponse.json(
      { jobseekers, count },
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
