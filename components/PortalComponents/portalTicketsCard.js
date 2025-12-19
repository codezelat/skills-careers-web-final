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
            const formData = new FormData();
            formData.append("_id", _id);
            formData.append("isPublished", String(!isPublished));

            const response = await fetch(`/api/ticket/update`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                setIsPublished(!isPublished);
            } else {
                console.error("Failed to update ticket status");
            }
        } catch (error) {
            console.error("Error updating ticket status:", error);
        }
        setIsLoading(false);
    };

    return (
        <tr className="hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors duration-200">
            <td className="py-4 px-4 align-middle">
                {/* Placeholder or Checkbox could go here */}
            </td>
            <td className="py-4 px-4 align-middle">
                <div className="font-semibold text-[#001571] truncate max-w-[200px]" title={name}>
                    {name}
                </div>
            </td>
            <td className="py-4 px-4 align-middle whitespace-nowrap text-gray-600 font-medium">
                {formatDate(date)}
            </td>
            <td className="py-4 px-4 align-middle">
                <div className="text-gray-600 truncate max-w-[150px]" title={location}>
                    {location}
                </div>
            </td>
            <td className="py-4 px-4 align-middle text-right">
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => onEdit(ticket)}
                        className="flex items-center justify-center bg-gray-100 text-[#001571] px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handlePublishToggle}
                        disabled={isLoading}
                        className={`flex items-center justify-center px-3 py-2 rounded-lg text-white font-medium text-sm transition-colors min-w-[100px] ${isPublished
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-[#001571] hover:bg-blue-800"
                            }`}
                    >
                        {isLoading ? "..." : isPublished ? "Unpublish" : "Publish"}
                    </button>
                    {/* onDelete prop might not be passed in Recruiter view based on previous file content, but just in case keeping it consistent if passed */}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(ticket)}
                            className="flex items-center justify-center bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}

export default PortalTicketsCard;