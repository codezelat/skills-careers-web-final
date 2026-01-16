"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

function DeleteConfirmation({ slug, pressreleaseDetails, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/pressrelease/delete?id=${slug}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        // Show error SweetAlert
        Swal.fire({
          title: "Error!",
          text: "Failed to delete Press Release.",
          icon: "error",
          timer: 2000, // 2 seconds
          showConfirmButton: false, // Hide the OK button
        });
      } else {
        // Show success SweetAlert
        Swal.fire({
          title: "Success!",
          text: "Press Release deleted successfully.",
          icon: "success",
          timer: 2000, // 2 seconds
          showConfirmButton: false, // Hide the OK button
          willClose: () => {
            if (onSuccess) {
              onSuccess();
            } else {
              // Redirect after successful deletion
              router.push("/Portal/pressrelease/");
              window.location.reload();
            }
          },
        });
      }
      onClose();
    } catch (error) {
      console.error("Error deleting Press Release:", error);
      // Show error SweetAlert
      Swal.fire({
        title: "Error!",
        text: "Error deleting Press Release.",
        icon: "error",
        timer: 2000, // 2 seconds
        showConfirmButton: false, // Hide the OK button
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 p-8 bg-white rounded-xl shadow-xl text-center">
      <h3 className="text-base uppercase font-bold text-red-500 mb-4">
        Delete <span className="text-black">{pressreleaseDetails.title}</span>{" "}
        Press Release
      </h3>
      <p className="text-base text-red-500 font-semibold">
        Are you sure you want to delete permanently?
      </p>
      <p className="text-sm text-black text-center">You cannot restore back</p>
      <div className="flex gap-2 my-4 w-full">
        <button
          onClick={onClose}
          className="w-1/2 lg:w-1/2 px-8 py-2 md:px-8 lg:px-8 text-sm uppercase font-medium bg-white text-red-500 border-2 border-solid border-red-500 rounded-md hover:bg-red-500 hover:text-white hover:shadow-lg transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="w-1/2 lg:w-1/2 px-8 py-2 md:px-8 lg:px-8 text-sm uppercase font-medium bg-red-500 text-white border-2 border-solid border-red-500 rounded-md hover:bg-white hover:text-red-500 hover:shadow-md transition-all"
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
export default DeleteConfirmation;
