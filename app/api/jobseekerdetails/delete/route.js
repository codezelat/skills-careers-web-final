import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const jobseekerId = searchParams.get("id");

    if (!ObjectId.isValid(jobseekerId)) {
      return NextResponse.json(
        { message: "Invalid Jobseeker ID" },
        { status: 400 }
      );
    }

    // Connect to database
    client = await connectToDatabase();
    const db = client.db();

    // First, verify the jobseeker exists and get their userId
    const jobseeker = await db.collection("jobseekers").findOne({
      _id: new ObjectId(jobseekerId),
    });

    if (!jobseeker) {
      return NextResponse.json(
        { message: "Jobseeker not found" },
        { status: 404 }
      );
    }

    const userId = jobseeker.userId;

    // Delete all related data in a comprehensive cleanup
    // 1. Delete educations
    await db.collection("educations").deleteMany({
      jobseekerId: new ObjectId(jobseekerId),
    });

    // 2. Delete experiences
    await db.collection("experiences").deleteMany({
      jobseekerId: new ObjectId(jobseekerId),
    });

    // 3. Delete licenses and certifications
    await db.collection("licensesandcertifications").deleteMany({
      jobseekerId: new ObjectId(jobseekerId),
    });

    // 4. Mark job applications as deleted account (soft delete for applications)
    // We update applications to indicate the candidate account was deleted
    await db.collection("jobapplication").updateMany(
      { jobseekerId: new ObjectId(jobseekerId) },
      {
        $set: {
          candidateDeleted: true,
          firstName: "Deleted",
          lastName: "Account",
          email: "[Deleted Account]",
          contactNumber: "[Deleted]",
          updatedAt: new Date(),
        },
      }
    );

    // 5. Handle ticket enrollments - mark as deleted account
    await db.collection("ticketenrollments").updateMany(
      { jobseekerId: new ObjectId(jobseekerId) },
      {
        $set: {
          candidateDeleted: true,
          updatedAt: new Date(),
        },
      }
    );

    // 6. Delete the jobseeker profile
    const jobseekerResult = await db.collection("jobseekers").deleteOne({
      _id: new ObjectId(jobseekerId),
    });

    // 7. Delete from users collection to allow re-registration
    if (userId) {
      await db.collection("users").deleteOne({
        _id: new ObjectId(userId),
      });
    }

    if (jobseekerResult.deletedCount === 0) {
      return NextResponse.json(
        { message: "Jobseeker deletion failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Candidate and all related data deleted successfully",
        deletedRecords: {
          jobseeker: true,
          user: userId ? true : false,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Candidate deletion error:", error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      // Connection is managed by the connection pool, no need to close
    }
  }
}
