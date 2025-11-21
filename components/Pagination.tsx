"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps{
    currentPage: number;
    totalPages: number;
    setPage: (page:number) => void;
}

const Pagination = ({ currentPage, totalPages, setPage }: PaginationProps) => {
  // Generate page numbers to show
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 1) return [1];
    
    if (totalPages <= 7) {
      // If 7 or fewer pages, show all
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    if (currentPage <= 4) {
      // Near the beginning: 1, 2, 3, 4, 5, ..., last
      for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
        pages.push(i);
      }
      if (totalPages > 6) {
        pages.push('...');
      }
      if (totalPages > 5) {
        pages.push(totalPages);
      }
    } else if (currentPage >= totalPages - 3) {
      // Near the end: 1, ..., last-4, last-3, last-2, last-1, last
      if (totalPages > 6) {
        pages.push('...');
      }
      for (let i = Math.max(2, totalPages - 4); i <= totalPages; i++) {
        if (i !== 1) { // Don't duplicate page 1
          pages.push(i);
        }
      }
    } else {
      // In the middle: 1, ..., current-1, current, current+1, ..., last
      pages.push('...');
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center mt-8 gap-2">
      {/* Previous Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => setPage(currentPage - 1)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray rounded-lg border border-border bg-card hover:bg-border/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-card transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 mx-4">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`dots-${index}`} className="px-3 py-2 text-gray">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray hover:text-foreground hover:bg-border/30 border border-border"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => setPage(currentPage + 1)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray rounded-lg border border-border bg-card hover:bg-border/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-card transition-colors"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
