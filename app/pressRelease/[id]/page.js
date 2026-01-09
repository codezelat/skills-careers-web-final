import PressreleaseProfile from "../pressReleaseProfile";

async function PressreleaseProfilePage({ params }) {
  const id = (await params).id;
  return (
    <div className="w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] py-8">
      <PressreleaseProfile slug={id} />
    </div>
  );
}

export default PressreleaseProfilePage;
