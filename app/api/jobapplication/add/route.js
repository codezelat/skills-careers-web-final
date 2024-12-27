import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { GridFSBucket, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const client = await connectToDatabase();

  try {
    // Parse the multipart form data
    const formData = await req.formData();
    const file = formData.get("cv");

    if (!file) {
      return NextResponse.json(
        { message: "No CV file uploaded" },
        { status: 400 }
      );
    }

    // Extract other form fields
    const jobId = formData.get("jobId");
    const jobTitle = formData.get("jobTitle");
    const recruiterId = formData.get("recruiterId");
    const jobseekerId = formData.get("jobseekerId");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const contactNumber = formData.get("contactNumber");
    const status = "Pending";

    // Validate inputs
    if (
      !jobId ||
      !jobTitle ||
      !recruiterId ||
      !jobseekerId ||
      !firstName ||
      !lastName ||
      !email ||
      !contactNumber
    ) {
      return NextResponse.json({ message: "Invalid Input" }, { status: 400 });
    }

    const db = client.db();

    // Check for existing application
    const existingApplicant = await db.collection("jobapplication").findOne({
      jobseekerId: new ObjectId(jobseekerId),
      jobId: new ObjectId(jobId),
    });

    if (existingApplicant) {
      return NextResponse.json(
        { message: "You have already applied for this job" },
        { status: 409 }
      );
    }

    // Set up GridFS bucket
    const bucket = new GridFSBucket(db, {
      bucketName: "cvs",
    });

    // Convert file to buffer and store in GridFS
    const buffer = await file.arrayBuffer();
    const uploadStream = bucket.openUploadStream(file.name, {
      contentType: file.type,
      metadata: {
        jobId,
        jobseekerId,
        uploadDate: new Date(),
      },
    });

    const cvFileId = uploadStream.id;

    await new Promise((resolve, reject) => {
      uploadStream.end(Buffer.from(buffer), (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Store application data with reference to uploaded file
    await db.collection("jobapplication").insertOne({
      jobId: new ObjectId(jobId),
      jobTitle,
      recruiterId: new ObjectId(recruiterId),
      jobseekerId: new ObjectId(jobseekerId),
      cvFileId,
      firstName,
      lastName,
      email,
      contactNumber,
      status,
      appliedAt: new Date(),
    });

    if (result.insertedId) {
      await db
        .collection("jobapplication")
        .updateOne(
          { _id: result.insertedId },
          { $set: { jobapplicationId: new ObjectId(result.insertedId) } }
        );
    }

    revalidatePath("/dashboard");

    return NextResponse.json(
      { message: "Applied Successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in job application:", error);
    return NextResponse.json(
      { message: "Failed to process application" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
} 
