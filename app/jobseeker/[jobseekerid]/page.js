import JobseekerProfile from "../jobseekerProfile";

async function JobSeekerProfilePage({ params }) {
  const jobseekerid = (await params).jobseekerid;
  return (
    <div>
      <JobseekerProfile slug={jobseekerid}/>
    </div>
  );
}

export default JobSeekerProfilePage;
