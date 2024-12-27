import { connectToDatabase } from "@/lib/db";
import { GridFSBucket, ObjectId } from 'mongodb';
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const client = await connectToDatabase();
  
  try {
    const fileId = params.fileId;
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: 'cvs' });

    // Find the file metadata
    const file = await bucket.find({ _id: new ObjectId(fileId) }).next();
    
    if (!file) {
      return NextResponse.json(
        { message: "File not found" },
        { status: 404 }
      );
    }

    // Get the file stream
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    
    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Create response with appropriate headers
    const response = new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': file.contentType,
        'Content-Disposition': `attachment; filename="${file.filename}"`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error downloading CV:", error);
    return NextResponse.json(
      { message: "Failed to download CV" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}