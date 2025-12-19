import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { jobseekerId } = await req.json();

        if (!jobseekerId) {
            return NextResponse.json(
                { message: "Jobseeker ID is required" },
                { status: 400 }
            );
        }

        const client = await connectToDatabase();
        const db = client.db();

        // Push the new timestamp to the views array
        // Use $push to add current date to views array. Create it if it doesn't exist.
        const result = await db.collection("jobseekers").updateOne(
            { _id: new ObjectId(jobseekerId) },
            {
                $push: { views: new Date() }
            }
        );

        client.close();

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: "Jobseeker not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "View recorded successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("View API Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
