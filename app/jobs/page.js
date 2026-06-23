import JobsClient from "@/components/StartingPageComponents/JobsClient";

export const metadata = {
  title: "Explore Jobs - Skill Careers",
  description:
    "Search and apply for jobs across Sri Lanka. Find opportunities in IT, engineering, finance, healthcare, and more on Skill Careers.",
};

function Jobs() {
  return (
    <>
      <JobsClient />
    </>
  );
}

export default Jobs;