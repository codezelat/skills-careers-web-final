"use client";
import Footer from "@/components/Footer";
import TicketsCard from "@/components/ticketsCard";
import RecruiterLoading from "@/components/RecruiterLoading";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

import { IoSearchSharp } from "react-icons/io5";

export default function TicketsPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const fetchTicketsWithRecruiters = useCallback(async () => {
    try {
      // Fetch tickets
      const ticketsResponse = await fetch("/api/ticket/all?published=true");

      if (!ticketsResponse.ok) throw new Error("Failed to fetch tickets");

      const ticketsData = await ticketsResponse.json();
      const ticketsArray = ticketsData.tickets || [];

      // Get unique recruiter IDs
      const recruiterIds = [
        ...new Set(
          ticketsArray.map((ticket) => ticket.recruiterId).filter(Boolean)
        ),
      ];

      // Batch fetch all recruiter details in one request
      const recruiterMap = {};
      if (recruiterIds.length > 0) {
        try {
          const recruiterResponse = await fetch("/api/recruiterdetails/batch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: recruiterIds }),
          });

          if (recruiterResponse.ok) {
            const { recruiters } = await recruiterResponse.json();
            Object.assign(recruiterMap, recruiters);
          }
        } catch (err) {
          console.error("Error fetching recruiters:", err);
        }
      }

      // Map tickets with recruiter details
      const ticketsWithRecruiters = ticketsArray.map((ticket) => {
        const recruiterData = recruiterMap[ticket.recruiterId];
        return { ...ticket, recruiter: recruiterData || null };
      });

      setTickets(ticketsWithRecruiters);
      setFilteredTickets(ticketsWithRecruiters);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTickets([]);
      setFilteredTickets([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTicketsWithRecruiters();
  }, [fetchTicketsWithRecruiters]);

  useEffect(() => {
    let result = tickets;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (ticket) =>
          ticket.name?.toLowerCase().includes(lowerQuery) ||
          ticket.location?.toLowerCase().includes(lowerQuery) ||
          ticket.description?.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedDate) {
      result = result.filter((ticket) => ticket.date === selectedDate);
    }

    setFilteredTickets(result);
  }, [searchQuery, selectedDate, tickets]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <div className="bg-[#F5F5F5] w-full flex justify-center z-0">
        <div className="h-screen w-full absolute bg-white z-[1]">
          <Image
            src="/images/bg.jpg"
            alt="Background Image"
            fill
            style={{ objectFit: "contain", objectPosition: "right top" }}
            quality={100}
            priority
            className="w-full h-full opacity-5"
          />
        </div>
        <div className="z-[2] min-h-screen w-full max-w-[1280px] mx-auto px-[20px] xl:px-[0px] space-y-5 py-16">
          <div className="mb-8 sm:justify-center">
            <h1 className="text-4xl font-bold text-[#8A93BE] mt-28">
              Book Your{" "}
              <span className="font-bold text-[#001571]">Perfect </span>
              Experience.
            </h1>
          </div>

          <div className="bg-[#e6e8f1] p-2 rounded-xl shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Icon & Input */}
              <div className="flex items-center flex-grow w-full md:w-auto px-4">
                <IoSearchSharp
                  size={20}
                  className="text-[#001571] min-w-[20px]"
                />
                <input
                  type="text"
                  placeholder="Search by event name, location..."
                  className="bg-transparent text-[#001571] text-base font-semibold flex-grow pl-4 py-3 focus:outline-none placeholder-[#8A93BE] w-full"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>

              {/* Divider (Hidden on Mobile) */}
              <div className="hidden md:block w-[1px] h-8 bg-[#B0B6D3]"></div>

              {/* Date Input */}
              <div className="w-full md:w-auto px-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-[#001571] font-semibold text-base focus:outline-none w-full md:w-auto cursor-pointer"
                />
              </div>

              {/* Search Button */}
              <button className="bg-[#001571] text-white px-8 py-3 rounded-lg font-bold text-sm hover:bg-[#001571]/90 transition-colors w-full md:w-auto shadow-md">
                Search
              </button>
            </div>
          </div>



          <div className="w-full pt-10">
            {isLoading ? (
              <RecruiterLoading />
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <TicketsCard
                  key={ticket._id}
                  ticket={ticket}
                  fetchTickets={fetchTicketsWithRecruiters}
                />
              ))
            ) : (
              <p className="text-lg text-center font-bold py-20">
                No upcoming events found.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
