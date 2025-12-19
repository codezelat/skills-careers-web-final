import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");
        const userId = searchParams.get("userId");
        const filter = searchParams.get("filter") || "week"; // Default to week
        const target = searchParams.get("target"); // Optional: chart1 or chart2

        if (!role || !userId) {
            return NextResponse.json(
                { message: "Role and User ID are required" },
                { status: 400 }
            );
        }

        const client = await connectToDatabase();
        const db = client.db();

        let dates = [];
        let labels = [];
        const today = new Date();

        if (filter === "year") {
            // Generate last 12 months
            for (let i = 11; i >= 0; i--) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                dates.push(d);
                labels.push(d.toLocaleDateString('en-US', { month: 'short' }));
            }
        } else if (filter === "month") {
            // Generate last 30 days
            for (let i = 29; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                d.setHours(0, 0, 0, 0);
                dates.push(d);
                labels.push(d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));
            }
        } else if (filter === "custom") {
            const startStr = searchParams.get("startDate");
            const endStr = searchParams.get("endDate");

            if (startStr && endStr) {
                const [sY, sM, sD] = startStr.split('-').map(Number);
                const [eY, eM, eD] = endStr.split('-').map(Number);

                const start = new Date(sY, sM - 1, sD);
                const end = new Date(eY, eM - 1, eD);
                end.setHours(23, 59, 59, 999); // Ensure end covers the full day

                // Inclusive range
                for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    const dateEntry = new Date(d);
                    dateEntry.setHours(0, 0, 0, 0); // Ensure consistent local midnight
                    dates.push(dateEntry);
                    labels.push(dateEntry.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));
                }
            }
        } else {
            // Default: Last 7 days
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                d.setHours(0, 0, 0, 0);
                dates.push(d);
                labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
            }
        }

        if (dates.length === 0) {
            return NextResponse.json({
                labels: [],
                chart1: [],
                chart2: []
            }, { status: 200 });
        }

        const startPeriod = dates[0];
        const endPeriod = new Date(dates[dates.length - 1]);
        startPeriod.setHours(0, 0, 0, 0);
        endPeriod.setHours(23, 59, 59, 999);

        let chart1Data = [];
        let chart2Data = [];

        // Initialize arrays with 0s only if we are going to populate them
        if (!target || target === "chart1") chart1Data = new Array(dates.length).fill(0);
        if (!target || target === "chart2") chart2Data = new Array(dates.length).fill(0);

        if (role === "admin") {
            // Admin: Job Posts (Chart 1) & Active Users (Chart 2)
            if (!target || target === "chart1") {
                const jobs = await db.collection("jobs").find({
                    createdAt: { $gte: startPeriod, $lte: endPeriod }
                }).toArray();

                jobs.forEach(job => {
                    const jobDate = new Date(job.createdAt);
                    let index = -1;
                    if (filter === "year") {
                        index = dates.findIndex(d => d.getMonth() === jobDate.getMonth() && d.getFullYear() === jobDate.getFullYear());
                    } else {
                        jobDate.setHours(0, 0, 0, 0);
                        index = dates.findIndex(d => d.getTime() === jobDate.getTime());
                    }
                    if (index !== -1) chart1Data[index]++;
                });
            }

            if (!target || target === "chart2") {
                const users = await db.collection("users").find({
                    createdAt: { $gte: startPeriod, $lte: endPeriod }
                }).toArray();

                users.forEach(user => {
                    const userDate = new Date(user.createdAt);
                    let index = -1;
                    if (filter === "year") {
                        index = dates.findIndex(d => d.getMonth() === userDate.getMonth() && d.getFullYear() === userDate.getFullYear());
                    } else {
                        userDate.setHours(0, 0, 0, 0);
                        index = dates.findIndex(d => d.getTime() === userDate.getTime());
                    }
                    if (index !== -1) chart2Data[index]++;
                });
            }

        } else if (role === "jobseeker") {
            // Jobseeker: Profile Views (Chart 1) & Applied Jobs (Chart 2)

            const jobseeker = await db.collection("jobseekers").findOne({ userId: new ObjectId(userId) });

            if (jobseeker) {
                // Profile Views
                if (!target || target === "chart1") {
                    if (jobseeker.views && Array.isArray(jobseeker.views)) {
                        jobseeker.views.forEach(viewDate => {
                            const vDate = new Date(viewDate);
                            let index = -1;
                            if (filter === "year") {
                                index = dates.findIndex(d => d.getMonth() === vDate.getMonth() && d.getFullYear() === vDate.getFullYear());
                            } else {
                                vDate.setHours(0, 0, 0, 0);
                                index = dates.findIndex(d => d.getTime() === vDate.getTime());
                            }
                            if (index !== -1) chart1Data[index]++;
                        });
                    }
                }

                // Applied Jobs
                if (!target || target === "chart2") {
                    const applications = await db.collection("jobapplication").find({
                        jobseekerId: { $in: [jobseeker._id, jobseeker._id.toString()] },
                        appliedAt: { $gte: startPeriod, $lte: endPeriod }
                    }).toArray();

                    applications.forEach(app => {
                        const appDate = new Date(app.appliedAt);
                        let index = -1;
                        if (filter === "year") {
                            index = dates.findIndex(d => d.getMonth() === appDate.getMonth() && d.getFullYear() === appDate.getFullYear());
                        } else {
                            appDate.setHours(0, 0, 0, 0);
                            index = dates.findIndex(d => d.getTime() === appDate.getTime());
                        }
                        if (index !== -1) chart2Data[index]++;
                    });
                }
            }


        } else if (role === "recruiter") {
            // Recruiter: Applications (Chart 1) & Job Posts (Chart 2)
            console.log("Fetching for Recruiter View. UserId:", userId);

            // Try to find recruiter by _id or userId
            const query = {
                $or: []
            };

            if (ObjectId.isValid(userId)) {
                query.$or.push({ _id: new ObjectId(userId) });
                query.$or.push({ userId: new ObjectId(userId) });
            }

            if (query.$or.length === 0) {
                console.log("Invalid User ID format for Recruiter lookup");
                return NextResponse.json({
                    labels: [], chart1: [], chart2: []
                }, { status: 200 });
            }

            const recruiter = await db.collection("recruiters").findOne(query);

            if (recruiter) {
                console.log("Recruiter found:", recruiter._id);
                console.log("Date Range:", startPeriod, "to", endPeriod);

                if (!target || target === "chart1") {
                    const applications = await db.collection("jobapplication").find({
                        recruiterId: { $in: [recruiter._id, recruiter._id.toString()] },
                        appliedAt: { $gte: startPeriod, $lte: endPeriod }
                    }).toArray();
                    console.log("Applications found:", applications.length);

                    applications.forEach(app => {
                        const appDate = new Date(app.appliedAt);
                        let index = -1;
                        if (filter === "year") {
                            index = dates.findIndex(d => d.getMonth() === appDate.getMonth() && d.getFullYear() === appDate.getFullYear());
                        } else {
                            appDate.setHours(0, 0, 0, 0);
                            index = dates.findIndex(d => d.getTime() === appDate.getTime());
                        }
                        if (index !== -1) chart1Data[index]++;
                    });
                }

                if (!target || target === "chart2") {
                    const jobs = await db.collection("jobs").find({
                        recruiterId: { $in: [recruiter._id, recruiter._id.toString()] },
                        createdAt: { $gte: startPeriod, $lte: endPeriod }
                    }).toArray();
                    console.log("Jobs found:", jobs.length);

                    jobs.forEach(job => {
                        const jobDate = new Date(job.createdAt);
                        let index = -1;
                        if (filter === "year") {
                            index = dates.findIndex(d => d.getMonth() === jobDate.getMonth() && d.getFullYear() === jobDate.getFullYear());
                        } else {
                            jobDate.setHours(0, 0, 0, 0);
                            index = dates.findIndex(d => d.getTime() === jobDate.getTime());
                        }
                        if (index !== -1) chart2Data[index]++;
                    });
                }
            } else {
                console.log("Recruiter NOT found for ID:", userId);
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
