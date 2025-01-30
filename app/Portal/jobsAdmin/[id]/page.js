import JobProfile from "../JobProfile";

async function JobDetailsPage({ params }) {
  const id = (await params).id;
  return (
    <div>
      <JobProfile slug={id}/>
    </div>
  );
}

export default JobDetailsPage;
