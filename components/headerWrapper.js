"use client"; 

import { usePathname } from "next/navigation";
import NavBar from "./navBar";

export default function HeaderWrapper() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/Portal") || 
    pathname === "/login" || 
    pathname === "/register"
  ) {
    return null;
  }

  return <NavBar />;
}