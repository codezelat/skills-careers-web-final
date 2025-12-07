import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { RiDeleteBinFill, RiEdit2Fill } from "react-icons/ri";
import { BsFillEyeFill } from "react-icons/bs";
import { useRouter } from "next/navigation";

function PortalTicketsCard({ ticket, onEdit, onDelete }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isPublished, setIsPublished] = useState(ticket.isPublished || false);

    const { _id, createdAt, name, location, date } = ticket;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    };

    const handlePublishToggle = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/ticket/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id, isPublished: !isPublished }),
            });

            if (response.ok) {
                setIsPublished(!isPublished);
            }
        } catch (error) {
            console.error("Error updating ticket status:", error);
        }
        setIsLoading(false);
    };

    return (
        <div className="gap-1 bg-white rounded-lg hover:shadow-md">
            <div className="w-full items-center">
                <div className="text-gray-700 hover:bg-gray-50 border-b text-sm flex items-center">
                    <div className="py-3 text-black font-semibold w-[3%]"></div>
                    <div className="py-3 text-black font-semibold w-[24.25%]">
                        {name}
                    </div>
                    <div className="py-3 text-black font-semibold w-[24.25%]">
                        {formatDate(date)}
                    </div>
                    <div className="py-3 text-black font-semibold w-[24.25%]">
                        {location}
                    </div>
                    <div className="py-3 flex gap-2 ml-auto justify-end w-[24.25%]">
                        <button
                            onClick={() => onEdit(ticket)}
                            className="flex items-center justify-center bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800"
                        >
                            <RiEdit2Fill size={20} className="mr-2" />
                            Edit
                        </button>
                        <button
                            onClick={handlePublishToggle}
                            disabled={isLoading}
                            className={`flex items-center justify-center py-2 px-4 rounded-lg shadow ${isPublished
                                ? "bg-[#EC221F] hover:bg-red-700"
                                : "bg-[#001571] hover:bg-blue-700"
                                } text-white`}
                        >
                            <BsFillEyeFill size={15} className="mr-2" />
                            {isLoading ? "Loading..." : isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <button
                            onClick={() => onDelete(ticket)}
                            className="flex items-center justify-center bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
                        >
                            <RiDeleteBinFill size={20} className="mr-2" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PortalTicketsCard;