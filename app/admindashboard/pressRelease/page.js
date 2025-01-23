"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AdminNavBar from "../AdminNav";
import { useRouter } from "next/navigation";
import { handleCloseForm, handleOpenForm } from "@/handlers";
import AddPressrelease from "./AddPressrelease";
import PressreleaseCard from "../../../components/PressreleaseCard";

function PressReleases() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState("pressreleases");

  const [pressreleases, setPressreleases] = useState([]); // Original Pressreleases
  const [filteredPressreleases, setFilteredPressreleases] = useState([]);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedPressrelease, setSelectedPressrelease] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin");
    }
  });
  const fetchPressreleases = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/pressrelease/all");

      if (!response.ok) {
        throw new Error("Failed to fetch Pressreleases.");
      }

      const data = await response.json();
      setPressreleases(data.pressreleases);
      setFilteredPressreleases(data.pressreleases);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([fetchPressreleases()]);
    };
    fetchAllData();
    const intervalId = setInterval(fetchAllData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handlePressreleaseSelect = (pressrelease) => {
    setSelectedPressrelease(pressrelease);
  };

  const handleClosePressrelease = () => {
    setSelectedPressrelease(null);
  };

  return (
    <div className="p-4">
      {/* Title Bar */}
      <div className="h-[10vh] flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Press Releases</h1>
        <input
          type="search"
          placeholder="Search by pressrelease name"
          className="px-2 py-2 w-96 text-center bg-slate-100 border-solid border-2 border-slate-100 outline-none rounded-lg"
        />
        <p className="text-purple-600 font-semibold">
          {session?.user?.name} | {session?.user?.email}
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-purple-600 font-semibold">
                Press Release
              </h2>
              <button
                onClick={handleOpenForm(setIsFormVisible)}
                className="px-4 py-2 bg-purple-600 border-2 border-purple-600 text-white font-semibold hover:border-purple-600 hover:bg-white hover:text-purple-600 rounded transition-colors"
              >
                Add New Press Release
              </button>
              {isFormVisible && (
                <AddPressrelease onClose={handleCloseForm(setIsFormVisible)} />
              )}
            </div>

            <div className="grid gap-4 grid-cols-4">
              {filteredPressreleases.length > 0 ? (
                filteredPressreleases
                  .map((pressrelease, index) => (
                    <PressreleaseCard
                      key={index}
                      pressrelease={pressrelease}
                      onViewPressrelease={() =>
                        handlePressreleaseSelect(pressrelease)
                      }
                    />
                  ))
                  .reverse()
              ) : (
                <p className="col-span-4 text-lg text-center font-bold text-red-500 py-20">
                  No pressreleases found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PressReleases;