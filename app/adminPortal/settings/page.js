"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavBar from "@/app/admindashboard/AdminNav";
import AdminSettings from "@/components/adminPortal/setting/adminSetting";

function Settings() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState("settings");

  const [adminDetails, setAdminDetails] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordResetting, setPasswordResetting] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  });

  const fetchAdminDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/get?id=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch Inquiries.");
      }
      const data = await response.json();
      setAdminDetails(data.admin);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  //   To refresh all data fetching every 60 seconds
  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([fetchAdminDetails()]);
    };
    fetchAllData();
    const intervalId = setInterval(fetchAllData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Handling input change
  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAdminDetails((prev) => ({ ...prev, [name]: value }));
  };

  // form submitting to update.
  const submitHandler = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const response = await fetch(`/api/admin/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminDetails),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Details updated successfully!");
      } else {
        alert(data.message || "Failed to update details.");
      }
    } catch (error) {
      console.error("Error updating User details:", error);
      alert("An error occurred while updating details.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setPasswordResetting(true);

    try {
      const response = await fetch(`/api/admin/update/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: adminDetails._id,
          oldPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");

        alert("Password updated successfully!!!");
      } else {
        alert("Failed to update password");
      }
    } catch (error) {
      console.error("Error updating Password:", error);
      alert("Error updating Password");
    } finally {
      setPasswordResetting(false);
    }
  };

  return (
    <div className="p-4">
      {/* Title Bar */}
      <div className="h-[10vh] flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <input
          type="search"
          placeholder="Search by inquiry name"
          className="px-2 py-2 w-96 text-center bg-slate-100 border-solid border-2 border-slate-100 outline-none rounded-lg"
        />
        <p className="text-purple-600 font-semibold">
          {session?.user?.firstName} {session?.user?.lastName} |{" "}
          {session?.user?.email}
        </p>
      </div>

      {/* Content */}
      <div className="h-[90vh] space-y-6">
        <div className="h-full grid lg:grid-cols-5 md:grid-cols-5 sm:grid-cols-1 lg:gap-4 md:gap-4 sm:gap-0">
          {/* Left Side Bar */}
          <div className="bg-slate-100 mb-4 p-6 rounded-lg shadow-md">
            <AdminNavBar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>

          {/* Center Contents */}
          <div className="lg:col-span-4 md:col-span-4 sm:col-span-1 bg-slate-100 mb-4 p-6 rounded-lg shadow-md">
            <AdminSettings />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Settings;
