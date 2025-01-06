'use client';

import ContactBanner from "@/components/ContactBanner";
import ContactSection from "@/components/ContactPortal";
import Footer from "@/components/Footer";
import NavBar from "@/components/navBar";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("@/components/LeafletMap"), {
    ssr: false,
});

function contactPage() {

    const position = [6.9271, 79.8612];

    return (
        <>
            <NavBar />
            {/* Upper Banner */}
            <div
                className="relative w-full md:flex sm:flex bg-cover bg-center h-80 sm:h-50"
                style={{ backgroundImage: "url('/images/contactUsBanner.png')" }}
            >
                {/* Content */}
                <div className="flex flex-col items-center justify-end bg-[#001571] bg-opacity-50 text-white h-full w-full pb-8">
                    <div className="w-[1280px]">
                        <h1 className="text-5xl font-bold mb-2 ">
                            Get In Touch With Us.
                        </h1>
                        <h2 className="font-normal mb-4 ">
                            We'd love to hear from you! Whether you have a question, feedback,
                            or just want to say hello,feel free to reach out to us.Our team is
                            hear to help you with anything you need.
                        </h2>
                    </div>
                </div>
            </div>
            <ContactBanner />
            <ContactSection/>
            {/* Map Section */}
            <div className="w-full h-[500px] flex flex-col items-center gap-3">
                <MapWithNoSSR />
            </div>{" "}
            <Footer />
        </>
    );
}

export default contactPage;