'use client';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

// Types
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

// Styles
const arrowBtnClass = 'text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors';

export function Pagination({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
  const showPageNav = totalPages > 1;

  const pages: (number | string)[] = [];
  if (showPageNav) {
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
  }

  return (
    <div className="flex items-center justify-end gap-4 py-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      {showPageNav && (
        <>
          <div className="h-5 w-px bg-gray-300" />

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
        </>
      )}
    </div>
  );
}
