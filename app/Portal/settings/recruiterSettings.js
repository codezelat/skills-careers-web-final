"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PortalLoading from "../loading";
import Image from "next/image";
import CredentialsForm from "./credentialsEditForm";
import PasswordReset from "@/components/PortalComponents/passwordReset";
import Swal from "sweetalert2";

export default function RecruiterSettings() {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showCredentialsForm, setShowCredentialsForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userDetails, setUserDetails] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    profileImage: "",
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
        title: "Error",
        text: "File size should be less than 5MB",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please upload an image file",
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
        title: "Success",
        text: "Logo uploaded successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to upload image: ${error.message} `,
      });
    }
  };

  if (isLoading) {
    return <PortalLoading />;
  }

  return (
    <>
      <div className="bg-white rounded-3xl py-7 px-7">
        <div className="min-h-screen">
          {/* Edit Button */}
          <div className="flex flex-row items-center justify-between">
            <h1 className="font-bold text-xl">Settings</h1>
            <div className="bg-[#E8E8E8] rounded-full relative overflow-hidden flex flex-wrap items-center justify-end shadow-md w-12 h-12 mt-3 mr-3 z-0">
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

          <form className="mt-10">
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="User Name"
                    value={userDetails.firstName}
                    disabled
                    className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm font-medium px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="User Name"
                    value={userDetails.lastName}
                    disabled
                    className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm font-medium px-4 py-3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    disabled
                    value={userDetails.email}
                    className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm font-medium px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#001571]">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    disabled
                    value={userDetails.contactNumber}
                    className="mt-3 block w-full border border-[#B0B6D3] rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm font-medium px-4 py-3"
                  />
                </div>
              </div>
            </div>
          </form>

          <div className="flex flex-row w-full justify-end mt-10">
            <button
              onClick={() => setShowResetPassword(true)}
              className="py-2 px-4 rounded-xl bg-[#001571] text-white font-medium"
            >
              Reset Password
            </button>
          </div>

          {showCredentialsForm && (
            <CredentialsForm
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
        </div>
      </div>
    </>
  );
}
