// /api/ticketenrollment/getJoined/route.js
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    let client;
    try {
        const { searchParams } = new URL(req.url);
        const recruiterId = searchParams.get("recruiterId");

        // Validate that recruiterId is provided
        if (!recruiterId) {
            return NextResponse.json(
                { message: "recruiterId must be provided" },
                { status: 400 }
            );
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(recruiterId)) {
            return NextResponse.json(
                { message: "Invalid recruiterId format" },
                { status: 400 }
            );
        }

        client = await connectToDatabase();
        const db = client.db();

        // Fetch tickets based on recruiterId
        const tickets = await db
            .collection("tickets")
            .find({ recruiterId: new ObjectId(recruiterId) })
            .toArray();

        if (!tickets || tickets.length === 0) {
            return NextResponse.json(
                { data: [] },
                { status: 200 }
            );
        }

        // Extract ticket IDs
        const ticketIds = tickets.map(ticket => ticket._id);

        // Fetch ticket enrollments based on ticket IDs
        const ticketEnrollments = await db
            .collection("ticketenrollments")
            .find({ ticketId: { $in: ticketIds } })
            .toArray();

        // Map ticket enrollments to include recruiterId from the corresponding ticket
        const combinedData = ticketEnrollments.map(enrollment => {
            const ticket = tickets.find(t => t._id.toString() === enrollment.ticketId.toString());
            return {
                _id: enrollment._id,
                ticketId: enrollment.ticketId,
                jobseekerId: enrollment.jobseekerId,
                recruiterId: ticket.recruiterId,
                name: enrollment.name,
                email: enrollment.email,
                contactNumber: enrollment.contactNumber,
                eventName: ticket.name,
                eventLocation: ticket.location
            };
        });

        return NextResponse.json(
            { data: combinedData },
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control":
                        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
                    "CDN-Cache-Control": "no-store",
                    "Surrogate-Control": "no-store",
                    Pragma: "no-cache",
                    Expires: "0",
                    "x-netlify-cache": "miss",
                },
            }
        );
    } catch (error) {
        console.error("Error fetching combined data:", error);
        return NextResponse.json(
            { message: "Failed to fetch combined data", error: error.message },
            { status: 500 }
        );
    } finally {
        if (client) {
        }
    }
}