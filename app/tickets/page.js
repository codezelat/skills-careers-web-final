"use client";
import Footer from "@/components/Footer";
import TicketsCard from "@/components/ticketsCard";
import RecruiterLoading from "@/components/RecruiterLoading";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

export default function TicketsPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState([]);

  const fetchTicketsWithRecruiters = useCallback(async () => {
    try {
      // Fetch tickets
      const ticketsResponse = await fetch("/api/ticket/all?published=true");
      const ticketsData = await ticketsResponse.json();

      if (!ticketsResponse.ok) throw new Error("Failed to fetch tickets");

      // Fetch recruiter details for each ticket
      const ticketsWithRecruiters = await Promise.all(
        ticketsData.tickets.map(async (ticket) => {
          try {
            const recruiterResponse = await fetch(
              `/api/recruiterdetails/get?id=${ticket.recruiterId}`
            );
            const recruiterData = await recruiterResponse.json();
            return { ...ticket, recruiter: recruiterData };
          } catch (error) {
            //   console.error(`Error fetching recruiter for ticket ${ticket._id}:`, error);
            return { ...ticket, recruiter: null };
          }
        })
      );

      setTickets(ticketsWithRecruiters);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTicketsWithRecruiters();
  }, [fetchTicketsWithRecruiters]);

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

          <div className="w-full pt-20">
            {isLoading ? (
              <RecruiterLoading />
            ) : tickets.length > 0 ? (
              tickets.map((ticket) => (
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
