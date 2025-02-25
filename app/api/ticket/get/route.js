import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Add this import

export async function GET(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Validate ID format
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid ticket ID format" },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();

    const ticket = await db
      .collection("tickets")
      .findOne({ _id: new ObjectId(id) });

    if (!ticket) {
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { ticket },
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
          "x-netlify-cache": "miss", // Explicitly tell Netlify to bypass cache
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
      await client.close();
    }
  }
}
