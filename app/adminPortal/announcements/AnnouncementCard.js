import { formatDate } from "@/handlers";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaPenToSquare } from "react-icons/fa6";

function AnnouncementCard({
  announcement,
  onViewAnnouncement,
  onViewAnnouncementDelete,
}) {
  const handleViewAnnouncement = () => {
    onViewAnnouncement?.();
  };

  const handleViewDelete = () => {
    onViewAnnouncementDelete?.();
  };

  const date = formatDate(announcement.createdAt);
  return (
      <div className="gap-1 bg-white rounded-lg hover:shadow-md">
        <div className="w-full">
          <div className="text-gray-700 hover:bg-gray-50 border-b text-sm flex">
            {/* First Column - Small */}
            <div className="px-4 py-3 w-[10%] flex items-center">
              <input type="checkbox" />
            </div>

            {/* Other Columns - Equal Width */}
            <div className="px-4 py-3 text-black font-semibold w-[30%] flex items-center">
              {announcement.announcementTitle}
            </div>
            <div className="px-4 py-3 text-black font-semibold w-[30%] flex items-center">
              {date}
            </div>
            <div className="px-4 py-3 flex gap-2 ml-auto justify-end w-[30%] items-center">
              <button className="flex bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800" onClick={handleViewAnnouncement}>
                <span className="mr-2">
                  <FaPenToSquare size={15} />
                </span>
                Edit Annoucement
              </button>
              <button className="flex bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"  onClick={handleViewDelete}>
                <span className="mr-2">
                  <RiDeleteBinFill size={20} />
                </span>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
export default AnnouncementCard;
