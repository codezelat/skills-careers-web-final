import PressreleaseProfile from "../pressReleaseProfile";

async function PressreleaseProfilePage({ params }) {
  const id = (await params).id;
  return (
    <div>
      <PressreleaseProfile slug={id}/>
    </div>
  );
}

export default PressreleaseProfilePage;
