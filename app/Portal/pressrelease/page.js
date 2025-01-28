"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BsChevronLeft, BsChevronRight, BsPlus } from "react-icons/bs";
import { IoSearchSharp } from "react-icons/io5";
import PortalLoading from "../loading";
import PressReleaseCard from "@/components/PortalComponents/pressReleaseCard";
import AddPressrelease from "./AddPressrelease";

export default function PressRelease() {

    const router = useRouter();
    const { data: session, status } = useSession();
    const [activeSection, setActiveSection] = useState("pressreleases");
    const [showApplicationForm , setShowApplicationForm] = useState(false)
    const [pressreleases, setPressreleases] = useState([]); // Original Pressreleases
    const [filteredPressreleases, setFilteredPressreleases] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

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
        } catch (error) {
            setError(error.message);
        } finally {
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

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredPressreleases(
            pressreleases.filter(
                (pressrelease) =>
                    pressrelease.title.toLowerCase().includes(query)
            )
        );
    };

    // pagination function
    const [currentPage, setCurrentPage] = useState(1);
    const pressPerPage = 16;

    const totalPages = Math.ceil(filteredPressreleases.length / pressPerPage);

    const indexOfLastpress = currentPage * pressPerPage;
    const indexOfFirstpress = indexOfLastpress - pressPerPage;
    const currentpress = filteredPressreleases.slice(indexOfFirstpress, indexOfLastpress);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (isLoading) {
        return <PortalLoading />;
    }

    return (
        <>
            <div className="min-h-screen bg-white rounded-3xl py-5 px-7">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-[#001571]">Press Release</h1>

                    {session?.user?.role === "admin" && (
                    <button
                        className="bg-[#001571] text-white px-6 py-2 rounded-2xl shadow hover:bg-blue-800 flex items-center text-sm font-semibold"
                     onClick={() => setShowApplicationForm(true)}
                    >
                        <BsPlus size={25} className="mr-1" />Add New
                    </button>
                    )}
                </div>

                {showApplicationForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                  <div className="relative bg-white shadow-lg rounded-lg px-4 sm:px-6 w-full max-w-4xl">
                    <AddPressrelease
                      onClose={() => setShowApplicationForm(false)}
                    />
                  </div>
                </div>
              )}


                {/* search */}
                <div className="flex-grow mt-16">
                    <div className="bg-[#E6E8F1] flex items-center pl-10 pr-10 mb-5 py-4 rounded-2xl shadow-sm w-full">
                        <IoSearchSharp size={25} className="text-[#001571]" />
                        <input
                            type="text"
                            placeholder="Search Job Posts..."
                            className="ml-4 text-[#8A93BE] bg-[#E6E8F1] font-bold outline-none w-full"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className="grid gap-6 grid-cols-4 mt-10">
                    {currentpress.length > 0 ? (
                        currentpress
                            .map((pressrelease, index) => (
                                <PressReleaseCard
                                    key={index}
                                    pressrelease={pressrelease}
                                    onViewPressrelease={() =>
                                        handlePressreleaseSelect(pressrelease)
                                    }
                                />
                            ))
                            .reverse()
                    ) : (
                        <p className="text-lg text-center font-bold text-red-500 py-20">
                            No pressreleases found.
                        </p>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-4">
                    <nav className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-[10px] py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-400'}`}
                        >
                            <BsChevronLeft size={15} />
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-400'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-[10px] py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-400'}`}
                        >
                            <BsChevronRight size={15} />
                        </button>
                    </nav>
                </div>
            </div >
        </>
    )
}