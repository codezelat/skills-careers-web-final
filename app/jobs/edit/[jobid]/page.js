import EditJobForm from "./editjobform";


async function JobEditPage({ params }) {
  const jobId = (await params).jobid;
  return (
    <div>
      <EditJobForm jobId={jobId}/>
    </div>
  );
}

export default JobEditPage;
