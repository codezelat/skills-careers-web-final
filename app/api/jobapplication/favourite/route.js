import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const { searchParams } = new URL(req.url);
    const jobApplicationId = searchParams.get("id");
    
    const data = await req.json();
    const { isFavourited } = data;

    if (!ObjectId.isValid(jobApplicationId)) {
      return NextResponse.json({ message: "Invalid job application ID" }, { status: 400 });
    }

    if (typeof isFavourited !== "boolean") {
      return NextResponse.json(
        { message: "isFavourited must be a boolean" },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await connectToDatabase();
    const db = client.db();

    const result = await db
      .collection("jobapplication")
      .updateOne(
        { _id: new ObjectId(jobApplicationId) },
        { $set: { isFavourited: isFavourited } }
      );

    // Close the database connection
    client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Job Application not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: `Job Application ${
          isFavourited ? "Favourited" : "unFavourited"
        } successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
