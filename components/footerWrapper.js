"use client"; 

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/Portal") || 
    pathname === "/login" || 
    pathname === "/register" ||
    pathname === "/resetPassword"
  ) {
    return null;
  }

  return <Footer/>;
}