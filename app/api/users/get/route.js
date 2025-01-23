import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("id");

        if (!userId) {
            return NextResponse.json(
                { message: "User ID must be provided." },
                { status: 400 }
            );
        }

        if (!ObjectId.isValid(userId)) {
            return NextResponse.json(
                { message: "Invalid User ID provided." },
                { status: 400 }
            );
        }

        const client = await connectToDatabase();
        const db = client.db();

        const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
        client.close();

        if (user) {
            return NextResponse.json(
                {
                    id: user._id.toString(),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    contactNumber: user.contactNumber,
                    email: user.email,
                    profileImage: user.profileImage,
                    role: user.role,
                    createdAt: user.createdAt,
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { message: "Something went wrong.", error: error.message },
            { status: 500 }
        );
    }
}
