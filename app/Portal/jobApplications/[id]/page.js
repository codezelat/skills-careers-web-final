import CandidateProfile from "../candidateProfile";

async function ApplicationProfilePage({ params }) {
  const id = (await params).id;
  return (
    <div>
      <CandidateProfile slug={id}/>
    </div>
  );
}

export default ApplicationProfilePage;
