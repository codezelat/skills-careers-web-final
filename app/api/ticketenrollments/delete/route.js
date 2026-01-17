import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Enrollment ID is required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db();

    // First, get the enrollment to retrieve the ticketId
    const enrollment = await db
      .collection("ticketenrollments")
      .findOne({ _id: new ObjectId(id) });

    if (!enrollment) {
      return NextResponse.json(
        { message: "Enrollment not found" },
        { status: 404 }
      );
    }

    const ticketId = enrollment.ticketId;

    // Delete the enrollment
    const result = await db
      .collection("ticketenrollments")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Enrollment deletion failed" },
        { status: 500 }
      );
    }

    // Update the ticket's enrolled count (decrement by 1)
    const ticket = await db
      .collection("tickets")
      .findOne({ _id: new ObjectId(ticketId) });

    if (ticket) {
      const currentEnrollment = parseInt(ticket.enrolledCount || 0);
      const newCount = Math.max(0, currentEnrollment - 1); // Ensure it doesn't go negative

      await db
        .collection("tickets")
        .updateOne(
          { _id: new ObjectId(ticketId) },
          { $set: { enrolledCount: newCount.toString() } }
        );
    }

    return NextResponse.json(
      { message: "Enrollment deleted successfully and ticket count updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
