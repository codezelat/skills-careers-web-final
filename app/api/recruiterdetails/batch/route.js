import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "Invalid or missing IDs array" },
        { status: 400 }
      );
    }

    // Convert string IDs to ObjectId and validate
    const validIds = ids
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    if (validIds.length === 0) {
      return NextResponse.json(
        { message: "No valid IDs provided" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Fetch all recruiters in a single query
    const recruiters = await db
      .collection("recruiters")
      .find({
        _id: { $in: validIds },
      })
      .toArray();

    // Create a map for quick lookup
    const recruiterMap = {};
    recruiters.forEach((recruiter) => {
      recruiterMap[recruiter._id.toString()] = {
        _id: recruiter._id,
        recruiterName: recruiter.recruiterName,
        logo: recruiter.logo,
        industry: recruiter.industry || recruiter.category, // Support both fields
        category: recruiter.category || recruiter.industry, // Support both fields
        companyDescription: recruiter.companyDescription,
      };
    });

    return NextResponse.json(
      { recruiters: recruiterMap },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
