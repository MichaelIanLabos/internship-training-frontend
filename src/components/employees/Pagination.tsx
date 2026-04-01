'use client';

// Types
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Styles
const arrowBtnClass = 'text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors';

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // State
  if (totalPages <= 1) return null;

  // Page number calculation
  const pages: (number | string)[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  // Render
  return (
    <div className="flex items-center justify-end gap-4 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={arrowBtnClass}
      >
        &lt;
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, idx) =>
          typeof page === 'string' ? (
            <span key={`ellipsis-${idx}`} className="px-1.5 text-sm text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-violet-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={arrowBtnClass}
      >
        &gt;
      </button>

    </div>
  );
}
