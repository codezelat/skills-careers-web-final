import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  let client;
  try {
    const { id: recruiterId } = await params;
    const data = await req.json();
    const { isRestricted, reason } = data;

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

    // Update the recruiter
    const updateResult = await db
      .collection("recruiters")
      .updateOne({ _id: new ObjectId(recruiterId) }, { $set: updateData });

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { message: "Recruiter not found" },
        { status: 404 }
      );
    }

    // Fetch the updated document
    const updatedRecruiter = await db.collection("recruiters").findOne({
      _id: new ObjectId(recruiterId),
    });

    return NextResponse.json(
      {
        message: `Recruiter ${isRestricted ? "restricted" : "unrestricted"} successfully`,
        updatedRecruiter,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Recruiter restriction error:", error);
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
