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

    if (!_id || !name || !location || !date || !startTime) {
      return NextResponse.json({ message: "Invalid input." }, { status: 422 });
    }

    const client = await connectToDatabase();
    const db = client.db();

    const existingTicket = await db
      .collection("tickets")
      .findOne({ _id: new ObjectId(_id) });

    if (!existingTicket) {
      return NextResponse.json({ message: "Ticket not found." }, { status: 404 });
    }

    let eventProfileUrl = existingTicket.eventProfile; 
    if (eventProfile) {
      const buffer = await eventProfile.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64");

      const cloudinaryResponse = await cloudinary.uploader.upload(
        `data:${eventProfile.type};base64,${base64Image}`,
        {
          folder: "event-profiles",
          resource_type: "auto",
        }
      );
      eventProfileUrl = cloudinaryResponse.secure_url;
    }

    const result = await db.collection("tickets").updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          name,
          description,
          location,
          date,
          startTime,
          endTime,
          capacity: capacity === "" ? null : parseInt(capacity),
          closingDate,
          eventProfile: eventProfileUrl,
          recruiterId: existingTicket.recruiterId, 
          createdAt: existingTicket.createdAt, 
        },
      }
    );

    client.close();

    if (result.modifiedCount > 0) {
      return NextResponse.json(
        { message: "Ticket updated successfully." },
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
