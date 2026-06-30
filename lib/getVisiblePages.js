/**
 * Returns an array of page numbers to display in pagination controls.
 * Uses ellipsis logic when totalPages exceeds maxVisible.
 *
 * @param {number} currentPage - The current active page (1-based)
 * @param {number} totalPages - Total number of pages
 * @param {number} maxVisible - Maximum number of page buttons to show (default 5)
 * @returns {Array<number|string>} - Array of page numbers and "..." strings
 */
export default function getVisiblePages(currentPage, totalPages, maxVisible = 5) {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const halfRange = Math.floor((maxVisible - 2) / 2); // Reserve spots for first/last

  let start = Math.max(2, currentPage - halfRange);
  let end = Math.min(totalPages - 1, currentPage + halfRange);

  // Adjust if we're near the edges
  if (currentPage <= halfRange + 2) {
    start = 2;
    end = maxVisible - 1;
  } else if (currentPage >= totalPages - halfRange - 1) {
    start = totalPages - maxVisible + 2;
    end = totalPages - 1;
  }

  // Always show first page
  pages.push(1);

  // Add ellipsis if needed before start
  if (start > 2) {
    pages.push("...");
  }

  // Add middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Add ellipsis if needed after end
  if (end < totalPages - 1) {
    pages.push("...");
  }

  // Always show last page
  pages.push(totalPages);

  return pages;
}
