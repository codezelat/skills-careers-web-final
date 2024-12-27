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
    let jobseeker = null;

    if (email) {
      jobseeker = await db.collection("jobseekers").findOne({ email });
    } else if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json(
          { message: "Invalid ID provided." },
          { status: 400 }
        );
      }
      jobseeker = await db
        .collection("jobseekers")
        .findOne({ _id: new ObjectId(id) });
    }

    client.close();

    if (jobseeker) {
      return NextResponse.json(
        {
          id: jobseeker._id.toString(),
          firstName: jobseeker.firstName,
          lastName: jobseeker.lastName,
          email: jobseeker.email,
          contactNumber: jobseeker.contactNumber,
          position: jobseeker.position,
          personalProfile: jobseeker.personalProfile,
          dob: jobseeker.dob,
          nationality: jobseeker.nationality,
          maritalStatus: jobseeker.maritalStatus,
          languages: jobseeker.languages,
          religion: jobseeker.religion,
          address: jobseeker.address,
          ethnicity: jobseeker.ethnicity,
          experience: jobseeker.experience,
          education: jobseeker.education,
          licensesCertifications: jobseeker.licensesCertifications,
          softSkills: jobseeker.softSkills,
          professionalExpertise: jobseeker.professionalExpertise,
          profileImage: jobseeker.profileImage,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Job Seeker not found." },
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
