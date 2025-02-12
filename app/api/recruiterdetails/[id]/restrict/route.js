import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const recruiterId = params.id;
    const data = await req.json();
    const { isRestricted } = data;

    if (!ObjectId.isValid(recruiterId)) {
      return NextResponse.json(
        { message: "Invalid recruiter ID" },
        { status: 400 }
      );
    }

    if (typeof isRestricted !== "boolean") {
      return NextResponse.json(
        { message: "isRestricted must be a boolean" },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db();

    // Update the recruiter
    const updateResult = await db.collection("recruiters").updateOne(
      { _id: new ObjectId(recruiterId) },
      { $set: { isRestricted: isRestricted } }
    );

    if (updateResult.matchedCount === 0) {
      client.close();
      return NextResponse.json(
        { message: "Recruiter not found" },
        { status: 404 }
      );
    }

    // Fetch the updated document
    const updatedRecruiter = await db.collection("recruiters").findOne({
      _id: new ObjectId(recruiterId)
    });

    client.close();

    return NextResponse.json(
      { 
        message: `Recruiter ${isRestricted ? "restricted" : "unrestricted"} successfully`,
        updatedRecruiter
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}