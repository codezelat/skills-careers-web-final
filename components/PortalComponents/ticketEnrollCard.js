import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { RiDeleteBinFill, RiEdit2Fill } from "react-icons/ri";
import { BsFillEyeFill } from "react-icons/bs";
import { useRouter } from "next/navigation";

function EnrollTicketsCard({ enrolledticket, onView }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isPublished, setIsPublished] = useState(enrolledticket.isPublished || false);

    const { eventName,eventLocation, name, email } = enrolledticket;

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
                    <div className="py-3 text-black font-semibold w-[27.333%]">
                        {name}
                    </div>
                    <div className="py-3 text-black font-semibold w-[15%]">
                        <button
                            onClick={() => onView(enrolledticket)} 
                            className="flex items-center justify-center w-1/2 bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800"
                        >
                            View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EnrollTicketsCard;