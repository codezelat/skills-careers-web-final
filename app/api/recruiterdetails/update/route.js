import { connectToDatabase } from "@/lib/db";
import { reindexCollection } from "@/lib/elasticsearch-utils";
import { NextResponse } from "next/server";

export async function PUT(req) {
  let client;
  try {
    const body = await req.json();

    const { _id, recruiterId, email, createdAt, ...updatedDetails } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Invalid email provided." },
        { status: 400 }
      );
    }

    client = await connectToDatabase();
    const db = client.db();

    const result = await db
      .collection("recruiters")
      .updateOne({ email }, { $set: updatedDetails }, { upsert: false });

    if (result.modifiedCount > 0) {
      await reindexCollection(db, "recruiters");

      return NextResponse.json(
        { message: "Details updated successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No changes were made." },
        { status: 200 }
      );
    }
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
