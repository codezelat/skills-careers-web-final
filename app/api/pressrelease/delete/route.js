import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const pressreleaseId = searchParams.get("id");

    if (!ObjectId.isValid(pressreleaseId)) {
      return NextResponse.json(
        { message: "Invalid Press Release ID" },
        { status: 400 }
      );
    }

    // Connect to database
    client = await connectToDatabase();
    const db = client.db();

    const result = await db.collection("pressreleases").deleteOne({
      _id: new ObjectId(pressreleaseId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Press Release not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Press Release deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.close();
    }
  }
}
