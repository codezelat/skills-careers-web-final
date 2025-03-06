import { connectToDatabase } from "@/lib/db";
import { sendStatusChangedNotification } from "@/lib/mailer";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PUT(req) {
  const client = await connectToDatabase();

  try {
    const { jobseekerEmail, applicationId, jobTitle, status } =
      await req.json();

    if (!applicationId || !status) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const db = client.db();
    const result = await db
      .collection("jobapplication")
      .updateOne({ _id: new ObjectId(applicationId) }, { $set: { status } });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 404 }
      );
    }

    try {
      await sendStatusChangedNotification({
        jobseekerEmail,
        applicationId,
        jobTitle,
        status,
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // Continue with the response even if email fails
    }

    return NextResponse.json(
      { message: "Status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { message: "Failed to update status" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
