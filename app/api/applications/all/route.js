import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db();

    const jobapplications = await db.collection("jobapplication").find().toArray();
    
    // Format data to match frontend needs
    const formattedApplications = jobapplications.map(app => ({
      id: app._id.toString(),
      candidateName: app.candidateName,
      jobTitle: app.jobTitle,
      email: app.email,
      date: new Date(app.date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).toUpperCase()
    }));

    client.close();

    return NextResponse.json(
      { 
        applications: formattedApplications, 
        count: formattedApplications.length 
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong.", error: error.message },
      { status: 500 }
    );
  }
}