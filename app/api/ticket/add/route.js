import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();

    const {
      recruiterId,
      name,
      description,
      location,
      date,
      startTime,
      endTime,
      capacity,
      closingDate,
    } = data;

    // Validate required fields
    if (!recruiterId || !name || !location || !date || !startTime) {
      return NextResponse.json({ message: "Invalid input." }, { status: 422 });
    }

    // Connect to database
    const client = await connectToDatabase();
    const db = client.db();

    const seatingCapacity = capacity === "" ? null : parseInt(capacity);
    console.log("Seating capacity is", seatingCapacity);

    // Insert Jobs into the database
    const result = await db.collection("tickets").insertOne({
      recruiterId: new ObjectId(recruiterId),
      name,
      description,
      location,
      date,
      startTime,
      endTime,
      capacity: seatingCapacity,
      enrolledCount: "0",
      closingDate,
      createdAt: new Date(), // Save current date and time
    });

    // Close the database connection
    client.close();

    revalidatePath("/tickets");
    return NextResponse.json({ message: "Ticket created!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
