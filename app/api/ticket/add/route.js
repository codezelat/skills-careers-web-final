import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
    try {
        const formData = await req.formData();

        const recruiterId = formData.get("recruiterId");
        const name = formData.get("name");
        const description = formData.get("description");
        const location = formData.get("location");
        const date = formData.get("date");
        const startTime = formData.get("startTime");
        const endTime = formData.get("endTime");
        const capacity = formData.get("capacity");
        const closingDate = formData.get("closingDate");
        const eventProfile = formData.get("eventProfile");

        if (!recruiterId || !name || !location || !date || !startTime) {
            return NextResponse.json({ message: "Invalid input." }, { status: 422 });
        }

        let eventProfileUrl = null;
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

        const client = await connectToDatabase();
        const db = client.db();

        const seatingCapacity = capacity === "" ? null : parseInt(capacity);

        const result = await db.collection("tickets").insertOne({
            recruiterId: new ObjectId(recruiterId),
            name,
            description,
            location,
            date,
            startTime,
            endTime,
            capacity: seatingCapacity,
            enrolledCount: "0",
            closingDate,
            eventProfile: eventProfileUrl,
            createdAt: new Date(),
            isPublished: false,
        });

        client.close();

        return NextResponse.json({ message: "Ticket created!" }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Something went wrong.", error: error.message },
            { status: 500 }
        );
    }
}