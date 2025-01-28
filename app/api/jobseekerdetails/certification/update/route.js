import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { _id, ...updateFields } = body;

    if (!_id) {
      return NextResponse.json({ message: "No ID provided." }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db();

    // Get the existing licensesandcertifications to preserve the recruiterId
    const existingLicensesandCertifications = await db
      .collection("licensesandcertifications")
      .findOne({ _id: new ObjectId(_id) });

    if (!existingLicensesandCertifications) {
      return NextResponse.json({ message: "Licenses and Certifications not found." }, { status: 404 });
    }

    // Keep the existing recruiterId and add new fields
    const updateData = {
      ...updateFields,
      jobseekerId: existingLicensesandCertifications.jobseekerId,
      createdAt: existingLicensesandCertifications.createdAt,
    };

    const result = await db
      .collection("licensesandcertifications")
      .updateOne({ _id: new ObjectId(_id) }, { $set: updateData });

    client.close();

    if (result.modifiedCount > 0) {
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
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
