import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req) {
  try {
    const formData = await req.formData();

    const _id = formData.get("_id");
    const name = formData.get("name");
    const description = formData.get("description");
    const location = formData.get("location");
    const date = formData.get("date");
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    const capacity = formData.get("capacity");
    const closingDate = formData.get("closingDate");
    const eventProfile = formData.get("eventProfile");
    const isPublished = formData.get("isPublished");

    if (!_id) {
      return NextResponse.json({ message: "Ticket ID is required." }, { status: 422 });
    }

    const client = await connectToDatabase();
    const db = client.db();

    const existingTicket = await db
      .collection("tickets")
      .findOne({ _id: new ObjectId(_id) });

    if (!existingTicket) {
      return NextResponse.json({ message: "Ticket not found." }, { status: 404 });
    }

    const updateFields = {};

    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (location) updateFields.location = location;
    if (date) updateFields.date = date;
    if (startTime) updateFields.startTime = startTime;
    if (endTime) updateFields.endTime = endTime;
    if (capacity !== null && capacity !== undefined && capacity !== "") {
      updateFields.capacity = parseInt(capacity);
    }
    if (closingDate) updateFields.closingDate = closingDate;
    if (isPublished !== null && isPublished !== undefined) {
      updateFields.isPublished = isPublished === 'true';
    }

    if (eventProfile && typeof eventProfile === 'object' && eventProfile.size > 0) {
      const buffer = await eventProfile.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64");

      const cloudinaryResponse = await cloudinary.uploader.upload(
        `data:${eventProfile.type};base64,${base64Image}`,
        {
          folder: "event-profiles",
          resource_type: "auto",
        }
      );
      updateFields.eventProfile = cloudinaryResponse.secure_url;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { message: "No data provided for update." },
        { status: 400 }
      );
    }

    const result = await db.collection("tickets").updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: updateFields,
      }
    );

    client.close();

    if (result.matchedCount > 0) {
      return NextResponse.json(
        { message: "Ticket updated successfully." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Ticket not found or no changes made." },
        { status: 404 }
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
