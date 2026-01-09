import RecruiterProfile from "../recruiterProfile";

async function RecruiterProfilePage({ params }) {
  const recruiterid = (await params).recruiterid;
  return (
    <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] py-8">
      <RecruiterProfile slug={recruiterid} />
    </div>
  );
}

export default RecruiterProfilePage;
