import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";

export async function PUT(req) {
  let client;

  try {
    const formData = await req.formData();
    const _id = formData.get("_id");
    const title = formData.get("title");
    const description = formData.get("description");
    const currentImageUrl = formData.get("currentImageUrl");
    const imageFile = formData.get("image");

    if (!_id) {
      return NextResponse.json({ message: "No ID provided." }, { status: 400 });
    }

    // Prepare update object
    const updateData = {
      title,
      description,
    };

    // Handle image update if new image is provided
    if (imageFile) {
      // Delete old image from Cloudinary if it exists
      if (currentImageUrl) {
        try {
          // Extract public_id from the URL
          const publicId = currentImageUrl.split('/').slice(-1)[0].split('.')[0];
          await cloudinary.uploader.destroy(`press-releases/${publicId}`);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      // Upload new image
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

      // Add new image URL to update data
      updateData.image = cloudinaryResponse.secure_url;
    }

    // Connect to database and update
    client = await connectToDatabase();
    const db = client.db();

    const result = await db
      .collection("pressreleases")
      .updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateData },
        { upsert: false }
      );

    if (result.modifiedCount > 0) {
      return NextResponse.json(
        {
          message: "Details updated successfully.",
          imageUrl: updateData.image || currentImageUrl
        },
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