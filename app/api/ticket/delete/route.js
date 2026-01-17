import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get("id");

    if (!ObjectId.isValid(ticketId)) {
      return NextResponse.json(
        { message: "Invalid Ticket ID" },
        { status: 400 }
      );
    }

    // Connect to database
    client = await connectToDatabase();
    const db = client.db();

    // First verify the ticket exists
    const ticket = await db.collection("tickets").findOne({
      _id: new ObjectId(ticketId),
    });

    if (!ticket) {
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    // Delete all related ticket enrollments
    const enrollmentsResult = await db
      .collection("ticketenrollments")
      .deleteMany({
        ticketId: new ObjectId(ticketId),
      });

    // Delete the ticket
    const ticketResult = await db.collection("tickets").deleteOne({
      _id: new ObjectId(ticketId),
    });

    if (ticketResult.deletedCount === 0) {
      return NextResponse.json(
        { message: "Ticket deletion failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Ticket and all enrollments deleted successfully",
        deletedEnrollments: enrollmentsResult.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ticket deletion error:", error);
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
