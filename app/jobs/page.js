// app/jobs/page.js
import JobsClient from "./jobsClient";

// Fetch jobs and recruiter data with revalidation
async function getJobs() {
  const jobsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/job/all`,
    {
      method: "GET",
      cache: "no-store", // Prevent caching
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );

  if (!jobsResponse.ok) {
    throw new Error("Failed to fetch jobs.");
  }

  const jobsData = await jobsResponse.json();
  const jobs = jobsData.jobs;

  const jobsWithRecruiterDetails = await Promise.all(
    jobs.map(async (job) => {
      try {
        const recruiterResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/recruiterdetails/get?id=${job.recruiterId}`,
          {
            method: "GET",
            cache: "no-store", // Prevent caching
            headers: {
              "Cache-Control":
                "no-store, no-cache, must-revalidate, proxy-revalidate",
            },
          }
        );

        if (!recruiterResponse.ok) {
          return {
            ...job,
            industry: "Unknown",
            recruiterName: "Unknown",
            logo: "/images/default-image.jpg",
          };
        }

        const recruiterData = await recruiterResponse.json();
        return {
          ...job,
          industry: recruiterData.industry || "Unknown",
          recruiterName: recruiterData.recruiterName || "Unknown",
          logo: recruiterData.logo || "/images/default-image.jpg",
        };
      } catch (error) {
        return {
          ...job,
          industry: "Unknown",
          recruiterName: "Unknown",
          logo: "/images/default-image.jpg",
        };
      }
    })
  );

  return jobsWithRecruiterDetails;
}

export default async function JobsPage() {
  const jobs = await getJobs(); // Fetch data on the server

  return <JobsClient initialJobs={jobs} />;
}
