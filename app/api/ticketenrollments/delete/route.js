import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "Enrollment ID is required" },
                { status: 400 }
            );
        }

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid ID format" },
                { status: 400 }
            );
        }

        const client = await connectToDatabase();
        const db = client.db();

        const result = await db
            .collection("ticketenrollments")
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { message: "Enrollment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Enrollment deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting enrollment:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
