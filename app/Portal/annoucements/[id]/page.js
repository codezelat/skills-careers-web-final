import AnnoucementProfile from "../annoucementProfile";

async function AnnoucementProfilePage({ params }) {
  const id = (await params).id;
  return (
    <div>
      <AnnoucementProfile slug={id}/>
    </div>
  );
}

export default AnnoucementProfilePage;
