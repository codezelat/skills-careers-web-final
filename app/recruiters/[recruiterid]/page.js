import RecruiterProfile from "../recruiterProfile";

async function RecruiterProfilePage({ params }) {
  const recruiterid = (await params).recruiterid;
  return (
    <div>
      <RecruiterProfile slug={recruiterid}/>
    </div>
  );
}

export default RecruiterProfilePage;
