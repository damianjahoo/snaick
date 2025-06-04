import React from "react";
import type { PaginationMeta } from "../../types";

interface PaginationProps {
  meta: PaginationMeta;
  currentPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, currentPage, loading, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(meta.total / meta.limit);
  const canGoPrevious = currentPage > 1 && !loading;
  const canGoNext = meta.has_more && !loading;

  // Show page numbers only if there are 7 or fewer total pages
  const showPageNumbers = totalPages <= 7;

  const generatePageNumbers = () => {
    if (!showPageNumbers) return [];

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (!loading && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (meta.total <= meta.limit) {
    return null; // Don't show pagination if all items fit on one page
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white disabled:text-white/40 rounded-lg transition-colors disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-sm font-medium"
          aria-label="Poprzednia strona"
        >
          ← Poprzednia
        </button>

        {/* Page Numbers (only for small datasets) */}
        {showPageNumbers && (
          <div className="hidden sm:flex items-center gap-1 mx-4">
            {generatePageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                disabled={loading}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/50 ${
                  page === currentPage
                    ? "bg-blue-500/30 text-blue-200 border border-blue-400/50"
                    : "bg-white/10 hover:bg-white/20 text-white/80 hover:text-white"
                } disabled:cursor-not-allowed disabled:opacity-50`}
                aria-label={`Strona ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white disabled:text-white/40 rounded-lg transition-colors disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-sm font-medium"
          aria-label="Następna strona"
        >
          Następna →
        </button>
      </div>

      {/* Page Info */}
      <div className="text-white/70 text-sm">
        <span className="font-medium text-white">{currentPage}</span>
        <span className="mx-1">z</span>
        <span className="font-medium text-white">{totalPages}</span>
        <span className="hidden sm:inline ml-2">
          ({meta.total} {meta.total === 1 ? "element" : meta.total < 5 ? "elementy" : "elementów"})
        </span>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center gap-2 text-blue-200/80 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-200"></div>
          <span>Ładowanie...</span>
        </div>
      )}
    </div>
  );
}
