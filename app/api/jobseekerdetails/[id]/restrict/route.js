import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  let client;
  try {
    const { id: candidateId } = await params;
    const data = await req.json();
    const { isRestricted, reason } = data;

    if (!ObjectId.isValid(candidateId)) {
      return NextResponse.json(
        { message: "Invalid candidate ID" },
        { status: 400 }
      );
    }

    if (typeof isRestricted !== "boolean") {
      return NextResponse.json(
        { message: "isRestricted must be a boolean" },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();

    // Prepare update object with timestamp
    const updateData = {
      isRestricted: isRestricted,
      restrictionUpdatedAt: new Date(),
    };

    // Add reason if provided and restricting
    if (isRestricted && reason) {
      updateData.restrictionReason = reason;
    } else if (!isRestricted) {
      // Remove reason when unrestricting
      updateData.restrictionReason = null;
    }

    // Update the candidate
    const updateResult = await db
      .collection("jobseekers")
      .updateOne({ _id: new ObjectId(candidateId) }, { $set: updateData });

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { message: "Candidate not found" },
        { status: 404 }
      );
    }

    // Fetch the updated document
    const updateCandidate = await db.collection("jobseekers").findOne({
      _id: new ObjectId(candidateId),
    });

    return NextResponse.json(
      {
        message: `Candidate ${isRestricted ? "restricted" : "unrestricted"} successfully`,
        updateCandidate,
        isRestricted: updateCandidate.isRestricted,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Candidate restriction error:", error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      // Connection is managed by pool
    }
  }
}
