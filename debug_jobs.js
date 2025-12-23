const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function checkRecentJobs() {
    let uri = process.env.MONGODB_URI;

    if (!uri) {
        try {
            const envPath = path.join(__dirname, '.env');
            if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, 'utf8');
                const match = envContent.match(/MONGODB_URI=(.*)/);
                if (match && match[1]) {
                    uri = match[1].trim();
                    // Remove quotes if present
                    if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
                        uri = uri.slice(1, -1);
                    }
                }
            }
        } catch (e) {
            console.error("Error reading .env:", e);
        }
    }

    if (!uri) {
        console.error("MONGODB_URI not found in environment or .env file");
        return;
    }

    console.log("Connecting to DB...");
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();

        // Get last 5 jobs
        const jobs = await db.collection('jobs')
            .find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        console.log("--- Recent Jobs ---");
        jobs.forEach(job => {
            console.log(`Job: ${job.jobTitle}`);
            console.log(`ID: ${job._id}`);
            console.log(`RecruiterID: ${job.recruiterId}`);
            console.log(`isPublished: ${job.isPublished} (Type: ${typeof job.isPublished})`);
            console.log(`Created At: ${job.createdAt}`);
            console.log("-------------------");
        });

        // Simulate Public API Query
        const publicJobs = await db.collection('jobs')
            .find({ isPublished: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        console.log("\n--- PUBLIC VISIBLE JOBS (isPublished: true) ---");
        publicJobs.forEach(job => {
            console.log(`Job: ${job.jobTitle} (ID: ${job._id})`);
        });
        console.log("----------------------------------------------");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

checkRecentJobs();
