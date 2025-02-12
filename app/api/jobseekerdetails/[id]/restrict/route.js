import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const candidateId = params.id;
    const data = await req.json();
    const { isRestricted } = data;

    if (!ObjectId.isValid(candidateId)) {
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
    const updateResult = await db.collection("jobseekers").updateOne(
      { _id: new ObjectId(candidateId) },
      { $set: { isRestricted: isRestricted } }
    );

    if (updateResult.matchedCount === 0) {
      client.close();
      return NextResponse.json(
        { message: "Candidate not found" },
        { status: 404 }
      );
    }

    // Fetch the updated document
    const updateCandidate = await db.collection("jobseekers").findOne({
      _id: new ObjectId(candidateId)
    });

    client.close();

    return NextResponse.json(
      { 
        message: `Recruiter ${isRestricted ? "restricted" : "unrestricted"} successfully`,
        updateCandidate
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