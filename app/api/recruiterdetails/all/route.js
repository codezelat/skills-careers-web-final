import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const client = await connectToDatabase();
    const db = client.db();

    // Fetch all recruiters excluding restricted ones
    const recruiters = await db
      .collection("recruiters")
      .find({
        isRestricted: { $ne: true },
      })
      .toArray();
    const count = recruiters.length;

    return NextResponse.json(
      { recruiters, count },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
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
