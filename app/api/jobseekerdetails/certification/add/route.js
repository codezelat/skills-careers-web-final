import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const { jobseekerId, certificateName, organizationName, receivedDate } =
      data;

    if (!jobseekerId || !certificateName) {
      return NextResponse.json({ message: "Invalid input." }, { status: 422 });
    }

    const client = await connectToDatabase();
    const db = client.db();

    const result = await db.collection("licensesandcertifications").insertOne({
      jobseekerId: new ObjectId(jobseekerId),
      certificateName,
      organizationName,
      receivedDate,
      createdAt: new Date(),
    });

    client.close();

    return NextResponse.json(
      { message: "Licenses & Certifications Added!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
