import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";

export async function POST(req) {
  let client;
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const imageFile = formData.get("image");

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json({ message: "Invalid input." }, { status: 422 });
    }

    let imageUrl = "";

    // Handle image upload if present
    if (imageFile) {
      // Create a unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `${uniqueSuffix}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
      const tempFilePath = path.join(os.tmpdir(), filename);

      // Convert the file to buffer and save it
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(tempFilePath, buffer);

      // Upload to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(tempFilePath, {
        folder: "press-releases",
        resource_type: "auto",
        width: 512,
        height: 512,
        crop: "fill",
      });

      imageUrl = cloudinaryResponse.secure_url;
    }

    // Connect to database
    client = await connectToDatabase();
    const db = client.db();

    // Insert press release into the database
    const result = await db.collection("pressreleases").insertOne({
      title,
      description,
      image: imageUrl,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Press Release created!", imageUrl },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating press release:", error);
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};