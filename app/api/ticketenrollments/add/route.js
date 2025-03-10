import { connectToDatabase } from "@/lib/db";
import { sendTicketEnrollmentNotification } from "@/lib/mailer";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const { ticketId, ticketName, jobseekerId, name, email, contactNumber } =
      data;

    // Validate required fields
    if (!ticketId || !jobseekerId || !name || !email || !contactNumber) {
      return NextResponse.json({ message: "Invalid input." }, { status: 422 });
    }

    // Connect to database
    const client = await connectToDatabase();
    const db = client.db();

    // Get the ticket details first
    const ticket = await db.collection("tickets").findOne({
      _id: new ObjectId(ticketId),
    });

    if (!ticket) {
      client.close();
      return NextResponse.json(
        { message: "Ticket not found." },
        { status: 404 }
      );
    }

    // Check if registration is closed
    const currentDate = new Date();
    const closingDate = new Date(ticket.closingDate);

    if (currentDate > closingDate) {
      client.close();
      return NextResponse.json(
        {
          message:
            "Registration is closed. The enrollment deadline has passed.",
        },
        { status: 400 }
      );
    }

    // Check capacity
    const currentEnrollment = parseInt(ticket.enrolledCount);
    // Only check capacity if it's not null (unlimited)
    if (ticket.capacity !== null && currentEnrollment >= ticket.capacity) {
      client.close();
      return NextResponse.json(
        { message: "House Full! This event has reached its maximum capacity." },
        { status: 400 }
      );
    }

    // Check for existing enrollment
    const existingEnrollment = await db
      .collection("ticketenrollments")
      .findOne({
        ticketId: new ObjectId(ticketId),
        jobseekerId: new ObjectId(jobseekerId),
      });

    if (existingEnrollment) {
      client.close();
      return NextResponse.json(
        { message: "You have already enrolled for this ticket" },
        { status: 409 }
      );
    }

    // Start a session for transaction
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        // Insert enrollment
        await db.collection("ticketenrollments").insertOne(
          {
            ticketId: new ObjectId(ticketId),
            jobseekerId: new ObjectId(jobseekerId),
            name,
            email,
            contactNumber,
            createdAt: new Date(),
          },
          { session }
        );

        // Update ticket's enrolled count
        await db
          .collection("tickets")
          .updateOne(
            { _id: new ObjectId(ticketId) },
            { $set: { enrolledCount: (currentEnrollment + 1).toString() } },
            { session }
          );
      });

      await session.endSession();
      client.close();

      try {
        await sendTicketEnrollmentNotification({
          ticketName,
          name,
          email,
          contactNumber,
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
      }
      
      revalidatePath("/tickets");

      return NextResponse.json(
        { message: "Successfully enrolled in the event!" },
        { status: 201 }
      );
    } catch (error) {
      await session.endSession();
      client.close();
      throw error;
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
