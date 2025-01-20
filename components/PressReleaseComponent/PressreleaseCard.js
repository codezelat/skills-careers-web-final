import { formatDate } from "@/handlers";
import Image from "next/image";

function PressreleaseCard({ pressrelease, onViewPressrelease }) {
  const handleViewPressrelease = () => {
    onViewPressrelease?.();
  };

  const date = formatDate(pressrelease.createdAt);

  return (
    <div
      onClick={handleViewPressrelease}
      className="relative bg-white rounded-lg shadow-md w-70"
    >
      {/* Main Image */}
      <div className="relative w-full h-48">
        <Image
          alt={pressrelease.title}
          src={pressrelease.image}
          className="rounded-t-lg"
          layout="fill"
          objectFit="cover"
        />
        {/* Action Icons */}
        <div className="absolute top-2 right-2 flex space-x-2">
          <button className=" rounded-full shadow-md">
            <Image
              src="/images/miyuri_img/editiconwhite.png"
              alt="Edit Icon"
              width={30}
              height={16}
            />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md">
            <Image
              src="/images/miyuri_img/trashblue.png"
              alt="Delete Icon"
              width={16}
              height={16}
            />
          </button>
        </div>
      </div>

      {/* Text Content */}
      <div className="mt-4">
        <h3 className="text-md font-medium text-gray-800 px-5 mb-3">
          {pressrelease.title}
        </h3>
        <p className="text-sm text-gray-500  px-5 mb-2"> {date}</p>
      </div>
    </div>
  );
}
export default PressreleaseCard;
