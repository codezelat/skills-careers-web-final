import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth"; 
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { oldPassword, newPassword } = await req.json();
    const userId = session.user.id;

    // Validate new password
    if (!newPassword || newPassword.trim().length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 422 }
      );
    }
    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json(
        { message: "Password must include at least one uppercase letter." },
        { status: 422 }
      );
    }
    if (!/[a-z]/.test(newPassword)) {
      return NextResponse.json(
        { message: "Password must include at least one lowercase letter." },
        { status: 422 }
      );
    }
    if (!/\d/.test(newPassword)) {
      return NextResponse.json(
        { message: "Password must include at least one number." },
        { status: 422 }
      );
    }
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      return NextResponse.json(
        { message: "Password must include at least one special character." },
        { status: 422 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db();

    // Get user from database
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      await client.close();
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Verify old password
    const isValidPassword = await verifyPassword(oldPassword, user.password);
    if (!isValidPassword) {
      await client.close();
      return NextResponse.json(
        { message: "Old password is incorrect." },
        { status: 422 }
      );
    }

    // Check if new password is different
    if (oldPassword === newPassword) {
      await client.close();
      return NextResponse.json(
        { message: "New password must be different from old password." },
        { status: 422 }
      );
    }

    // Hash and update new password
    const hashedPassword = await hashPassword(newPassword);
    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: hashedPassword } }
      );

    await client.close();
    return NextResponse.json(
      { message: "Password updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}