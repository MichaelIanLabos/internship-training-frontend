'use client';

import { useState } from 'react';

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
  const [goToValue, setGoToValue] = useState('');

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

  // Handlers
  const handleGoTo = () => {
    const page = parseInt(goToValue, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setGoToValue('');
    }
  };

  // Render
  return (
    <div className="flex items-center justify-center gap-4 py-4">
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
                  ? 'bg-indigo-500 text-white'
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

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Go to</span>
        <input
          type="text"
          value={goToValue}
          onChange={(e) => setGoToValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGoTo()}
          placeholder={`e.g ${totalPages}`}
          className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm text-center text-gray-600 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
