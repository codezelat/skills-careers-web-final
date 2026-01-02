import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const recruiterId = searchParams.get("recruiterId");
    const id = searchParams.get("id");

    // Validate that at least one parameter is provided
    if (!recruiterId && !id) {
      return NextResponse.json(
        { message: "Either recruiterId or id must be provided" },
        { status: 400 }
      );
    }

    // Validate ObjectId format if provided
    if (recruiterId && !ObjectId.isValid(recruiterId)) {
      return NextResponse.json(
        { message: "Invalid recruiterId format" },
        { status: 400 }
      );
    }
    if (id && !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid id format" },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();

    let tickets;
    if (recruiterId) {
      // Fetch tickets based on recruiterId
      tickets = await db
        .collection("tickets")
        .find({ recruiterId: new ObjectId(recruiterId) })
        .toArray();
    } else if (id) {
      // Fetch a single ticket based on _id
      const ticket = await db
        .collection("tickets")
        .findOne({ _id: new ObjectId(id) });
      tickets = ticket ? [ticket] : [];
    }

    if (!tickets || tickets.length === 0) {
      return NextResponse.json(
        { tickets: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { tickets },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "CDN-Cache-Control": "no-store",
          "Surrogate-Control": "no-store",
          Pragma: "no-cache",
          Expires: "0",
          "x-netlify-cache": "miss",
        },
      }
    );
  } catch (error) {
    console.error("Ticket fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch ticket details", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
    }
  }
}