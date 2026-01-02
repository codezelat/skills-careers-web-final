import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    if (!email && !id) {
      return NextResponse.json(
        { message: "Either email or ID must be provided." },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db();
    let user = null;

    if (email) {
      user = await db.collection("users").findOne({ email });
    } else if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { message: "Invalid ID provided." },
          { status: 400 }
        );
      }
      user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(id) });
    }

    if (user) {
      return NextResponse.json({ user },
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
            "x-netlify-cache": "miss", // Explicitly tell Netlify to bypass cache
          },
        });
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
