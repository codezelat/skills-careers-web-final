import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { RiDeleteBinFill, RiEdit2Fill } from "react-icons/ri";
import { BsFillEyeFill } from "react-icons/bs";
import Swal from "sweetalert2";

export default function PortalRecruiterCard({ recruiter, onUpdate, onDelete }) {
  const router = useRouter();
  const { _id, recruiterName, email, contactNumber, logo, isRestricted } =
    recruiter;
  const [localRestricted, setLocalRestricted] = useState(isRestricted);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestricting, setIsRestricting] = useState(false);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalRestricted(isRestricted);
  }, [isRestricted]);

  const handleRestrictToggle = async () => {
    setIsRestricting(true);
    try {
      const response = await fetch(`/api/recruiterdetails/${_id}/restrict`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRestricted: !localRestricted }),
      });

      if (response.ok) {
        const { updatedRecruiter } = await response.json();
        setLocalRestricted(updatedRecruiter.isRestricted);
        onUpdate(updatedRecruiter);
      }
    } catch (error) {
      console.error("Error updating restriction status:", error);
    } finally {
      setIsRestricting(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this recruiter?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/recruiterdetails/delete?id=${_id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          onDelete(_id);
          Swal.fire("Deleted!", "Recruiter has been deleted.", "success");
        }
      } catch (error) {
        console.error("Error deleting recruiter:", error);
        Swal.fire("Error!", "Failed to delete recruiter.", "error");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="py-4 rounded-lg transition-shadow border-b border-gray-200 flex items-center text-sm font-semibold">
      <div className="flex items-center px-4 py-3 w-[3%]">
        <input
          type="checkbox"
          className="form-checkbox text-[#001571] border-gray-300 rounded"
        />
      </div>
      <div className="flex flex-row space-x-3 w-[24.25%] items-center pl-4">
        <Image
          src={logo || "/images/default-image.jpg"}
          alt="Recruiter Logo"
          width={40}
          height={40}
          className="rounded-full shadow-lg"
        />
        <div className="flex flex-col">
          <div>{recruiterName}</div>
          {localRestricted && (
            <span className="text-xs text-red-500 font-semibold italic mt-1">
              ⚠ Restricted
            </span>
          )}
        </div>
      </div>
      <div className="px-4 py-3 w-[24.25%]">{email}</div>
      <div className="px-4 py-3 w-[24.25%]">{contactNumber}</div>
      <div className="py-3 flex gap-2 ml-auto justify-end w-[24.25%] items-center">
        <button
          className="flex items-center justify-center w-1/2 bg-[#001571] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800"
          onClick={() => router.push(`/Portal/recruiter/${_id}`)}
        >
          <RiEdit2Fill size={20} className="mr-2" />
          Edit
        </button>
        <button
          className={`flex items-center justify-center w-1/2 text-white px-4 py-2 rounded-lg shadow ${
            localRestricted
              ? "bg-[#EC221F] hover:bg-red-700"
              : "bg-[#001571] hover:bg-blue-700"
          }`}
          onClick={handleRestrictToggle}
          disabled={isRestricting}
        >
          {isRestricting ? (
            "Processing..."
          ) : localRestricted ? (
            <>
              <BsFillEyeFill size={15} className="mr-2" />
              Unrestrict
            </>
          ) : (
            <>
              <BsFillEyeFill size={15} className="mr-2" />
              Restrict
            </>
          )}
        </button>
        {/*<button
          className="flex items-center justify-center w-1/2 bg-[#EC221F] text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <RiDeleteBinFill size={20} className="mr-2" />
          {isDeleting ? "Deleting..." : "Delete"}
        </button>*/}
      </div>
    </div>
  );
}
