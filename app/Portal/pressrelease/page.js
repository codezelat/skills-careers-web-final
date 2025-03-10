import PressReleaseList from "./PressReleaseList";


async function getPressReleases() {
  try {const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pressrelease/all`);
    if (!response.ok) throw new Error('Failed to fetch press releases');
    const data = await response.json();
    return data.pressreleases;
  } catch (error) {
    console.error('Error fetching press releases:', error);
    return [];
  }
}
export default async function PressRelease() {
  const pressreleases = await getPressReleases();
  return <PressReleaseList initialPressreleases={pressreleases} />;
}