// /api/ticketenrollment/getJoined/route.js
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    let client;
    try {
        client = await connectToDatabase();
        const db = client.db();

        const ticketEnrollments = await db
            .collection("ticketenrollments")
            .find({})
            .toArray();

        const tickets = await db
            .collection("tickets")
            .find({})
            .toArray();

        const combinedData = ticketEnrollments.map(enrollment => {
            const ticket = tickets.find(t => t._id.toString() === enrollment.ticketId.toString());
            return {
                _id: enrollment._id,
                ticketId: enrollment.ticketId,
                jobseekerId: enrollment.jobseekerId,
                recruiterId: ticket ? ticket.recruiterId : null, 
                name: enrollment.name,
                email: enrollment.email,
                contactNumber: enrollment.contactNumber,
                eventName: ticket ? ticket.name : "Unknown Event", 
                eventLocation: ticket ? ticket.location : "Unknown Location" 
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
            await client.close();
        }
    }
}