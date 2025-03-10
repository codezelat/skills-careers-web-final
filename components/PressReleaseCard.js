import Image from "next/image";
import { useRouter } from "next/navigation";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function PressReleaseCard({ release }) {

  const router = useRouter();
  
  if (!release || Object.keys(release).length === 0) {
    return <div>Loading...</div>;
  }

  const { _id, createdAt, title, description, image } = release;

  const date = new Date(createdAt).getDate();
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date(createdAt);
  let month = monthName[d.getMonth()];
  const year = new Date(createdAt).getFullYear();
  const postedDate = `${date} ${month} ${year}`;

  const handleViewPressRelease = () => {
    router.push(`../pressRelease/${_id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-white hover:bg-[#CAD1F1] p-6 rounded-lg shadow-lg min-h-[65vh] flex flex-col">
      <div className="flex justify-center mb-8">
        {" "}
        <Image
          src={image || "/images/default-image.jpg"}
          alt="Press Release Image"
          width={200}
          height={180}
          className="rounded-lg object-cover"
        />
      </div>
      <h2 className="truncate text-xl font-bold text-[#001571] mb-1 text-left sm:text-left">
        {title}
      </h2>
      <p className="line-clamp-4 text-[#110d0d] text-md mb-4 text-justify sm:text-left">
        {description}
      </p>
      <div className="flex gap-4 flex-wrap justify-center mt-auto">
        <button
          onClick={handleViewPressRelease}
          className="flex border-2 border-[#001571] text-[#001571] px-3 py-2 rounded-lg font-bold hover:bg-blue-800 hover:text-white transition"
        >
          Read More
        </button>
      </div>

    </div>
  );
}

export default PressReleaseCard;
