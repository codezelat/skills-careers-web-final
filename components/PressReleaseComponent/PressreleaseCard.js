import { formatDate } from "@/handlers";
import Image from "next/image";

function PressreleaseCard({ pressrelease, onViewPressrelease }) {
  const handleViewPressrelease = () => {
    onViewPressrelease?.();
  };

  const date = formatDate(pressrelease.createdAt);

  return (
    <div className="relative bg-white rounded-lg shadow-md w-70"
    onClick={handleViewPressrelease()}>
      {/* Main Image */}
      <div className="relative w-full h-48">
        <Image
          src={pressrelease.image}
          alt={pressrelease.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
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
         {pressrelease.description}
        </h3>
        <p className="text-sm text-gray-500  px-5 mb-2">{date}</p>
      </div>
    </div>
  );
}
export default PressreleaseCard;