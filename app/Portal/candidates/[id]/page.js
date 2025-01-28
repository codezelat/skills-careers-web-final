import CandidateProfile from "../candidateProfile";

async function CandidateProfilePage({ params }) {
  const id = (await params).id;
  return (
    <div>
      <CandidateProfile slug={id}/>
    </div>
  );
}

export default CandidateProfilePage;
