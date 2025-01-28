// app/api/upload-image/route.js
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import os from 'os';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
  let client;
  try {
    // Log the start of the request
    console.log('Starting logo upload process');

    const formData = await request.formData();
    const file = formData.get('image');
    const email = formData.get('email');

    console.log('Received file:', file?.name);
    console.log('Received email:', email);

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    
    // Use OS temp directory instead of /tmp
    const tempFilePath = path.join(os.tmpdir(), filename);
    
    console.log('Temporary file path:', tempFilePath);

    // Convert the file to buffer and save it
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(tempFilePath, buffer);
    console.log('File written to temp location');

    // Upload to Cloudinary
    console.log('Starting Cloudinary upload');
    const cloudinaryResponse = await cloudinary.uploader.upload(tempFilePath, {
      folder: 'cover-images',
      resource_type: 'auto',
      width: 820,
      height: 312,
      crop: 'fill', 
      gravity: 'face',
    });
    console.log('Cloudinary upload successful:', cloudinaryResponse.secure_url);

    // Connect to MongoDB and update the profile image URL
    console.log('Connecting to MongoDB');
    client = await connectToDatabase();
    const db = client.db();
    
    const result = await db.collection("jobseekers").updateOne(
      { email },
      { $set: { coverImage: cloudinaryResponse.secure_url } }
    );
    console.log('MongoDB update result:', result);

    if (result.modifiedCount === 0) {
      console.log('No document was modified in MongoDB');
      return NextResponse.json(
        { error: 'User not found or image URL not updated' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Image uploaded successfully',
      imageUrl: cloudinaryResponse.secure_url
    });

  } catch (error) {
    console.error('Detailed error in image upload:', error);
    return NextResponse.json(
      { 
        error: 'Error uploading image',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      console.log('Closing MongoDB connection');
      client.close();
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};