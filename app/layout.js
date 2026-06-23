import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "./Providers";
import NavBar from "@/components/headerWrapper";
import Footer from "@/components/footerWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Skill Careers - Job Recruitment Portal",
  description:
    "Skill Careers connects job seekers, recruiters, and assessors through innovative digital solutions. Find your dream job or top talent in Sri Lanka.",
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning={true}
        >
          <AuthProvider>
            <NavBar />
            {children}
            <Footer />
          </AuthProvider>
        </body>
      </html>
    </>
  );
}
