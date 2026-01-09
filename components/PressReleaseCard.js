import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo } from "react";
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
    <div className="bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 rounded-2xl border border-gray-100 flex flex-col h-full group">
      <div className="flex justify-center mb-6 relative w-full h-48 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
        <Image
          src={image || "/images/default-image.jpg"}
          alt="Press Release Image"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#001571] shadow-sm">
          {postedDate}
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <h2
          className="text-xl font-bold text-[#001571] mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors"
          title={title}
        >
          {title}
        </h2>

        <p className="line-clamp-3 text-gray-600 text-sm mb-6 leading-relaxed">
          {description}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={handleViewPressRelease}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-[#001571] text-white text-sm font-bold rounded-xl shadow-md hover:bg-blue-800 hover:shadow-lg transition-all"
          >
            Read Full Story
          </button>
        </div>
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(PressReleaseCard, (prevProps, nextProps) => {
  return prevProps.release._id === nextProps.release._id;
});
