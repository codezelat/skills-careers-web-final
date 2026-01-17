import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { RiDeleteBinFill, RiEdit2Fill } from "react-icons/ri";
import { BsFillEyeFill } from "react-icons/bs";
import { useRouter } from "next/navigation";

function EnrollTicketsCard({ enrolledticket, onView, onDelete }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(
    enrolledticket.isPublished || false
  );

  const { eventName, eventLocation, name, email, candidateDeleted } =
    enrolledticket;

  return (
    <div className="gap-1 bg-white rounded-lg hover:shadow-md">
      <div className="w-full items-center">
        <div className="text-gray-700 hover:bg-gray-50 border-b text-sm flex items-center">
          <div className="py-3 text-black font-semibold w-[3%]"></div>
          <div className="py-3 text-black font-semibold w-[27.333%]">
            {eventName}
          </div>
          <div className="py-3 text-black font-semibold w-[27.333%]">
            {eventLocation}
          </div>
          <div className="py-3 font-semibold w-[27.333%]">
            {candidateDeleted ? (
              <span className="text-gray-500 italic">Deleted Account</span>
            ) : (
              <span className="text-black">{name}</span>
            )}
          </div>
          <div className="py-3 text-black font-semibold w-[15%] flex gap-2">
            <button
              onClick={() => onView(enrolledticket)}
              className="flex items-center justify-center w-1/2 bg-[#001571] text-white px-2 py-2 rounded-lg shadow hover:bg-blue-800"
            >
              View
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(enrolledticket._id)}
                className="flex items-center justify-center bg-red-600 text-white px-2 py-2 rounded-lg shadow hover:bg-red-800"
              >
                <RiDeleteBinFill size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnrollTicketsCard;
