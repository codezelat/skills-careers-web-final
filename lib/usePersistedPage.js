"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * A useState hook for page numbers that persists to sessionStorage.
 * Restores the page when the user navigates back.
 *
 * @param {number} defaultPage - The default page number (usually 1)
 * @returns {[number, function]} - [currentPage, setCurrentPage]
 */
export default function usePersistedPage(defaultPage = 1) {
  const pathname = usePathname();
  const storageKey = `page:${pathname}`;

  const [page, setPage] = useState(() => {
    if (typeof window === "undefined") return defaultPage;
    try {
      const stored = sessionStorage.getItem(storageKey);
      return stored ? parseInt(stored, 10) || defaultPage : defaultPage;
    } catch {
      return defaultPage;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, page.toString());
    } catch {
      // sessionStorage may be unavailable
    }
  }, [page, storageKey]);

  return [page, setPage];
}
