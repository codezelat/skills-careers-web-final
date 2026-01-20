import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const recruiterId = searchParams.get("id");

    if (!ObjectId.isValid(recruiterId)) {
      return NextResponse.json(
        { message: "Invalid Recruiter ID" },
        { status: 400 }
      );
    }

    // Connect to database
    client = await connectToDatabase();
    const db = client.db();

    // First verify the recruiter exists and get their userId
    const recruiter = await db.collection("recruiters").findOne({
      _id: new ObjectId(recruiterId),
    });

    if (!recruiter) {
      return NextResponse.json(
        { message: "Recruiter not found" },
        { status: 404 }
      );
    }

    const userId = recruiter.userId;

    // Delete all related data in a comprehensive cleanup
    // 1. Mark all jobs as recruiter deleted (soft delete for jobs)
    await db.collection("jobs").updateMany(
      { recruiterId: new ObjectId(recruiterId) },
      {
        $set: {
          recruiterDeleted: true,
          recruiterName: "Deleted Account",
          updatedAt: new Date(),
        },
      }
    );

    // 2. Mark all job applications from this recruiter's jobs
    await db.collection("jobapplication").updateMany(
      { recruiterId: new ObjectId(recruiterId) },
      {
        $set: {
          recruiterDeleted: true,
          updatedAt: new Date(),
        },
      }
    );

    // 3. Delete all tickets (events) created by this recruiter and their enrollments
    const recruiterTickets = await db.collection("tickets").find({
      recruiterId: new ObjectId(recruiterId),
    }).toArray();

    const ticketIds = recruiterTickets.map(ticket => ticket._id);
    
    if (ticketIds.length > 0) {
      // Delete all enrollments for these tickets
      await db.collection("ticketenrollments").deleteMany({
        ticketId: { $in: ticketIds },
      });

      // Delete the tickets
      await db.collection("tickets").deleteMany({
        recruiterId: new ObjectId(recruiterId),
      });
    }

    // 4. Delete the recruiter profile
    const recruiterResult = await db.collection("recruiters").deleteOne({
      _id: new ObjectId(recruiterId),
    });

    // 5. Delete from users collection to allow re-registration
    if (userId) {
      await db.collection("users").deleteOne({
        _id: new ObjectId(userId),
      });
    }

    if (recruiterResult.deletedCount === 0) {
      return NextResponse.json(
        { message: "Recruiter deletion failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Recruiter and all related data handled successfully",
        deletedRecords: {
          recruiter: true,
          user: userId ? true : false,
          tickets: ticketIds.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Recruiter deletion error:", error);
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
