import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const client = await connectToDatabase();
    const db = client.db();

    let filter = {};

    // Role-based Access Control
    if (session.user.role === "admin") {
      // Admin can see all, or filter by specific ID if provided
      if (id) {
        filter.userId = new ObjectId(id);
      }
    } else {
      // Non-admins can ONLY see their own inquiries
      filter.userId = new ObjectId(session.user.id);
    }

    // Fetch inquiries based on filter
    const inquiries = await db.collection("inquiries").find(filter).toArray();

    return NextResponse.json({ inquiries }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}
