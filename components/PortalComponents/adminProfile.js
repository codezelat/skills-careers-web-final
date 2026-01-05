"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PortalLoading from "@/app/Portal/loading";
import AdminEditForm from "@/app/Portal/profile/adminEditForm";
import PasswordReset from "./passwordReset";
import Swal from "sweetalert2";

export default function AdminProfile() {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCredentialsForm, setShowCredentialsForm] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [userDetails, setUserDetails] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    profileImage: "",
    createdAt: "",
  });

  useEffect(() => {
    if (session?.user?.email) {
      const fetchDetails = async () => {
        try {
          const userResponse = await fetch(
            `/api/users/get?id=${session.user.id}`
          );
          const userData = await userResponse.json();

          if (!userResponse.ok) {
            throw new Error(userData.message || "Failed to fetch user details");
          }

          setUserDetails(userData.user);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDetails();
    }
  }, [session]);

  // Recruiter credentials details update
  const credSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setShowCredentialsForm(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Update failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input Change Handler
  const handleCredInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // image updae functions
  const handleImageChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "File size should be less than 5MB.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please upload an image file.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("email", userDetails.email);

      console.log("Starting image upload...");
      const response = await fetch("/api/users/uploadimage", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      console.log("Upload successful:", data);
      setUserDetails((prev) => ({
        ...prev,
        profileImage: data.imageUrl,
      }));

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Profile image uploaded successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      // Force session refresh
      window.dispatchEvent(new Event("visibilitychange"));
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "Failed to upload image.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const date = new Date(userDetails.createdAt).getDate();
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
  const d = new Date(userDetails.createdAt);
  let month = monthName[d.getMonth()];
  const year = new Date(userDetails.createdAt).getFullYear();
  const postedDate = `${date} ${month} ${year}`;

  if (isLoading) {
    return <PortalLoading />;
  }

  return (
    <>
      <div className="bg-white rounded-3xl pt-5 pb-5 px-7">
        <div className="flex flex-row items-center justify-between">
          <h1 className="font-bold text-xl">My Profile</h1>
          <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-end shadow-md w-12 h-12 mr-3 z-0">
            <button
              onClick={() => setShowCredentialsForm(true)}
              className="text-white px-3 py-2 sm:px-4 rounded-md z-10"
            >
              <div className="flex gap-2">
                <Image
                  src="/editiconwhite.png"
                  alt="Edit Icon"
                  fill
                  style={{ objectFit: "contain" }}
                  quality={100}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Profile Image */}
        <div className="relative flex flex-row justify-between">
          {/* DP Image */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-[180px] lg:h-[180px] mt-10 flex items-top justify-center relative">
            {/* Profile picture container */}
            <div className="relative border-4 border-[#001571] bg-white rounded-full overflow-hidden w-24 h-24 sm:w-28 sm:h-28 lg:w-[180px] lg:h-[180px]">
              {userDetails.profileImage ? (
                <Image
                  src={userDetails.profileImage}
                  alt="Profile"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  quality={100}
                  className="fill"
                />
              ) : (
                <Image
                  src="/default-avatar.jpg"
                  alt="Profile"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                  quality={100}
                  className="fill"
                />
              )}
            </div>

            {/* Profile picture edit icon */}
            <div className="absolute top-0 right-0 w-12 h-12 rounded-full flex items-center justify-center shadow-md z-0 bg-white">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="logo-image-input"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              {/* Edit Icon */}
              <Image
                src="/editiconwhite.png"
                alt="Edit Icon"
                width={40}
                height={40}
                quality={100}
              />
            </div>
          </div>
        </div>

        <div className="w-full h-auto flex flex-row gap-5 text-base font-bold mt-20">
          <div className="w-1/2 flex flex-col gap-3">
            <h1 className="text-[#001571]">First Name</h1>
            <input
              type="text"
              value={session.user.firstName || ""}
              disabled
              className="px-4 py-2 w-full border-solid border-[1px] border-[#B0B6D3] rounded-xl font-semibold"
            />
          </div>
          <div className="w-1/2 flex flex-col gap-3">
            <h1 className="text-[#001571]">Last Name</h1>
            <input
              type="text"
              value={session.user.lastName || ""}
              disabled
              className="px-4 py-2 w-full border-solid border-[1px] border-[#B0B6D3] rounded-xl font-semibold"
            />
          </div>
        </div>

        <div className="w-full h-auto flex flex-row gap-5 text-base font-bold mt-8">
          <div className="w-1/2 flex flex-col gap-3">
            <h1 className="text-[#001571]">Email</h1>
            <input
              type="text"
              value={session.user.email || ""}
              disabled
              className="px-4 py-2 w-full border-solid border-[1px] border-[#B0B6D3] rounded-xl font-semibold"
            />
          </div>
          <div className="w-1/2 flex flex-col gap-3">
            <h1 className="text-[#001571]">Contact Number</h1>
            <input
              type="text"
              value={userDetails.contactNumber || ""}
              disabled
              className="px-4 py-2 w-full border-solid border-[1px] border-[#B0B6D3] rounded-xl font-semibold"
            />
          </div>
        </div>

        <div className="w-full h-auto flex flex-row gap-5 text-base font-bold mt-8">
          <div className="w-full flex flex-col gap-3">
            <h1 className="text-[#001571]">Account Creation Date</h1>
            <input
              type="text"
              value={postedDate || ""}
              disabled
              className="px-4 py-2 w-full border-solid border-[1px] border-[#B0B6D3] rounded-xl font-semibold"
            />
          </div>
        </div>

        <div className="flex flex-row w-full justify-end mt-10">
          <button
            onClick={() => setShowResetPassword(true)}
            className="py-2 px-4 rounded-xl bg-[#001571] text-white font-medium"
          >
            Reset Password
          </button>
        </div>
      </div>

      {showCredentialsForm && (
        <AdminEditForm
          userDetails={userDetails}
          isSubmitting={isSubmitting}
          onClose={() => setShowCredentialsForm(false)}
          onSubmit={credSubmitHandler}
          onInputChange={handleCredInputChange}
        />
      )}

      {showResetPassword && (
        <PasswordReset onClose={() => setShowResetPassword(false)} />
      )}
    </>
  );
}
