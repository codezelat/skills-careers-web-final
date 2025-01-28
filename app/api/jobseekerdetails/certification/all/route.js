import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  let client;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID required" }, { status: 400 });
    }

    client = await connectToDatabase();
    const db = client.db();

    const licensesandcertifications = await db
      .collection("licensesandcertifications")
      .find({ jobseekerId: new ObjectId(id) })
      .toArray();

    if (!licensesandcertifications) {
      return NextResponse.json(
        { message: "No Licenses or Certifications found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ licensesandcertifications }, {status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to fetch education of this jobseeker",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
