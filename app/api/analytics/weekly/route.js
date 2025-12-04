import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");
        const userId = searchParams.get("userId");

        if (!role || !userId) {
            return NextResponse.json(
                { message: "Role and User ID are required" },
                { status: 400 }
            );
        }

        const client = await connectToDatabase();
        const db = client.db();

        // Calculate dates for the last 7 days
        const today = new Date();
        const dates = [];
        const labels = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            d.setHours(0, 0, 0, 0);
            dates.push(d);
            labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
        }

        const startPeriod = dates[0];
        const endPeriod = new Date(today);
        endPeriod.setHours(23, 59, 59, 999);

        let chart1Data = new Array(7).fill(0);
        let chart2Data = new Array(7).fill(0);

        if (role === "admin") {
            // Admin: Job Posts (Chart 1 - Line) & Active Users (Chart 2 - Bar)

            // Fetch Jobs
            const jobs = await db.collection("jobs").find({
                createdAt: { $gte: startPeriod, $lte: endPeriod }
            }).toArray();

            jobs.forEach(job => {
                const jobDate = new Date(job.createdAt);
                jobDate.setHours(0, 0, 0, 0);
                const index = dates.findIndex(d => d.getTime() === jobDate.getTime());
                if (index !== -1) chart1Data[index]++;
            });

            // Fetch Users
            const users = await db.collection("users").find({
                createdAt: { $gte: startPeriod, $lte: endPeriod }
            }).toArray();

            users.forEach(user => {
                const userDate = new Date(user.createdAt);
                userDate.setHours(0, 0, 0, 0);
                const index = dates.findIndex(d => d.getTime() === userDate.getTime());
                if (index !== -1) chart2Data[index]++;
            });

        } else if (role === "jobseeker") {
            // Jobseeker: Profile Views (Chart 1 - Line) & Applied Jobs (Chart 2 - Bar)

            // Profile Views - Mock data for now as it's not tracked
            // chart1Data = [0, 0, 0, 0, 0, 0, 0]; 

            // Applied Jobs
            // First get jobseeker ID from userId
            const jobseeker = await db.collection("jobseekers").findOne({ userId: new ObjectId(userId) });

            if (jobseeker) {
                const applications = await db.collection("jobapplication").find({
                    jobseekerId: jobseeker._id,
                    appliedAt: { $gte: startPeriod, $lte: endPeriod }
                }).toArray();

                applications.forEach(app => {
                    const appDate = new Date(app.appliedAt);
                    appDate.setHours(0, 0, 0, 0);
                    const index = dates.findIndex(d => d.getTime() === appDate.getTime());
                    if (index !== -1) chart2Data[index]++;
                });
            }

        } else if (role === "recruiter") {
            // Recruiter: Applications (Chart 1 - Bar) & Job Posts (Chart 2 - Line)
            // Note: DashboardCharts.js swaps the order for recruiters compared to others?
            // Recruiter: Applications (Bar), Job Posts (Line)

            // Get Recruiter ID
            const recruiter = await db.collection("recruiters").findOne({ _id: new ObjectId(userId) }); // Wait, userId for recruiter is usually their _id in recruiters collection? 
            // Let's check auth route again. 
            // In auth route: id: recruiter._id. So userId passed here is the recruiter's _id.

            if (recruiter) {
                // Applications
                const applications = await db.collection("jobapplication").find({
                    recruiterId: recruiter._id,
                    appliedAt: { $gte: startPeriod, $lte: endPeriod }
                }).toArray();

                applications.forEach(app => {
                    const appDate = new Date(app.appliedAt);
                    appDate.setHours(0, 0, 0, 0);
                    const index = dates.findIndex(d => d.getTime() === appDate.getTime());
                    if (index !== -1) chart1Data[index]++; // Chart 1 is Applications (Bar) in my logic below? 
                    // Wait, let's match the UI.
                    // UI Recruiter: 
                    // 1. Applications (Bar)
                    // 2. Job Posts (Line)
                });

                // Job Posts
                const jobs = await db.collection("jobs").find({
                    recruiterId: recruiter._id,
                    createdAt: { $gte: startPeriod, $lte: endPeriod }
                }).toArray();

                jobs.forEach(job => {
                    const jobDate = new Date(job.createdAt);
                    jobDate.setHours(0, 0, 0, 0);
                    const index = dates.findIndex(d => d.getTime() === jobDate.getTime());
                    if (index !== -1) chart2Data[index]++;
                });
            }
        }

        client.close();

        return NextResponse.json({
            labels,
            chart1: chart1Data,
            chart2: chart2Data
        }, { status: 200 });

    } catch (error) {
        console.error("Analytics API Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
