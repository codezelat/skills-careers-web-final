import { useState } from "react";
import { RiDeleteBinFill, RiEdit2Fill } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AnnoucementEdit from "@/app/Portal/annoucements/annoucementEdit";
import Swal from "sweetalert2"; // Import SweetAlert

export default function AnnoucementsCard(props, isSelected, onSelect, onViewAnnouncementDelete) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const [announcementDetails, setAnnouncementDetails] = useState({
    _id: "",
    announcementTitle: "",
    announcementDescription: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    _id,
    announcementTitle,
    announcementDescription,
    createdAt,
  } = props.announcement;

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/announcement/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcementDetails),
      });
      if (response.ok) {
        // Success SweetAlert popup with 1-second timer
        Swal.fire({
          icon: "success",
          title: "Annoucement updated successfully!",
          showConfirmButton: false,
          timer: 2000, // 1-second timer
        }).then(() => {
          // Close the form automatically after the popup
          onClose();
        });
      } else {
        // Error SweetAlert popup with 1-second timer
        Swal.fire({
          icon: "error",
          title: "Failed to update Annoucement.",
          showConfirmButton: false,
          timer: 2000, // 1-second timer
        });
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
      setShowApplicationForm(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setAnnouncementDetails({
      _id: props.announcement._id,
      announcementTitle: props.announcement.announcementTitle,
      announcementDescription: props.announcement.announcementDescription
    });
    setShowApplicationForm(true);
  };

  const handleViewDelete = () => {
    onViewAnnouncementDelete?.();
  };

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
              onClick={handleEditClick}
            >
              <span className="mr-2">
                <RiEdit2Fill size={20} />
              </span>
              <span>Edit</span>
            </button>
            <button
            onClick={handleViewDelete}
              className="flex items-center justify-center w-1/2 bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
              type="button"
            >
              <span className="mr-2">
                <RiDeleteBinFill size={20} />
              </span>
              Delete
            </button>
          </div>

          {/* Edit Form Popup */}
          {showApplicationForm && (
            <AnnoucementEdit
              announcementDetails={announcementDetails}
              onClose={() => setShowApplicationForm(false)}
              onSubmit={submitHandler}
              onInputChange={handleInputChange}
              isSubmitting={isSubmitting}
            />
          )}
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
  );
}