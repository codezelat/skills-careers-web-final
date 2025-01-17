import {formData} from "@/handlers";

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

  const date = formData(announcement.createdAt);
  return (
    <div className="grid grid-cols-12 items-center gap-2 p-4 bg-white rounded-md hover:shadow-md transition-all">
      <h1 className="col-span-6">{announcement.announcementTitle}</h1>
      <p className="col-span-3">{date}</p>
      <div className="flex gap-2 col-span-3 justify-end">
        <button
          onClick={handleViewAnnouncement}
          className="px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleViewDelete}
          className="px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
export default AnnouncementCard;
