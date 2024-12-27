import JobProfile from "../jobprofile";

async function JobDetailPage({ params }) {
  const jobid = (await params).jobid;
  return (
    <div>
      <JobProfile slug={jobid}/>
    </div>
  );
}

export default JobDetailPage;
