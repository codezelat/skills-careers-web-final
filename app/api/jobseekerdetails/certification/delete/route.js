import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const licensesandcertificationsId = searchParams.get("id");

    if (!ObjectId.isValid(licensesandcertificationsId)) {
      return NextResponse.json({ message: "Invalid Licenses and Certifications ID" }, { status: 400 });
    }

    // Connect to database
    client = await connectToDatabase();
    const db = client.db();

    const result = await db.collection("licensesandcertifications").deleteOne({ 
      _id: new ObjectId(licensesandcertificationsId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Licenses and Certifications not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Licenses and Certifications deleted successfully" },
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
