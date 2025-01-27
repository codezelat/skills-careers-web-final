import RecruiterProfile from "../recruiterProfile";

async function RecruiterDetailsPage({ params }) {
  const id = (await params).id;
  return (
    <div>
      <RecruiterProfile slug={id}/>
    </div>
  );
}

export default RecruiterDetailsPage;
