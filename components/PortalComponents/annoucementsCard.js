import { useState } from "react";
import { RiDeleteBinFill, RiEdit2Fill } from "react-icons/ri";
import { useSession } from "next-auth/react";

export default function AnnoucementsCard(props, isSelected, onSelect) {

    const { data: session, status } = useSession();

    const {
        _id,
        announcementTitle,
        announcementDescription,
        createdAt,
    } = props.announcement;

    const handleViewAnnouncement = () => {
        onViewAnnouncement?.();
    };

    const handleViewDelete = () => {
        onViewAnnouncementDelete?.();
    };

    const [isDeleting, setIsDeleting] = useState(false);

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

    return (
        <>
            {/* if admin */}
            {session?.user?.role === "admin" && (
                <div className="py-4 rounded-lg transition-shadow border-b border-gray-200 flex items-center text-sm font-semibold">
                    {/* Checkbox */}
                    <div className="flex items-center px-4 py-3 w-[3%]">
                        <input
                            type="checkbox"
                            className="form-checkbox text-[#001571] border-gray-300 rounded"
                            checked={isSelected}
                            onChange={(e) => onSelect(e.target.checked)}
                        />
                    </div>
                    {/* title */}
                    <div className="px-4 py-3 font-semibold w-[32.33%] flex items-center">{announcementTitle}</div>
                    {/* date */}
                    <div className="px-4 py-3 font-semibold w-[32.33%] flex items-center">{postedDate}</div>
                    {/* Actions */}
                    <div className="py-3 flex gap-2 ml-auto justify-end w-[32.33%] items-center">
                        <button
                            className="flex items-center justify-center w-1/2 bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800"
                            onClick={() => setShowRecruiter(true)}
                        >
                            <span className="mr-2">
                                <RiEdit2Fill size={20} />
                            </span>
                            <span>Edit</span>
                        </button>
                        <button
                            className="flex items-center justify-center w-1/2 bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
                            type="button"
                            onClick={handleViewDelete}
                        >
                            <span className="mr-2">
                                <RiDeleteBinFill size={20} />
                            </span>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                    {/* Edit Profile Form Popup */}
                    {/* {showRecruiter && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                            <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
                                <RecruiterProfile onClose={() => setShowRecruiter(false)} />
                            </div>
                        </div>
                    )} */}
                </div>
            )}

            {/* if other */}
            {session?.user?.role !== "admin" && (
                <div className="flex flex-col bg-[#E6E8F1] w-full py-5 px-7 gap-5 rounded-2xl">
                    <h1 className="font-bold text-base">{announcementTitle}</h1>
                    <p className="font-semibold text-sm">{announcementDescription}</p>
                    <p className="font-semibold text-xs">{postedDate}</p>
                </div>
            )}
        </>
    )
}