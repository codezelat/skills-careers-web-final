import JobProfile from "../../jobProfile";


async function ApplicationProfilePage({ params }) {
  const jobId = (await params).jobId;
  return (
    <div>
      <JobProfile slug={jobId}/>
    </div>
  );
}

export default ApplicationProfilePage;
