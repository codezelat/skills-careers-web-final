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

    const result = await db.collection("recruiters").deleteOne({
      _id: new ObjectId(recruiterId),
    });


    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Recruiter not found" },
        { status: 404 }
      );
    }

    // Removed elastic search reindex
    // await reindexCollection(db, "recruiters");

    return NextResponse.json(
      { message: "Recruiter deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
    }
  }
}
