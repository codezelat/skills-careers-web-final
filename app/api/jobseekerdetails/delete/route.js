import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

import { NextResponse } from "next/server";

export async function DELETE(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const jobseekerId = searchParams.get("id");

    if (!ObjectId.isValid(jobseekerId)) {
      return NextResponse.json(
        { message: "Invalid Jobseeker ID" },
        { status: 400 }
      );
    }

    // Connect to database
    client = await connectToDatabase();
    const db = client.db();

    const result = await db.collection("jobseekers").deleteOne({
      _id: new ObjectId(jobseekerId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Jobseeker not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Jobseeker deleted successfully" },
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
