import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const _id = searchParams.get("id");

    // Validate ID format
    let query = {};
    if (_id && ObjectId.isValid(_id)) {
      query._id = new ObjectId(_id);
    } else if (userId && ObjectId.isValid(userId)) {
      query.userId = new ObjectId(userId);
    } else {
      console.log("Invalid ID format:", { _id, userId });
      return NextResponse.json(
        { message: "Invalid or missing ID format" },
        {
          status: 400,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            "CDN-Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            "Surrogate-Control": "no-store",
            Pragma: "no-cache",
            Expires: "0",
            "x-netlify-cache": "miss",
          },
        }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    console.log("Looking for recruiter with query:", JSON.stringify(query));
    let recruiter = await db.collection("recruiters").findOne(query);
    console.log("Primary lookup result:", recruiter ? "Found" : "Not Found");

    // Fallback: If not found by _id, try looking up by userId if the id was passed
    if (!recruiter && _id && ObjectId.isValid(_id)) {
      console.log("Attempting fallback lookup by userId:", _id);
      recruiter = await db.collection("recruiters").findOne({ userId: new ObjectId(_id) });
      console.log("Fallback lookup result:", recruiter ? "Found" : "Not Found");
    }

    if (!recruiter) {
      console.log("Recruiter final status: Not Found");
      return NextResponse.json(
        { message: "Recruiter not found" },
        {
          status: 404,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            "CDN-Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            "Surrogate-Control": "no-store",
            Pragma: "no-cache",
            Expires: "0",
            "x-netlify-cache": "miss",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        id: recruiter._id.toString(),
        recruiterName: recruiter.recruiterName,
        email: recruiter.email,
        employeeRange: recruiter.employeeRange,
        contactNumber: recruiter.contactNumber,
        telephoneNumber: recruiter.telephoneNumber,
        userId: recruiter.userId ? recruiter.userId.toString() : null,
        createdAt: recruiter.createdAt,
        logo: recruiter.logo,
        coverImage: recruiter.coverImage,
        website: recruiter.website,
        companyDescription: recruiter.companyDescription,
        industry: recruiter.industry,
        category: recruiter.category,
        location: recruiter.location,
        country: recruiter.country || "Sri Lanka",
        district: recruiter.district,
        province: recruiter.province,
        addressLine: recruiter.addressLine,
        facebook: recruiter.facebook,
        instagram: recruiter.instagram,
        linkedin: recruiter.linkedin,
        x: recruiter.x,
        github: recruiter.github,
        dribbble: recruiter.dribbble,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "CDN-Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "Surrogate-Control": "no-store",
          Pragma: "no-cache",
          Expires: "0",
          "x-netlify-cache": "miss",
        },
      }
    );
  } catch (error) {
    console.error("Recruiter fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch Recruiter details", error: error.message },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "CDN-Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "Surrogate-Control": "no-store",
          Pragma: "no-cache",
          Expires: "0",
          "x-netlify-cache": "miss",
        },
      }
    );
  }
}
